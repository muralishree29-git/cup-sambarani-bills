import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  Receipt,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useListBills } from "../hooks/useBills";
import { useProducerSettings } from "../hooks/useSettings";
import type { Bill, LineItem, ProducerSettings } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDate(nanoseconds: bigint): Date {
  return new Date(Number(nanoseconds / 1_000_000n));
}

function formatDate(nanoseconds: bigint): string {
  return toDate(nanoseconds).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(paise: bigint): string {
  return `\u20B9${(Number(paise) / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Returns a stable key like "2026-04" and a label like "April 2026" */
function getMonthKey(nanoseconds: bigint): { key: string; label: string } {
  const d = toDate(nanoseconds);
  const year = d.getFullYear();
  const month = d.getMonth();
  const key = `${year}-${String(month + 1).padStart(2, "0")}`;
  const label = d.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  return { key, label };
}

// ─── PDF export (matches BillPage layout) ─────────────────────────────────────
// Note: \u20B9 is ₹. Modern jsPDF with helvetica supports it via UTF-8.
// If a square box appears, the PDF viewer lacks the glyph — use a full Unicode viewer.
const RS = "\u20B9";

async function exportBillPDFFromHistory(
  bill: Bill,
  settings: ProducerSettings | null,
) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const marginL = 14;
  const marginR = pageW - 14;

  // ── Section 1: FROM ────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(settings?.companyName ?? "Cup Sambarani", marginL, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let fromY = 24;
  if (settings?.address) {
    const addrLines = doc.splitTextToSize(settings.address, 85) as string[];
    doc.text(addrLines, marginL, fromY);
    fromY += addrLines.length * 4.5;
  }
  if (settings?.gstNumber) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${settings.gstNumber}`, marginL, fromY);
    doc.setFont("helvetica", "normal");
    fromY += 5;
  }

  // ── Section 2: Bill header (top-right) ────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(180, 100, 20);
  doc.text("TAX INVOICE", marginR, 18, { align: "right" });
  doc.setTextColor(0, 0, 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Bill No: ", marginR - 44, 26);
  doc.setFont("helvetica", "bold");
  doc.text(bill.billNumber, marginR, 26, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(
    `Date: ${toDate(bill.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
    marginR,
    31,
    { align: "right" },
  );

  // Bill To block
  let billToY = 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(120, 100, 60);
  doc.text("BILL TO", marginR - 55, billToY);
  doc.setTextColor(0, 0, 0);
  billToY += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  if (bill.customerName) {
    doc.text(bill.customerName, marginR, billToY, { align: "right" });
    billToY += 4.5;
  } else {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 120, 80);
    doc.text("Walk-in Customer", marginR, billToY, { align: "right" });
    doc.setTextColor(0, 0, 0);
    billToY += 4.5;
  }
  if (bill.customerAddress) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const addrLines = doc.splitTextToSize(bill.customerAddress, 55) as string[];
    for (const line of addrLines) {
      doc.text(line, marginR, billToY, { align: "right" });
      billToY += 4;
    }
  }

  const headerBottom = Math.max(fromY + 4, billToY + 4, 52);
  doc.setDrawColor(200, 170, 100);
  doc.setLineWidth(0.4);
  doc.line(marginL, headerBottom, marginR, headerBottom);

  // ── Section 3: Line-items table ───────────────────────────────────────────
  const tableRows = bill.lineItems.map((it: LineItem, i: number) => [
    i + 1,
    it.productName,
    it.hsn || "—",
    Number(it.quantity),
    `${RS}${(Number(it.price) / 100).toFixed(2)}`,
    `${Number(it.gst)}%`,
    `${RS}${(Number(it.gstAmount) / 100).toFixed(2)}`,
    `${RS}${(Number(it.amount) / 100).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: headerBottom + 4,
    head: [
      [
        "#",
        "Product Name",
        "HSN",
        "Qty",
        "Unit Price",
        "GST%",
        "GST Amt",
        "Total",
      ],
    ],
    body: tableRows,
    headStyles: {
      fillColor: [180, 120, 30],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: [255, 248, 235] },
    columnStyles: {
      0: { halign: "center", cellWidth: 8 },
      2: { halign: "center", cellWidth: 20 },
      3: { halign: "center", cellWidth: 12 },
      4: { halign: "right", cellWidth: 26 },
      5: { halign: "center", cellWidth: 14 },
      6: { halign: "right", cellWidth: 24 },
      7: { halign: "right", cellWidth: 26 },
    },
    styles: { fontSize: 9 },
  });

  const finalY =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 6;

  // ── Section 4: Totals ─────────────────────────────────────────────────────
  const totalsX = 130;
  const valX = marginR;
  const subtotalAmt = Number(bill.subtotal) / 100;
  const gstAmt = Number(bill.gstAmount) / 100;
  const grandTotalAmt = Number(bill.grandTotal) / 100;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Subtotal:", totalsX, finalY);
  doc.text(`${RS}${subtotalAmt.toFixed(2)}`, valX, finalY, { align: "right" });

  doc.text("Total GST:", totalsX, finalY + 5.5);
  doc.text(`${RS}${gstAmt.toFixed(2)}`, valX, finalY + 5.5, { align: "right" });

  doc.setDrawColor(180, 120, 30);
  doc.setLineWidth(0.3);
  doc.line(totalsX, finalY + 8, valX, finalY + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Grand Total:", totalsX, finalY + 14);
  doc.text(`${RS}${grandTotalAmt.toFixed(2)}`, valX, finalY + 14, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");

  // ── Section 5 & 6: Bank details + Authorised Signature ───────────────────
  const bottomY = finalY + 28;
  const pageH = 297;
  const bankY = Math.min(bottomY, pageH - 50);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 100, 60);
  doc.text("BANK DETAILS", marginL, bankY);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  let bY = bankY + 5;
  if (settings) {
    const rows: [string, string][] = [
      ["Bank Name", settings.bankName],
      ["Account Holder", settings.accountHolder],
      ["Account No.", settings.accountNumber],
      ["IFSC Code", settings.ifscCode],
    ];
    for (const [label, value] of rows) {
      if (value) {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, marginL, bY);
        doc.setFont("helvetica", "normal");
        doc.text(value, marginL + 28, bY);
        bY += 5;
      }
    }
  } else {
    doc.setTextColor(160, 140, 100);
    doc.text("(Bank details not configured)", marginL, bY);
    doc.setTextColor(0, 0, 0);
  }

  const sigBoxX = 135;
  const sigBoxW = marginR - sigBoxX;
  const sigLineY = bankY + 22;
  const signatoryName = settings?.authorisedSignatory ?? "";
  if (signatoryName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(signatoryName, sigBoxX + sigBoxW / 2, sigLineY - 4, {
      align: "center",
    });
  }
  doc.setDrawColor(100, 80, 40);
  doc.setLineWidth(0.4);
  doc.line(sigBoxX, sigLineY, sigBoxX + sigBoxW, sigLineY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(120, 100, 60);
  doc.text("Authorised Signature", sigBoxX + sigBoxW / 2, sigLineY + 5, {
    align: "center",
  });
  doc.setTextColor(0, 0, 0);

  // ── Section 7: Footer ─────────────────────────────────────────────────────
  const footerY = pageH - 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 120, 80);
  doc.setDrawColor(200, 170, 100);
  doc.setLineWidth(0.3);
  doc.line(marginL, footerY - 4, marginR, footerY - 4);
  doc.text("Thank you for your business!", pageW / 2, footerY, {
    align: "center",
  });

  doc.save(`${bill.billNumber}.pdf`);
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function BillDetail({
  bill,
  settings,
}: { bill: Bill; settings: ProducerSettings | null }) {
  return (
    <div
      className="bg-background border border-border rounded-lg p-4 mt-1 mb-2 shadow-warm"
      data-ocid="history.bill_detail"
    >
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
            Bill Details
          </p>
          <p className="font-display text-lg font-semibold text-foreground font-mono tracking-tight">
            #{bill.billNumber}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDate(bill.date)}
          </p>
          {bill.customerName && (
            <p className="text-sm text-foreground mt-0.5">
              {bill.customerName}
            </p>
          )}
          {bill.customerAddress && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {bill.customerAddress}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportBillPDFFromHistory(bill, settings)}
          className="flex items-center gap-2 border-primary/40 text-primary hover:bg-primary/10 transition-smooth"
          data-ocid="history.print_button"
        >
          <Printer className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      {/* Line items table */}
      <div className="rounded-md border border-border overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Product
              </th>
              <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                HSN
              </th>
              <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                GST%
              </th>
              <th className="text-right px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Rate
              </th>
              <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Qty
              </th>
              <th className="text-right px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {bill.lineItems.map((item: LineItem) => (
              <tr
                key={`${item.productId}-${item.productName}`}
                className="border-t border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-3 py-2 text-foreground">
                  {item.productName}
                </td>
                <td className="px-3 py-2 text-center text-muted-foreground text-xs font-mono">
                  {item.hsn || "—"}
                </td>
                <td className="px-3 py-2 text-center">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 tabular-nums"
                  >
                    {Number(item.gst)}%
                  </Badge>
                </td>
                <td className="px-3 py-2 text-right text-muted-foreground">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-3 py-2 text-center text-muted-foreground">
                  {Number(item.quantity)}
                </td>
                <td className="px-3 py-2 text-right font-medium text-foreground">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="ml-auto w-56 space-y-1 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(bill.subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Total GST</span>
          <span>{formatCurrency(bill.gstAmount)}</span>
        </div>
        <div className="flex justify-between font-semibold text-foreground border-t border-primary/30 pt-2 mt-2 text-base">
          <span>Grand Total</span>
          <span className="text-primary">
            {formatCurrency(bill.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Bill Row ─────────────────────────────────────────────────────────────────

function BillRow({
  bill,
  index,
  isExpanded,
  onToggle,
  settings,
}: {
  bill: Bill;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  settings: ProducerSettings | null;
}) {
  return (
    <>
      <tr
        className={`border-b border-border cursor-pointer transition-smooth hover:bg-muted/40 ${
          isExpanded ? "bg-primary/5" : ""
        }`}
        onClick={onToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
        tabIndex={0}
        data-ocid={`history.bill_row.${index + 1}`}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary shrink-0" />
            <span className="font-medium text-foreground font-mono text-xs tracking-tight">
              {bill.billNumber}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-muted-foreground text-sm">
          {formatDate(bill.date)}
        </td>
        <td className="px-4 py-3 text-sm">
          {bill.customerName ? (
            <span className="text-foreground">{bill.customerName}</span>
          ) : (
            <span className="text-border">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-right font-semibold text-foreground">
          {formatCurrency(bill.grandTotal)}
        </td>
        <td className="px-4 py-3 text-right">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary transition-smooth">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="px-4 pb-2">
            <BillDetail bill={bill} settings={settings} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-2" data-ocid="history.loading_state">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border border-border rounded-lg"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="history.empty_state"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        {isFiltered ? "No bills for this month" : "No bills yet"}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        {isFiltered ? (
          "Try selecting a different month or view all bills."
        ) : (
          <>
            Bills you create will appear here. Head to the{" "}
            <a
              href="/bill"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              data-ocid="history.create_bill_link"
            >
              Create Bill
            </a>{" "}
            page to get started.
          </>
        )}
      </p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      data-ocid="history.error_state"
    >
      <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-destructive" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
        Failed to load bills
      </h3>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ALL_MONTHS = "__all__";

export default function HistoryPage() {
  const { data: bills, isLoading, error } = useListBills();
  const { data: settings = null } = useProducerSettings();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(ALL_MONTHS);

  const sorted = useMemo(
    () => (bills ? [...bills].sort((a, b) => Number(b.date - a.date)) : []),
    [bills],
  );

  const monthOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const bill of sorted) {
      const { key, label } = getMonthKey(bill.date);
      if (!seen.has(key)) seen.set(key, label);
    }
    return Array.from(seen.entries()).map(([key, label]) => ({ key, label }));
  }, [sorted]);

  const filtered = useMemo(() => {
    if (selectedMonth === ALL_MONTHS) return sorted;
    return sorted.filter(
      (bill) => getMonthKey(bill.date).key === selectedMonth,
    );
  }, [sorted, selectedMonth]);

  function toggleRow(billId: string) {
    setExpandedId((prev) => (prev === billId ? null : billId));
  }

  const isFiltered = selectedMonth !== ALL_MONTHS;
  const countLabel = isFiltered
    ? `Showing ${filtered.length} ${filtered.length === 1 ? "bill" : "bills"} in ${
        monthOptions.find((m) => m.key === selectedMonth)?.label ??
        selectedMonth
      }`
    : `Showing all ${sorted.length} ${sorted.length === 1 ? "bill" : "bills"}`;

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="history.page"
    >
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Bill History
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View and re-export all past bills
        </p>
      </div>

      {/* Filter bar */}
      {!isLoading && !error && sorted.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <Select
              value={selectedMonth}
              onValueChange={(val) => {
                setSelectedMonth(val);
                setExpandedId(null);
              }}
            >
              <SelectTrigger
                className="w-48 h-9 text-sm"
                data-ocid="history.month_filter"
              >
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_MONTHS}>All Months</SelectItem>
                {monthOptions.map(({ key, label }) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm"
            data-ocid="history.bills_count"
          >
            {countLabel}
          </Badge>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState
          message={
            error instanceof Error ? error.message : "An unknown error occurred"
          }
        />
      ) : sorted.length === 0 ? (
        <EmptyState isFiltered={false} />
      ) : filtered.length === 0 ? (
        <EmptyState isFiltered={true} />
      ) : (
        <div
          className="bg-card rounded-xl border border-border shadow-warm overflow-hidden"
          data-ocid="history.table"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Bill No.
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Customer
                </th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Grand Total
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((bill, idx) => (
                <BillRow
                  key={bill.id.toString()}
                  bill={bill}
                  index={idx}
                  isExpanded={expandedId === bill.id.toString()}
                  onToggle={() => toggleRow(bill.id.toString())}
                  settings={settings}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
