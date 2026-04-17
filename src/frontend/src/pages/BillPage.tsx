import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  FilePlus2,
  Minus,
  Plus,
  Printer,
  Receipt,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useCreateBill } from "../hooks/useBills";
import { useListCustomers } from "../hooks/useCustomers";
import { useProducts } from "../hooks/useProducts";
import { useProducerSettings } from "../hooks/useSettings";
import type { Customer, LineItem, ProducerSettings, Product } from "../types";

// ── Currency helper (rupee symbol, en-IN locale) ──────────────────────────────
// Note: \u20B9 is the Indian Rupee sign ₹
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// PDF uses \u20B9 directly with helvetica; modern jsPDF supports it via UTF-8.
// If a square box appears in the PDF output it means the viewer font doesn't
// support the glyph — use a PDF viewer with full Unicode support.
const RS = "\u20B9";

// ── Local line-item type for the form ────────────────────────────────────────
interface LineItemForm {
  id: number;
  productId: bigint | null;
  productName: string;
  price: number; // in rupees
  quantity: number;
  amount: number; // in rupees
  gst: number; // percentage e.g. 18
  hsn: string;
  gstAmount: number; // in rupees
}

let lineItemCounter = 0;
function createEmptyLineItem(): LineItemForm {
  return {
    id: ++lineItemCounter,
    productId: null,
    productName: "",
    price: 0,
    quantity: 1,
    amount: 0,
    gst: 18,
    hsn: "",
    gstAmount: 0,
  };
}

// ── Line-item row component ───────────────────────────────────────────────────
interface LineItemRowProps {
  item: LineItemForm;
  index: number;
  products: Product[];
  onChange: (id: number, updates: Partial<LineItemForm>) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}

function LineItemRow({
  item,
  index,
  products,
  onChange,
  onRemove,
  canRemove,
}: LineItemRowProps) {
  function handleProductSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const productId = e.target.value ? BigInt(e.target.value) : null;
    const product = products.find((p) => p.id === productId);
    if (product) {
      const price = Number(product.price) / 100;
      const gst = Number(product.gst);
      const hsn = product.hsn;
      const amount = price * item.quantity;
      const gstAmount = Math.round(amount * gst) / 100;
      onChange(item.id, {
        productId: product.id,
        productName: product.name,
        price,
        gst,
        hsn,
        amount,
        gstAmount,
      });
    } else {
      onChange(item.id, {
        productId: null,
        productName: "",
        price: 0,
        gst: 18,
        hsn: "",
        amount: 0,
        gstAmount: 0,
      });
    }
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const qty = Math.max(1, Number.parseInt(e.target.value) || 1);
    const amount = item.price * qty;
    const gstAmount = Math.round(amount * item.gst) / 100;
    onChange(item.id, { quantity: qty, amount, gstAmount });
  }

  function handleQtyStep(delta: number) {
    const qty = Math.max(1, item.quantity + delta);
    const amount = item.price * qty;
    const gstAmount = Math.round(amount * item.gst) / 100;
    onChange(item.id, { quantity: qty, amount, gstAmount });
  }

  return (
    <div
      className="grid grid-cols-12 gap-2 items-center py-3 border-b border-border last:border-0"
      data-ocid={`bill.line_item.${index + 1}`}
    >
      {/* Serial */}
      <div className="col-span-1 text-center text-sm text-muted-foreground font-mono font-semibold">
        {index + 1}
      </div>

      {/* Product dropdown */}
      <div className="col-span-4">
        <select
          value={item.productId?.toString() ?? ""}
          onChange={handleProductSelect}
          data-ocid={`bill.product_select.${index + 1}`}
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
        >
          <option value="">— Select product —</option>
          {products.map((p) => (
            <option key={p.id.toString()} value={p.id.toString()}>
              {p.name} — {formatCurrency(Number(p.price) / 100)}
            </option>
          ))}
        </select>
      </div>

      {/* GST % */}
      <div className="col-span-1 text-center">
        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0 h-5 tabular-nums"
        >
          {item.gst}%
        </Badge>
      </div>

      {/* Qty stepper */}
      <div className="col-span-3 flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => handleQtyStep(-1)}
          disabled={item.quantity <= 1}
          data-ocid={`bill.qty_decrease.${index + 1}`}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <Input
          type="number"
          min={1}
          value={item.quantity}
          onChange={handleQuantityChange}
          className="h-8 text-center px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          data-ocid={`bill.qty_input.${index + 1}`}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => handleQtyStep(1)}
          data-ocid={`bill.qty_increase.${index + 1}`}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* Amount */}
      <div className="col-span-2 text-right text-sm font-semibold font-mono text-foreground">
        {item.amount > 0 ? formatCurrency(item.amount) : "—"}
      </div>

      {/* Remove */}
      <div className="col-span-1 flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(item.id)}
          disabled={!canRemove}
          aria-label="Remove line item"
          data-ocid={`bill.remove_item.${index + 1}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── PDF generation ────────────────────────────────────────────────────────────
async function exportBillPDF(bill: {
  billNumber: string;
  date: Date;
  customerName: string;
  customerAddress: string;
  lineItems: LineItemForm[];
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  settings: ProducerSettings | null;
}) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const marginL = 14;
  const marginR = pageW - 14;

  // ── Section 1: FROM (top-left) ───────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const companyName = bill.settings?.companyName ?? "Cup Sambarani";
  doc.text(companyName, marginL, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let fromY = 24;
  if (bill.settings?.address) {
    const addrLines = doc.splitTextToSize(
      bill.settings.address,
      85,
    ) as string[];
    doc.text(addrLines, marginL, fromY);
    fromY += addrLines.length * 4.5;
  }
  if (bill.settings?.gstNumber) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${bill.settings.gstNumber}`, marginL, fromY);
    doc.setFont("helvetica", "normal");
    fromY += 5;
  }

  // ── Section 2: Bill header (top-right) ──────────────────────────────────
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
    `Date: ${bill.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
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

  // Divider line
  const headerBottom = Math.max(fromY + 4, billToY + 4, 52);
  doc.setDrawColor(200, 170, 100);
  doc.setLineWidth(0.4);
  doc.line(marginL, headerBottom, marginR, headerBottom);

  // ── Section 3: Line-items table ──────────────────────────────────────────
  const tableRows = bill.lineItems
    .filter((it) => it.productId !== null)
    .map((it, i) => [
      i + 1,
      it.productName,
      it.hsn || "—",
      it.quantity,
      `${RS}${it.price.toFixed(2)}`,
      `${it.gst}%`,
      `${RS}${it.gstAmount.toFixed(2)}`,
      `${RS}${it.amount.toFixed(2)}`,
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

  // ── Section 4: Totals (right-aligned) ────────────────────────────────────
  const totalsX = 130;
  const valX = marginR;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Subtotal:", totalsX, finalY);
  doc.text(`${RS}${bill.subtotal.toFixed(2)}`, valX, finalY, {
    align: "right",
  });

  doc.text("Total GST:", totalsX, finalY + 5.5);
  doc.text(`${RS}${bill.totalGst.toFixed(2)}`, valX, finalY + 5.5, {
    align: "right",
  });

  doc.setDrawColor(180, 120, 30);
  doc.setLineWidth(0.3);
  doc.line(totalsX, finalY + 8, valX, finalY + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Grand Total:", totalsX, finalY + 14);
  doc.text(`${RS}${bill.grandTotal.toFixed(2)}`, valX, finalY + 14, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");

  // ── Sections 5 & 6: Bank details + Authorised Signature ──────────────────
  const bottomY = finalY + 28;
  const pageH = 297;
  // Ensure bank/sig block fits — if too close to bottom, push down
  const bankY = Math.min(bottomY, pageH - 50);

  // Bank details (left side)
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 100, 60);
  doc.text("BANK DETAILS", marginL, bankY);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  let bY = bankY + 5;
  if (bill.settings) {
    const rows: [string, string][] = [
      ["Bank Name", bill.settings.bankName],
      ["Account Holder", bill.settings.accountHolder],
      ["Account No.", bill.settings.accountNumber],
      ["IFSC Code", bill.settings.ifscCode],
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

  // Authorised Signature (right side)
  const sigBoxX = 135;
  const sigBoxW = marginR - sigBoxX;
  const sigLineY = bankY + 22;

  // Signatory name above line
  const signatoryName = bill.settings?.authorisedSignatory ?? "";
  if (signatoryName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(signatoryName, sigBoxX + sigBoxW / 2, sigLineY - 4, {
      align: "center",
    });
  }

  // Signature line
  doc.setDrawColor(100, 80, 40);
  doc.setLineWidth(0.4);
  doc.line(sigBoxX, sigLineY, sigBoxX + sigBoxW, sigLineY);

  // "Authorised Signature" label below line
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

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BillPage() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: customers = [] } = useListCustomers();
  const { data: settings = null } = useProducerSettings();
  const createBill = useCreateBill();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [lineItems, setLineItems] = useState<LineItemForm[]>([
    createEmptyLineItem(),
  ]);
  const [savedBill, setSavedBill] = useState<{
    billNumber: string;
    date: Date;
    validItems: LineItemForm[];
    subtotal: number;
    totalGst: number;
    grandTotal: number;
    customerName: string;
    customerAddress: string;
  } | null>(null);

  const updateLineItem = useCallback(
    (id: number, updates: Partial<LineItemForm>) => {
      setLineItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...updates } : it)),
      );
    },
    [],
  );

  const removeLineItem = useCallback((id: number) => {
    setLineItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const addLineItem = useCallback(() => {
    setLineItems((prev) => [...prev, createEmptyLineItem()]);
  }, []);

  // Resolve selected customer
  const selectedCustomer: Customer | undefined = customers.find(
    (c) => c.id.toString() === selectedCustomerId,
  );

  function handleCustomerSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedCustomerId(val);
    if (val) {
      const cust = customers.find((c) => c.id.toString() === val);
      setCustomerName(cust?.name ?? "");
    } else {
      setCustomerName("");
    }
  }

  const validItems = lineItems.filter((it) => it.productId !== null);
  const subtotal = validItems.reduce((sum, it) => sum + it.amount, 0);
  const totalGst = validItems.reduce((sum, it) => sum + it.gstAmount, 0);
  const grandTotal = subtotal + totalGst;
  const canGenerate = validItems.length > 0 && !createBill.isPending;

  async function handleGenerateBill() {
    if (!canGenerate) return;

    const backendLineItems: LineItem[] = validItems.map((it) => ({
      productId: it.productId!,
      productName: it.productName,
      price: BigInt(Math.round(it.price * 100)),
      quantity: BigInt(it.quantity),
      amount: BigInt(Math.round(it.amount * 100)),
      gst: BigInt(it.gst),
      hsn: it.hsn,
      gstAmount: BigInt(Math.round(it.gstAmount * 100)),
    }));

    const resolvedName = customerName.trim() || null;
    const resolvedAddress = selectedCustomer?.address?.trim() || null;
    const resolvedId = selectedCustomer ? selectedCustomer.id : null;

    try {
      const bill = await createBill.mutateAsync({
        customerName: resolvedName,
        customerId: resolvedId,
        customerAddress: resolvedAddress,
        lineItems: backendLineItems,
      });

      const billDate = new Date(Number(bill.date) / 1_000_000);

      await exportBillPDF({
        billNumber: bill.billNumber,
        date: billDate,
        customerName: resolvedName ?? "",
        customerAddress: resolvedAddress ?? "",
        lineItems: validItems,
        subtotal,
        totalGst,
        grandTotal,
        settings,
      });

      setSavedBill({
        billNumber: bill.billNumber,
        date: billDate,
        validItems,
        subtotal,
        totalGst,
        grandTotal,
        customerName: resolvedName ?? "",
        customerAddress: resolvedAddress ?? "",
      });
      toast.success(`Bill ${bill.billNumber} saved & exported!`);
    } catch (err) {
      toast.error("Failed to save bill. Please try again.");
      console.error(err);
    }
  }

  function handleNewBill() {
    setSelectedCustomerId("");
    setCustomerName("");
    setLineItems([createEmptyLineItem()]);
    setSavedBill(null);
  }

  // ── Success state ─────────────────────────────────────────
  if (savedBill) {
    return (
      <div
        className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center gap-6"
        data-ocid="bill.success_state"
      >
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Bill Generated!
          </h2>
          <p className="text-muted-foreground text-sm">
            <strong>{savedBill.billNumber}</strong> saved on{" "}
            {savedBill.date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Your PDF download has started automatically.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button
            onClick={handleNewBill}
            className="gap-2"
            data-ocid="bill.new_bill_button"
          >
            <FilePlus2 className="w-4 h-4" />
            Create New Bill
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await exportBillPDF({
                billNumber: savedBill.billNumber,
                date: savedBill.date,
                customerName: savedBill.customerName,
                customerAddress: savedBill.customerAddress,
                lineItems: savedBill.validItems,
                subtotal: savedBill.subtotal,
                totalGst: savedBill.totalGst,
                grandTotal: savedBill.grandTotal,
                settings,
              });
            }}
            className="gap-2"
            data-ocid="bill.reprint_button"
          >
            <Printer className="w-4 h-4" />
            Re-print PDF
          </Button>
        </div>
      </div>
    );
  }

  // ── Bill form ─────────────────────────────────────────────
  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6"
      data-ocid="bill.page"
    >
      {/* Page heading */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
          <Receipt className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">
            New Bill
          </h1>
          <p className="text-xs text-muted-foreground">Cup Sambarani</p>
        </div>
      </div>

      {/* Customer details */}
      <Card className="shadow-warm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing customer dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="customer-select" className="text-sm">
              Select Existing Customer{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <select
              id="customer-select"
              value={selectedCustomerId}
              onChange={handleCustomerSelect}
              data-ocid="bill.customer_select"
              className="w-full max-w-sm h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            >
              <option value="">— Walk-in / New Customer —</option>
              {customers.map((c) => (
                <option key={c.id.toString()} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Manual name entry (shown when no customer selected) */}
          {!selectedCustomerId && (
            <div className="space-y-1.5">
              <Label htmlFor="customer-name" className="text-sm">
                Customer Name{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="customer-name"
                placeholder="e.g. Ravi Kumar"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                data-ocid="bill.customer_name_input"
                className="max-w-sm"
              />
            </div>
          )}

          {/* Show address of selected customer */}
          {selectedCustomer && (
            <div className="bg-muted/40 rounded-lg px-4 py-3 space-y-0.5 max-w-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Address
              </p>
              <p className="text-sm text-foreground">
                {selectedCustomer.address || "—"}
              </p>
              {selectedCustomer.phone && (
                <p className="text-xs text-muted-foreground">
                  {selectedCustomer.phone}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Line items */}
      <Card className="shadow-warm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Line Items
            </CardTitle>
            {validItems.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {validItems.length} item{validItems.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-6 py-2 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Product</div>
            <div className="col-span-1 text-center">GST</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1" />
          </div>

          {/* Rows */}
          <div className="px-6">
            {productsLoading ? (
              <div className="py-4 space-y-2" data-ocid="bill.loading_state">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              lineItems.map((item, index) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  products={products}
                  onChange={updateLineItem}
                  onRemove={removeLineItem}
                  canRemove={lineItems.length > 1}
                />
              ))
            )}
          </div>

          {/* Add row button */}
          <div className="px-6 py-3 border-t border-border bg-muted/20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
              className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-smooth"
              data-ocid="bill.add_item_button"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Line Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card className="shadow-warm">
        <CardContent className="pt-5">
          <div className="max-w-sm ml-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                Total GST
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  per item
                </Badge>
              </span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(totalGst)}
              </span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Grand Total</span>
              <span className="font-display text-xl font-bold text-primary font-mono">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate button */}
      <div className="flex justify-end gap-3 pb-4">
        {validItems.length === 0 && (
          <p
            className="text-sm text-muted-foreground self-center"
            data-ocid="bill.no_items_hint"
          >
            Add at least one line item to generate a bill.
          </p>
        )}
        <Button
          size="lg"
          onClick={handleGenerateBill}
          disabled={!canGenerate}
          className="gap-2 font-semibold px-8"
          data-ocid="bill.generate_button"
        >
          {createBill.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Printer className="w-4 h-4" />
              Generate Bill & Export PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
