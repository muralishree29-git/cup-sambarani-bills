const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-DnvR200U.js","assets/index-0LLgf19x.js","assets/index-CqS9nNoC.css"])))=>i.map(i=>d[i]);
import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, r as reactExports, B as Button, R as Receipt, S as Skeleton, u as ue, _ as __vitePreload } from "./index-0LLgf19x.js";
import { B as Badge } from "./badge-DyZ4rYC9.js";
import { L as Label, I as Input } from "./label-zZil5QxY.js";
import { U as User, S as Separator } from "./separator-BRmH-EoE.js";
import { u as useCreateBill, P as Printer } from "./useBills-D9SiONgQ.js";
import { u as useListCustomers } from "./useCustomers-CPUGJcFK.js";
import { u as useProducts } from "./useProducts-nKaT45n7.js";
import { u as useProducerSettings } from "./useSettings-C-w1-D9M.js";
import { P as Plus, T as Trash2 } from "./trash-2-BB98loSN.js";
import "./backend-DIaqbPiA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M3 15h6", key: "4e2qda" }],
  ["path", { d: "M6 12v6", key: "1u72j0" }]
];
const FilePlus2 = createLucideIcon("file-plus-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(amount);
}
const RS = "Rs. ";
function numberToWords(amount) {
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
    "Nineteen"
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
    "Ninety"
  ];
  function twoDigits(n2) {
    if (n2 < 20) return ones[n2];
    return `${tens[Math.floor(n2 / 10)]}${n2 % 10 !== 0 ? ` ${ones[n2 % 10]}` : ""}`;
  }
  function threeDigits(n2) {
    if (n2 >= 100) {
      return `${ones[Math.floor(n2 / 100)]} Hundred${n2 % 100 !== 0 ? ` ${twoDigits(n2 % 100)}` : ""}`;
    }
    return twoDigits(n2);
  }
  const n = Math.round(amount);
  if (n === 0) return "Zero";
  const crore = Math.floor(n / 1e7);
  const lakh = Math.floor(n % 1e7 / 1e5);
  const thousand = Math.floor(n % 1e5 / 1e3);
  const remainder = n % 1e3;
  let result = "";
  if (crore > 0) result += `${threeDigits(crore)} Crore `;
  if (lakh > 0) result += `${threeDigits(lakh)} Lakh `;
  if (thousand > 0) result += `${threeDigits(thousand)} Thousand `;
  if (remainder > 0) result += threeDigits(remainder);
  return result.trim();
}
let lineItemCounter = 0;
function createEmptyLineItem() {
  return {
    id: ++lineItemCounter,
    productId: null,
    productName: "",
    price: 0,
    quantity: 1,
    amount: 0,
    gst: 18,
    hsn: "",
    gstAmount: 0
  };
}
function LineItemRow({
  item,
  index,
  products,
  onChange,
  onRemove,
  canRemove
}) {
  var _a;
  function handleProductSelect(e) {
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
        gstAmount
      });
    } else {
      onChange(item.id, {
        productId: null,
        productName: "",
        price: 0,
        gst: 18,
        hsn: "",
        amount: 0,
        gstAmount: 0
      });
    }
  }
  function handleQuantityChange(e) {
    const qty = Math.max(1, Number.parseInt(e.target.value) || 1);
    const amount = item.price * qty;
    const gstAmount = Math.round(amount * item.gst) / 100;
    onChange(item.id, { quantity: qty, amount, gstAmount });
  }
  function handleQtyStep(delta) {
    const qty = Math.max(1, item.quantity + delta);
    const amount = item.price * qty;
    const gstAmount = Math.round(amount * item.gst) / 100;
    onChange(item.id, { quantity: qty, amount, gstAmount });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid grid-cols-12 gap-2 items-center py-3 border-b border-border last:border-0",
      "data-ocid": `bill.line_item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 text-center text-sm text-muted-foreground font-mono font-semibold", children: index + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: ((_a = item.productId) == null ? void 0 : _a.toString()) ?? "",
            onChange: handleProductSelect,
            "data-ocid": `bill.product_select.${index + 1}`,
            className: "w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select product —" }),
              products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id.toString(), children: [
                p.name,
                " — ",
                formatCurrency(Number(p.price) / 100)
              ] }, p.id.toString()))
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "secondary",
            className: "text-[10px] px-1.5 py-0 h-5 tabular-nums",
            children: [
              item.gst,
              "%"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              className: "h-8 w-8 shrink-0",
              onClick: () => handleQtyStep(-1),
              disabled: item.quantity <= 1,
              "data-ocid": `bill.qty_decrease.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 1,
              value: item.quantity,
              onChange: handleQuantityChange,
              className: "h-8 text-center px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none",
              "data-ocid": `bill.qty_input.${index + 1}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              className: "h-8 w-8 shrink-0",
              onClick: () => handleQtyStep(1),
              "data-ocid": `bill.qty_increase.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right text-sm font-semibold font-mono text-foreground", children: item.amount > 0 ? formatCurrency(item.amount) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
            onClick: () => onRemove(item.id),
            disabled: !canRemove,
            "aria-label": "Remove line item",
            "data-ocid": `bill.remove_item.${index + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
          }
        ) })
      ]
    }
  );
}
async function loadImageAsDataUrl(src) {
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
async function exportBillPDF(bill) {
  var _a, _b, _c, _d;
  const { default: jsPDF } = await __vitePreload(async () => {
    const { default: jsPDF2 } = await import("./jspdf.es.min-DnvR200U.js").then((n) => n.j);
    return { default: jsPDF2 };
  }, true ? __vite__mapDeps([0,1,2]) : void 0);
  const { default: autoTable } = await __vitePreload(async () => {
    const { default: autoTable2 } = await import("./jspdf.plugin.autotable-CG7Tlg14.js");
    return { default: autoTable2 };
  }, true ? [] : void 0);
  let logoDataUrl = null;
  try {
    logoDataUrl = await loadImageAsDataUrl(
      "/assets/images/peacock-feather.png"
    );
  } catch {
  }
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const bLeft = 10;
  const bRight = 200;
  const bTop = 10;
  const contentW = bRight - bLeft;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(bLeft, bTop, contentW, pageH - 20);
  const titleY = bTop + 8;
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
  const headerTopY = titleLineY + 1;
  const leftColW = contentW * 0.6;
  const leftColRight = bLeft + leftColW;
  const rightColLeft = leftColRight;
  const headerBottomY = headerTopY + 42;
  doc.setLineWidth(0.3);
  doc.line(leftColRight, headerTopY, leftColRight, headerBottomY);
  let lY = headerTopY + 6;
  const companyName = ((_a = bill.settings) == null ? void 0 : _a.companyName) ?? "VJ Traders";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(companyName, bLeft + 4, lY);
  lY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  if ((_b = bill.settings) == null ? void 0 : _b.address) {
    const addrLines = doc.splitTextToSize(
      bill.settings.address,
      leftColW - 8
    );
    for (const line of addrLines) {
      doc.text(line, bLeft + 4, lY);
      lY += 4.5;
    }
  }
  if ((_c = bill.settings) == null ? void 0 : _c.gstNumber) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${bill.settings.gstNumber}`, bLeft + 4, lY);
    doc.setFont("helvetica", "normal");
    lY += 4.5;
  }
  const invoiceFields = [
    ["Invoice No.", bill.billNumber],
    [
      "Invoice Dated",
      bill.date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).replace(/\//g, "-")
    ],
    ["Bill Type", "CREDIT"],
    ["Despatch Through", ""],
    ["Destination", ""],
    ["LR-RR-No.", ""],
    ["Vehicle No.", ""]
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
    billPartiesBottomY
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
      billPartiesW - 8
    );
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
  let stoY = billPartiesTopY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Ship To:", shipLeftX + 4, stoY);
  doc.setLineWidth(0.3);
  doc.line(bLeft, billPartiesBottomY, bRight, billPartiesBottomY);
  const validItems = bill.lineItems.filter((it) => it.productId !== null);
  const tableBody = validItems.map((it, i) => [
    String(i + 1),
    it.productName,
    it.hsn || "",
    `${it.gst}%`,
    String(it.quantity),
    `${RS}${it.price.toFixed(2)}`,
    `${RS}${it.amount.toFixed(2)}`
  ]);
  const totalGst = validItems.reduce((s, it) => s + it.gstAmount, 0);
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const cgstRow = ["", "CGST", "", "", "", "", `${RS}${cgst.toFixed(2)}`];
  const sgstRow = ["", "SGST", "", "", "", "", `${RS}${sgst.toFixed(2)}`];
  const totalRow = [
    "",
    "TOTAL",
    "",
    "",
    "",
    "",
    `${RS}${bill.grandTotal.toFixed(2)}`
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
        "Amount"
      ]
    ],
    body: [...tableBody, cgstRow, sgstRow, totalRow],
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center"
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "left", cellWidth: 64 },
      2: { halign: "center", cellWidth: 22 },
      3: { halign: "center", cellWidth: 14 },
      4: { halign: "center", cellWidth: 16 },
      5: { halign: "right", cellWidth: 31 },
      6: { halign: "right", cellWidth: 31 }
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      textColor: [0, 0, 0]
    },
    margin: { left: bLeft, right: pageW - bRight },
    tableWidth: contentW,
    didParseCell: (data) => {
      const summaryStart = tableBody.length;
      if (data.row.index >= summaryStart) {
        data.cell.styles.fontStyle = data.row.index === tableBody.length + 2 ? "bold" : "normal";
        data.cell.styles.fillColor = data.row.index === tableBody.length + 2 ? [230, 230, 230] : [255, 255, 255];
      }
    }
  });
  const afterTableY = doc.lastAutoTable.finalY;
  const hsnMap = /* @__PURE__ */ new Map();
  for (const it of validItems) {
    const key = `${it.hsn || "NIL"}-${it.gst}`;
    const existing = hsnMap.get(key);
    if (existing) {
      existing.taxableValue += it.amount;
    } else {
      hsnMap.set(key, {
        hsn: it.hsn || "NIL",
        gstPct: it.gst,
        taxableValue: it.amount
      });
    }
  }
  const hsnRows = Array.from(hsnMap.values()).map((row) => {
    const centralRate = row.gstPct / 2;
    const centralAmt = row.taxableValue * centralRate / 100;
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
      `${RS}${totalTaxAmt.toFixed(2)}`
    ];
  });
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
    `${RS}${totalTaxTotal.toFixed(2)}`
  ];
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
        "Total Tax Amount"
      ]
    ],
    body: [
      [
        {
          content: `Rupees ${grandTotalWords} Only`,
          colSpan: 7,
          styles: {
            fontStyle: "italic",
            halign: "left",
            fillColor: [240, 240, 240]
          }
        }
      ],
      ...hsnRows,
      taxTotalRow.map((cell, i) => ({
        content: cell,
        styles: {
          fontStyle: "bold",
          fillColor: [220, 220, 220],
          halign: i === 0 ? "left" : "right"
        }
      })),
      [
        {
          content: `Tax Amount Rupees ${taxWords} Only`,
          colSpan: 7,
          styles: {
            fontStyle: "italic",
            halign: "left",
            fillColor: [240, 240, 240]
          }
        }
      ]
    ],
    headStyles: {
      fillColor: [0, 25, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
      halign: "center"
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 24 },
      1: { halign: "right", cellWidth: 30 },
      2: { halign: "center", cellWidth: 24 },
      3: { halign: "right", cellWidth: 30 },
      4: { halign: "center", cellWidth: 24 },
      5: { halign: "right", cellWidth: 30 },
      6: { halign: "right", cellWidth: 28 }
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      textColor: [0, 0, 0]
    },
    margin: { left: bLeft, right: pageW - bRight },
    tableWidth: contentW
  });
  const afterTaxTableY = doc.lastAutoTable.finalY;
  const footerTopY = Math.max(afterTaxTableY + 2, pageH - 55);
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(bLeft, footerTopY, bRight, footerTopY);
  const footerLeftW = contentW * 0.55;
  const footerRightX = bLeft + footerLeftW;
  const footerBottomY = footerTopY + 38;
  doc.line(footerRightX, footerTopY, footerRightX, footerBottomY);
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
  const sigAreaW = bRight - footerRightX;
  const sigCenterX = footerRightX + sigAreaW / 2;
  let sY = footerTopY + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`For ${companyName}`, sigCenterX, sY, { align: "center" });
  sY += 18;
  const signatoryName = ((_d = bill.settings) == null ? void 0 : _d.authorisedSignatory) ?? "";
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
    align: "center"
  });
  doc.save(`${bill.billNumber}.pdf`);
}
function BillPage() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: customers = [] } = useListCustomers();
  const { data: settings = null } = useProducerSettings();
  const createBill = useCreateBill();
  const [selectedCustomerId, setSelectedCustomerId] = reactExports.useState("");
  const [customerName, setCustomerName] = reactExports.useState("");
  const [lineItems, setLineItems] = reactExports.useState([
    createEmptyLineItem()
  ]);
  const [savedBill, setSavedBill] = reactExports.useState(null);
  const updateLineItem = reactExports.useCallback(
    (id, updates) => {
      setLineItems(
        (prev) => prev.map((it) => it.id === id ? { ...it, ...updates } : it)
      );
    },
    []
  );
  const removeLineItem = reactExports.useCallback((id) => {
    setLineItems((prev) => prev.filter((it) => it.id !== id));
  }, []);
  const addLineItem = reactExports.useCallback(() => {
    setLineItems((prev) => [...prev, createEmptyLineItem()]);
  }, []);
  const selectedCustomer = customers.find(
    (c) => c.id.toString() === selectedCustomerId
  );
  function handleCustomerSelect(e) {
    const val = e.target.value;
    setSelectedCustomerId(val);
    if (val) {
      const cust = customers.find((c) => c.id.toString() === val);
      setCustomerName((cust == null ? void 0 : cust.name) ?? "");
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
    var _a, _b;
    if (!canGenerate) return;
    const backendLineItems = validItems.map((it) => ({
      productId: it.productId,
      productName: it.productName,
      price: BigInt(Math.round(it.price * 100)),
      quantity: BigInt(it.quantity),
      amount: BigInt(Math.round(it.amount * 100)),
      gst: BigInt(it.gst),
      hsn: it.hsn,
      gstAmount: BigInt(Math.round(it.gstAmount * 100))
    }));
    const resolvedName = customerName.trim() || null;
    const resolvedAddress = ((_a = selectedCustomer == null ? void 0 : selectedCustomer.address) == null ? void 0 : _a.trim()) || null;
    const resolvedPhone = ((_b = selectedCustomer == null ? void 0 : selectedCustomer.phone) == null ? void 0 : _b.trim()) || null;
    const resolvedId = selectedCustomer ? selectedCustomer.id : null;
    try {
      const bill = await createBill.mutateAsync({
        customerName: resolvedName,
        customerId: resolvedId,
        customerAddress: resolvedAddress,
        lineItems: backendLineItems
      });
      const billDate = new Date(Number(bill.date) / 1e6);
      await exportBillPDF({
        billNumber: bill.billNumber,
        date: billDate,
        customerName: resolvedName ?? "",
        customerAddress: resolvedAddress ?? "",
        customerPhone: resolvedPhone ?? void 0,
        lineItems: validItems,
        subtotal,
        totalGst,
        grandTotal,
        settings
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
        customerPhone: resolvedPhone ?? void 0
      });
      ue.success(`Bill ${bill.billNumber} saved & exported!`);
    } catch (err) {
      ue.error("Failed to save bill. Please try again.");
      console.error(err);
    }
  }
  function handleNewBill() {
    setSelectedCustomerId("");
    setCustomerName("");
    setLineItems([createEmptyLineItem()]);
    setSavedBill(null);
  }
  if (savedBill) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center gap-6",
        "data-ocid": "bill.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold text-foreground mb-2", children: "Bill Generated!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: savedBill.billNumber }),
              " saved on",
              " ",
              savedBill.date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Your PDF download has started automatically." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleNewBill,
                className: "gap-2",
                "data-ocid": "bill.new_bill_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus2, { className: "w-4 h-4" }),
                  "Create New Bill"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: async () => {
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
                    settings
                  });
                },
                className: "gap-2",
                "data-ocid": "bill.reprint_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4" }),
                  "Re-print PDF"
                ]
              }
            )
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6",
      "data-ocid": "bill.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground leading-tight", children: "New Bill" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "VJ Traders" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-warm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
            "Customer Details"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "customer-select", className: "text-sm", children: [
                "Select Existing Customer",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "customer-select",
                  value: selectedCustomerId,
                  onChange: handleCustomerSelect,
                  "data-ocid": "bill.customer_select",
                  className: "w-full max-w-sm h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Walk-in / New Customer —" }),
                    customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id.toString(), children: c.name }, c.id.toString()))
                  ]
                }
              )
            ] }),
            !selectedCustomerId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "customer-name", className: "text-sm", children: [
                "Customer Name",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "customer-name",
                  placeholder: "e.g. Ravi Kumar",
                  value: customerName,
                  onChange: (e) => setCustomerName(e.target.value),
                  "data-ocid": "bill.customer_name_input",
                  className: "max-w-sm"
                }
              )
            ] }),
            selectedCustomer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg px-4 py-3 space-y-0.5 max-w-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: selectedCustomer.address || "—" }),
              selectedCustomer.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: selectedCustomer.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-warm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Line Items" }),
            validItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              validItems.length,
              " item",
              validItems.length > 1 ? "s" : ""
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-6 py-2 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 text-center", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4", children: "Product" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 text-center", children: "GST" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-center", children: "Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6", children: productsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-2", "data-ocid": "bill.loading_state", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
            ] }) : lineItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              LineItemRow,
              {
                item,
                index,
                products,
                onChange: updateLineItem,
                onRemove: removeLineItem,
                canRemove: lineItems.length > 1
              },
              item.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-3 border-t border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: addLineItem,
                className: "gap-1.5 text-primary border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-smooth",
                "data-ocid": "bill.add_item_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Add Line Item"
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-warm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm ml-auto space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground", children: formatCurrency(subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground flex items-center gap-1.5", children: [
              "Total GST",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-[10px] px-1.5 py-0 h-4",
                  children: "per item"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground", children: formatCurrency(totalGst) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Grand Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary font-mono", children: formatCurrency(grandTotal) })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pb-4", children: [
          validItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-muted-foreground self-center",
              "data-ocid": "bill.no_items_hint",
              children: "Add at least one line item to generate a bill."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              onClick: handleGenerateBill,
              disabled: !canGenerate,
              className: "gap-2 font-semibold px-8",
              "data-ocid": "bill.generate_button",
              children: createBill.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                "Saving…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4" }),
                "Generate Bill & Export PDF"
              ] })
            }
          )
        ] })
      ]
    }
  );
}
export {
  BillPage as default
};
