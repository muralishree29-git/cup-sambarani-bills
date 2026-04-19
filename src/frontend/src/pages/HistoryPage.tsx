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

// ─── Amount in words (Indian number system) ───────────────────────────────────
function numberToWords(amount: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function twoDigits(n: number): string {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]}${n % 10 !== 0 ? ` ${ones[n % 10]}` : ""}`;
  }

  function threeDigits(n: number): string {
    if (n >= 100) {
      return `${ones[Math.floor(n / 100)]} Hundred${n % 100 !== 0 ? ` ${twoDigits(n % 100)}` : ""}`;
    }
    return twoDigits(n);
  }

  const n = Math.round(amount);
  if (n === 0) return "Zero";

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const remainder = n % 1000;

  let result = "";
  if (crore > 0) result += `${threeDigits(crore)} Crore `;
  if (lakh > 0) result += `${threeDigits(lakh)} Lakh `;
  if (thousand > 0) result += `${threeDigits(thousand)} Thousand `;
  if (remainder > 0) result += threeDigits(remainder);

  return result.trim();
}

// ─── PDF export (Tax Invoice format) ─────────────────────────────────────────
const RS = "Rs. ";

async function loadImageAsDataUrl(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 2D context unavailable"));
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function exportBillPDFFromHistory(
  bill: Bill,
  settings: ProducerSettings | null,
) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  // Load peacock feather logo as base64 data URL
  let logoDataUrl: string | null = null;
  try {
    logoDataUrl = await loadImageAsDataUrl(
      "/assets/images/peacock-feather.png",
    );
  } catch {
    // If logo fails to load, continue without it
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const bLeft = 10;
  const bRight = 200;
  const bTop = 10;
  const contentW = bRight - bLeft;

  // ── Outer border ─────────────────────────────────────────────────────────
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(bLeft, bTop, contentW, pageH - 20);

  // ── TAX INVOICE title ────────────────────────────────────────────────────
  const titleY = bTop + 8;

  // Draw peacock feather logo (PNG image) to the left of the title
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", bLeft + 2, bTop + 1, 18, 18);
  }

  doc.setDrawColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("TAX INVOICE", pageW / 2, titleY, { align: "center" });

  const titleLineY = titleY + 3;
  doc.setLineWidth(0.3);
  doc.line(bLeft, titleLineY, bRight, titleLineY);

  // ── Header: two columns ───────────────────────────────────────────────────
  const headerTopY = titleLineY + 1;
  const leftColW = contentW * 0.6;
  const leftColRight = bLeft + leftColW;
  const rightColLeft = leftColRight;
  const headerBottomY = headerTopY + 42;

  doc.setLineWidth(0.3);
  doc.line(leftColRight, headerTopY, leftColRight, headerBottomY);

  // LEFT COLUMN: Company info
  const companyName = settings?.companyName ?? "VJ Traders";
  let lY = headerTopY + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(companyName, bLeft + 4, lY);
  lY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  if (settings?.address) {
    const addrLines = doc.splitTextToSize(
      settings.address,
      leftColW - 8,
    ) as string[];
    for (const line of addrLines) {
      doc.text(line, bLeft + 4, lY);
      lY += 4.5;
    }
  }
  if (settings?.gstNumber) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${settings.gstNumber}`, bLeft + 4, lY);
    doc.setFont("helvetica", "normal");
  }

  // RIGHT COLUMN: Invoice details
  const billDate = toDate(bill.date);
  const invoiceFields: [string, string][] = [
    ["Invoice No.", bill.billNumber],
    [
      "Invoice Dated",
      billDate
        .toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-"),
    ],
    ["Bill Type", "CREDIT"],
    ["Despatch Through", ""],
    ["Destination", ""],
    ["LR-RR-No.", ""],
    ["Vehicle No.", ""],
  ];

  let rY = headerTopY + 5;
  const labelX = rightColLeft + 3;
  const valueX = bRight - 4;

  for (const [label, value] of invoiceFields) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(label, labelX, rY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    if (value) doc.text(value, valueX, rY, { align: "right" });
    rY += 5.5;
    if (rY < headerBottomY - 2) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(rightColLeft + 2, rY - 1.5, bRight - 2, rY - 1.5);
      doc.setDrawColor(0, 0, 0);
    }
  }

  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(bLeft, headerBottomY, bRight, headerBottomY);

  // ── Billing parties section ────────────────────────────────────────────────
  const billPartiesTopY = headerBottomY;
  const billPartiesW = contentW * 0.55;
  const billPartiesRight = bLeft + billPartiesW;
  const shipLeftX = billPartiesRight;
  const billPartiesBottomY = billPartiesTopY + 32;

  doc.setLineWidth(0.3);
  doc.line(
    billPartiesRight,
    billPartiesTopY,
    billPartiesRight,
    billPartiesBottomY,
  );

  let btoY = billPartiesTopY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("To:", bLeft + 4, btoY);
  btoY += 5;

  const toName = bill.customerName || "Walk-in Customer";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(toName, bLeft + 4, btoY);
  btoY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  if (bill.customerAddress) {
    const addrLines = doc.splitTextToSize(
      bill.customerAddress,
      billPartiesW - 8,
    ) as string[];
    for (const line of addrLines) {
      doc.text(line, bLeft + 4, btoY);
      btoY += 4;
    }
  }

  // Ship To header
  let stoY = billPartiesTopY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Ship To:", shipLeftX + 4, stoY);

  doc.setLineWidth(0.3);
  doc.line(bLeft, billPartiesBottomY, bRight, billPartiesBottomY);

  // ── Product table ──────────────────────────────────────────────────────────
  const tableBody = bill.lineItems.map((it: LineItem, i: number) => [
    String(i + 1),
    it.productName,
    it.hsn || "",
    `${Number(it.gst)}%`,
    String(Number(it.quantity)),
    `${RS}${(Number(it.price) / 100).toFixed(2)}`,
    `${RS}${(Number(it.amount) / 100).toFixed(2)}`,
  ]);

  const totalGstAmt = Number(bill.gstAmount) / 100;
  const cgst = totalGstAmt / 2;
  const sgst = totalGstAmt / 2;
  const grandTotalAmt = Number(bill.grandTotal) / 100;

  const cgstRow = ["", "CGST", "", "", "", "", `${RS}${cgst.toFixed(2)}`];
  const sgstRow = ["", "SGST", "", "", "", "", `${RS}${sgst.toFixed(2)}`];
  const totalRow = [
    "",
    "TOTAL",
    "",
    "",
    "",
    "",
    `${RS}${grandTotalAmt.toFixed(2)}`,
  ];

  autoTable(doc, {
    startY: billPartiesBottomY,
    head: [
      [
        "S.No",
        "Description of Goods",
        "HSN Code",
        "GST %",
        "Quantity",
        "Rate",
        "Amount",
      ],
    ],
    body: [...tableBody, cgstRow, sgstRow, totalRow],
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "left", cellWidth: 64 },
      2: { halign: "center", cellWidth: 22 },
      3: { halign: "center", cellWidth: 14 },
      4: { halign: "center", cellWidth: 16 },
      5: { halign: "right", cellWidth: 31 },
      6: { halign: "right", cellWidth: 31 },
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      textColor: [0, 0, 0],
    },
    margin: { left: bLeft, right: pageW - bRight },
    tableWidth: contentW,
    didParseCell: (data) => {
      const summaryStart = tableBody.length;
      if (data.row.index >= summaryStart) {
        data.cell.styles.fontStyle =
          data.row.index === tableBody.length + 2 ? "bold" : "normal";
        data.cell.styles.fillColor =
          data.row.index === tableBody.length + 2
            ? [230, 230, 230]
            : [255, 255, 255];
      }
    },
  });

  const afterTableY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  // ── Tax summary table ──────────────────────────────────────────────────────
  const hsnMap = new Map<
    string,
    { hsn: string; gstPct: number; taxableValue: number }
  >();
  for (const it of bill.lineItems) {
    const gstPct = Number(it.gst);
    const key = `${it.hsn || "NIL"}-${gstPct}`;
    const existing = hsnMap.get(key);
    const itemAmt = Number(it.amount) / 100;
    if (existing) {
      existing.taxableValue += itemAmt;
    } else {
      hsnMap.set(key, { hsn: it.hsn || "NIL", gstPct, taxableValue: itemAmt });
    }
  }

  const hsnRows = Array.from(hsnMap.values()).map((row) => {
    const centralRate = row.gstPct / 2;
    const centralAmt = (row.taxableValue * centralRate) / 100;
    const stateAmt = centralAmt;
    const totalTaxAmt = centralAmt + stateAmt;
    return [
      row.hsn,
      `${RS}${row.taxableValue.toFixed(2)}`,
      `${centralRate.toFixed(1)}%`,
      `${RS}${centralAmt.toFixed(2)}`,
      `${centralRate.toFixed(1)}%`,
      `${RS}${stateAmt.toFixed(2)}`,
      `${RS}${totalTaxAmt.toFixed(2)}`,
    ];
  });

  const totalTaxableValue = Number(bill.subtotal) / 100;
  const totalTaxTotal = cgst + sgst;

  const taxTotalRow = [
    "Total",
    `${RS}${totalTaxableValue.toFixed(2)}`,
    "",
    `${RS}${cgst.toFixed(2)}`,
    "",
    `${RS}${sgst.toFixed(2)}`,
    `${RS}${totalTaxTotal.toFixed(2)}`,
  ];

  const grandTotalWords = numberToWords(Math.round(grandTotalAmt));
  const taxWords = numberToWords(Math.round(totalTaxTotal));

  autoTable(doc, {
    startY: afterTableY,
    head: [
      [
        "HSN Code",
        "Taxable Value",
        "Central Tax Rate %",
        "Central Tax Amount",
        "State Tax Rate %",
        "State Tax Amount",
        "Total Tax Amount",
      ],
    ],
    body: [
      [
        {
          content: `Rupees ${grandTotalWords} Only`,
          colSpan: 7,
          styles: {
            fontStyle: "italic",
            halign: "left",
            fillColor: [240, 240, 240],
          },
        },
      ],
      ...hsnRows,
      taxTotalRow.map((cell, i) => ({
        content: cell,
        styles: {
          fontStyle: "bold" as const,
          fillColor: [220, 220, 220] as [number, number, number],
          halign: (i === 0 ? "left" : "right") as "left" | "right",
        },
      })),
      [
        {
          content: `Tax Amount Rupees ${taxWords} Only`,
          colSpan: 7,
          styles: {
            fontStyle: "italic",
            halign: "left",
            fillColor: [240, 240, 240],
          },
        },
      ],
    ],
    headStyles: {
      fillColor: [0, 25, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 24 },
      1: { halign: "right", cellWidth: 30 },
      2: { halign: "center", cellWidth: 24 },
      3: { halign: "right", cellWidth: 30 },
      4: { halign: "center", cellWidth: 24 },
      5: { halign: "right", cellWidth: 30 },
      6: { halign: "right", cellWidth: 28 },
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      textColor: [0, 0, 0],
    },
    margin: { left: bLeft, right: pageW - bRight },
    tableWidth: contentW,
  });

  const afterTaxTableY = (
    doc as unknown as { lastAutoTable: { finalY: number } }
  ).lastAutoTable.finalY;

  // ── Footer section ─────────────────────────────────────────────────────────
  const footerTopY = Math.max(afterTaxTableY + 2, pageH - 55);

  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(bLeft, footerTopY, bRight, footerTopY);

  const footerLeftW = contentW * 0.55;
  const footerRightX = bLeft + footerLeftW;
  const footerBottomY = footerTopY + 38;

  doc.line(footerRightX, footerTopY, footerRightX, footerBottomY);

  // LEFT: Bank details
  let fY = footerTopY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Bank Details:", bLeft + 4, fY);
  fY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  if (settings) {
    if (settings.bankName) {
      doc.setFont("helvetica", "bold");
      doc.text("Bank Name: ", bLeft + 4, fY);
      doc.setFont("helvetica", "normal");
      doc.text(settings.bankName, bLeft + 28, fY);
      fY += 4.5;
    }
    if (settings.accountNumber) {
      doc.setFont("helvetica", "bold");
      doc.text("A/c No: ", bLeft + 4, fY);
      doc.setFont("helvetica", "normal");
      doc.text(settings.accountNumber, bLeft + 20, fY);
      fY += 4.5;
    }
    if (settings.bankName) {
      doc.setFont("helvetica", "bold");
      doc.text("Branch: ", bLeft + 4, fY);
      doc.setFont("helvetica", "normal");
      doc.text(settings.bankName, bLeft + 18, fY);
      fY += 4.5;
    }
    if (settings.ifscCode) {
      doc.setFont("helvetica", "bold");
      doc.text("IFSC: ", bLeft + 4, fY);
      doc.setFont("helvetica", "normal");
      doc.text(settings.ifscCode, bLeft + 14, fY);
    }
  }

  // RIGHT: Authorised signature
  const sigAreaW = bRight - footerRightX;
  const sigCenterX = footerRightX + sigAreaW / 2;
  let sY = footerTopY + 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`For ${companyName}`, sigCenterX, sY, { align: "center" });
  sY += 18;

  const signatoryName = settings?.authorisedSignatory ?? "";
  if (signatoryName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`(${signatoryName})`, sigCenterX, sY, { align: "center" });
    sY += 4.5;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("(Authorised Signature)", sigCenterX, sY, { align: "center" });

  doc.setLineWidth(0.3);
  doc.line(bLeft, footerBottomY, bRight, footerBottomY);

  const eoeY = footerBottomY + 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("E & O E", bLeft + 4, eoeY);
  doc.text("This is a computer generated invoice", pageW / 2, eoeY, {
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
        className={`border-b border-border cursor-pointer transition-smooth hover:bg-muted/40 ${isExpanded ? "bg-primary/5" : ""}`}
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
    ? `Showing ${filtered.length} ${filtered.length === 1 ? "bill" : "bills"} in ${monthOptions.find((m) => m.key === selectedMonth)?.label ?? selectedMonth}`
    : `Showing all ${sorted.length} ${sorted.length === 1 ? "bill" : "bills"}`;

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="history.page"
    >
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Bill History
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View and re-export all past bills
        </p>
      </div>

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
