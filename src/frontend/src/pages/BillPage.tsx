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
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

const RS = "Rs. ";

// ── Amount in words (Indian number system) ────────────────────────────────────
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

// ── Local line-item type for the form ────────────────────────────────────────
interface LineItemForm {
  id: number;
  productId: bigint | null;
  productName: string;
  price: number;
  quantity: number;
  amount: number;
  gst: number;
  hsn: string;
  gstAmount: number;
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
      <div className="col-span-1 text-center text-sm text-muted-foreground font-mono font-semibold">
        {index + 1}
      </div>
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
      <div className="col-span-1 text-center">
        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0 h-5 tabular-nums"
        >
          {item.gst}%
        </Badge>
      </div>
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
      <div className="col-span-2 text-right text-sm font-semibold font-mono text-foreground">
        {item.amount > 0 ? formatCurrency(item.amount) : "—"}
      </div>
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

// ── PDF generation (Tax Invoice format) ──────────────────────────────────────
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

async function exportBillPDF(bill: {
  billNumber: string;
  date: Date;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerGstin?: string;
  lineItems: LineItemForm[];
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  settings: ProducerSettings | null;
}) {
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
  const bLeft = 10; // border left
  const bRight = 200; // border right
  const bTop = 10; // border top
  const contentW = bRight - bLeft;

  // ── Outer border ──────────────────────────────────────────────────────────
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(bLeft, bTop, contentW, pageH - 20);

  // ── Row 1: TAX INVOICE title ─────────────────────────────────────────────
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

  // Horizontal line below title
  const titleLineY = titleY + 3;
  doc.setLineWidth(0.3);
  doc.line(bLeft, titleLineY, bRight, titleLineY);

  // ── Header section: two columns ───────────────────────────────────────────
  const headerTopY = titleLineY + 1;
  const leftColW = contentW * 0.6;
  const leftColRight = bLeft + leftColW;
  const rightColLeft = leftColRight;

  // Vertical divider between columns
  const headerBottomY = headerTopY + 42;
  doc.setLineWidth(0.3);
  doc.line(leftColRight, headerTopY, leftColRight, headerBottomY);

  // LEFT COLUMN: Company info
  let lY = headerTopY + 6;
  const companyName = bill.settings?.companyName ?? "VJ Traders";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(companyName, bLeft + 4, lY);
  lY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  if (bill.settings?.address) {
    const addrLines = doc.splitTextToSize(
      bill.settings.address,
      leftColW - 8,
    ) as string[];
    for (const line of addrLines) {
      doc.text(line, bLeft + 4, lY);
      lY += 4.5;
    }
  }
  if (bill.settings?.gstNumber) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${bill.settings.gstNumber}`, bLeft + 4, lY);
    doc.setFont("helvetica", "normal");
    lY += 4.5;
  }

  // RIGHT COLUMN: Invoice details
  const invoiceFields: [string, string][] = [
    ["Invoice No.", bill.billNumber],
    [
      "Invoice Dated",
      bill.date
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
    if (value) {
      doc.text(value, valueX, rY, { align: "right" });
    }
    // Small divider line between fields
    rY += 5.5;
    if (rY < headerBottomY - 2) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(rightColLeft + 2, rY - 1.5, bRight - 2, rY - 1.5);
      doc.setDrawColor(0, 0, 0);
    }
  }

  // Horizontal line below header
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(bLeft, headerBottomY, bRight, headerBottomY);

  // ── Billing parties section ────────────────────────────────────────────────
  const billPartiesTopY = headerBottomY;
  const billPartiesW = contentW * 0.55;
  const billPartiesRight = bLeft + billPartiesW;
  const shipLeftX = billPartiesRight;
  const billPartiesBottomY = billPartiesTopY + 32;

  // Vertical divider
  doc.setLineWidth(0.3);
  doc.line(
    billPartiesRight,
    billPartiesTopY,
    billPartiesRight,
    billPartiesBottomY,
  );

  // LEFT: Billing To
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
  if (bill.customerPhone) {
    doc.text(`Ph: ${bill.customerPhone}`, bLeft + 4, btoY);
    btoY += 4;
  }
  if (bill.customerGstin) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${bill.customerGstin}`, bLeft + 4, btoY);
  }

  // RIGHT: Ship To
  let stoY = billPartiesTopY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Ship To:", shipLeftX + 4, stoY);

  // Horizontal line below billing parties
  doc.setLineWidth(0.3);
  doc.line(bLeft, billPartiesBottomY, bRight, billPartiesBottomY);

  // ── Product table ──────────────────────────────────────────────────────────
  const validItems = bill.lineItems.filter((it) => it.productId !== null);

  const tableBody = validItems.map((it, i) => [
    String(i + 1),
    it.productName,
    it.hsn || "",
    `${it.gst}%`,
    String(it.quantity),
    `${RS}${it.price.toFixed(2)}`,
    `${RS}${it.amount.toFixed(2)}`,
  ]);

  // Calculate CGST/SGST totals
  const totalGst = validItems.reduce((s, it) => s + it.gstAmount, 0);
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;

  // Add summary rows
  const cgstRow = ["", "CGST", "", "", "", "", `${RS}${cgst.toFixed(2)}`];
  const sgstRow = ["", "SGST", "", "", "", "", `${RS}${sgst.toFixed(2)}`];
  const totalRow = [
    "",
    "TOTAL",
    "",
    "",
    "",
    "",
    `${RS}${bill.grandTotal.toFixed(2)}`,
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
      // Bold CGST, SGST, TOTAL summary rows
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
  // Compute per-HSN breakdown
  const hsnMap = new Map<
    string,
    { hsn: string; gstPct: number; taxableValue: number }
  >();
  for (const it of validItems) {
    const key = `${it.hsn || "NIL"}-${it.gst}`;
    const existing = hsnMap.get(key);
    if (existing) {
      existing.taxableValue += it.amount;
    } else {
      hsnMap.set(key, {
        hsn: it.hsn || "NIL",
        gstPct: it.gst,
        taxableValue: it.amount,
      });
    }
  }

  const hsnRows = Array.from(hsnMap.values()).map((row) => {
    const centralRate = row.gstPct / 2;
    const centralAmt = (row.taxableValue * centralRate) / 100;
    const stateRate = centralRate;
    const stateAmt = centralAmt;
    const totalTaxAmt = centralAmt + stateAmt;
    return [
      row.hsn,
      `${RS}${row.taxableValue.toFixed(2)}`,
      `${centralRate.toFixed(1)}%`,
      `${RS}${centralAmt.toFixed(2)}`,
      `${stateRate.toFixed(1)}%`,
      `${RS}${stateAmt.toFixed(2)}`,
      `${RS}${totalTaxAmt.toFixed(2)}`,
    ];
  });

  // Total row for tax table
  const totalTaxableValue = validItems.reduce((s, it) => s + it.amount, 0);
  const totalCentralTax = cgst;
  const totalStateTax = sgst;
  const totalTaxTotal = totalCentralTax + totalStateTax;

  const taxTotalRow = [
    "Total",
    `${RS}${totalTaxableValue.toFixed(2)}`,
    "",
    `${RS}${totalCentralTax.toFixed(2)}`,
    "",
    `${RS}${totalStateTax.toFixed(2)}`,
    `${RS}${totalTaxTotal.toFixed(2)}`,
  ];

  // Amount in words rows
  const grandTotalWords = numberToWords(Math.round(bill.grandTotal));
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

  // ── Footer section ────────────────────────────────────────────────────────
  // Ensure footer fits — if not enough space, push to bottom area
  const footerTopY = Math.max(afterTaxTableY + 2, pageH - 55);

  // Horizontal separator
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(bLeft, footerTopY, bRight, footerTopY);

  const footerLeftW = contentW * 0.55;
  const footerRightX = bLeft + footerLeftW;

  // Vertical divider in footer
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
  if (bill.settings) {
    if (bill.settings.bankName) {
      doc.setFont("helvetica", "bold");
      doc.text("Bank Name: ", bLeft + 4, fY);
      doc.setFont("helvetica", "normal");
      doc.text(bill.settings.bankName, bLeft + 28, fY);
      fY += 4.5;
    }
    if (bill.settings.accountNumber) {
      doc.setFont("helvetica", "bold");
      doc.text("A/c No: ", bLeft + 4, fY);
      doc.setFont("helvetica", "normal");
      doc.text(bill.settings.accountNumber, bLeft + 20, fY);
      fY += 4.5;
    }
    if (bill.settings.bankName) {
      doc.setFont("helvetica", "bold");
      doc.text("Branch: ", bLeft + 4, fY);
      doc.setFont("helvetica", "normal");
      doc.text(bill.settings.bankName, bLeft + 18, fY);
      fY += 4.5;
    }
    if (bill.settings.ifscCode) {
      doc.setFont("helvetica", "bold");
      doc.text("IFSC: ", bLeft + 4, fY);
      doc.setFont("helvetica", "normal");
      doc.text(bill.settings.ifscCode, bLeft + 14, fY);
    }
  }

  // RIGHT: Authorised signature
  const sigAreaW = bRight - footerRightX;
  const sigCenterX = footerRightX + sigAreaW / 2;
  let sY = footerTopY + 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`For ${companyName}`, sigCenterX, sY, { align: "center" });
  sY += 18; // blank signature space

  const signatoryName = bill.settings?.authorisedSignatory ?? "";
  if (signatoryName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`(${signatoryName})`, sigCenterX, sY, { align: "center" });
    sY += 4.5;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("(Authorised Signature)", sigCenterX, sY, { align: "center" });

  // Bottom line
  doc.setLineWidth(0.3);
  doc.line(bLeft, footerBottomY, bRight, footerBottomY);

  // E & O E and disclaimer
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
    customerPhone?: string;
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
    const resolvedPhone = selectedCustomer?.phone?.trim() || null;
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
        customerPhone: resolvedPhone ?? undefined,
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
        customerPhone: resolvedPhone ?? undefined,
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
                customerPhone: savedBill.customerPhone,
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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
          <Receipt className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">
            New Bill
          </h1>
          <p className="text-xs text-muted-foreground">VJ Traders</p>
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
          <div className="grid grid-cols-12 gap-2 px-6 py-2 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Product</div>
            <div className="col-span-1 text-center">GST</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1" />
          </div>
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
