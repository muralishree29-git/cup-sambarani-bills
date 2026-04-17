import { r as reactExports, j as jsxRuntimeExports, P as Package, B as Button, S as Skeleton, u as ue } from "./index-BmkvLqip.js";
import { X, P as Pencil, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, A as AlertDialog, e as AlertDialogContent, f as AlertDialogHeader, T as TriangleAlert, g as AlertDialogTitle, h as AlertDialogDescription, i as AlertDialogFooter, j as AlertDialogCancel, k as AlertDialogAction } from "./dialog-1Hof1xWT.js";
import { B as Badge } from "./badge-D8FJqQka.js";
import { L as Label, I as Input } from "./label-DUjBUsjq.js";
import { u as useProducts, a as useAddProduct, b as useUpdateProduct, c as useDeleteProduct } from "./useProducts-1CkpzCxK.js";
import { P as Plus, T as Trash2 } from "./trash-2-CrQfTDRv.js";
import "./index-BI_yI9q8.js";
import "./backend-DxYwS8Zo.js";
const emptyForm = {
  name: "",
  price: "",
  stock: "",
  gst: "18",
  hsn: ""
};
function TableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "catalog.loading_state", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-warm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 ml-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20" })
      ]
    },
    i
  )) });
}
function EmptyState({ onAdd }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "catalog.empty_state",
      className: "flex flex-col items-center justify-center py-20 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-10 h-10 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "No products yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: "Add your first product to the catalog. You can pick from these when creating a bill." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "catalog.empty_add_button",
            onClick: onAdd,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              " Add Product"
            ]
          }
        )
      ]
    }
  );
}
function ProductRow({ product, index, onEdit, onDelete }) {
  const priceRupees = Number(product.price) / 100;
  const stockNum = Number(product.stock);
  const gstNum = Number(product.gst);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `catalog.item.${index}`,
      className: "group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card border border-border shadow-warm hover:shadow-warm-lg transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: product.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:w-28", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground sm:hidden", children: "Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            "₹",
            priceRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:w-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground sm:hidden", children: "GST" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs font-mono", children: [
            gstNum,
            "% GST"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:w-24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground sm:hidden", children: "HSN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: product.hsn || "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:w-24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground sm:hidden", children: "Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: stockNum === 0 ? "destructive" : stockNum <= 5 ? "secondary" : "outline",
              className: "text-xs font-mono",
              children: [
                stockNum,
                " units"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `catalog.edit_button.${index}`,
              variant: "outline",
              size: "sm",
              className: "gap-1.5 h-8",
              onClick: () => onEdit(product),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `catalog.delete_button.${index}`,
              variant: "outline",
              size: "sm",
              className: "gap-1.5 h-8 text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/60",
              onClick: () => onDelete(product),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                "Delete"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ProductModal({ open, editTarget, onClose }) {
  const isEdit = editTarget !== null;
  const [form, setForm] = reactExports.useState(
    () => editTarget ? {
      name: editTarget.name,
      price: (Number(editTarget.price) / 100).toFixed(2),
      stock: String(Number(editTarget.stock)),
      gst: String(Number(editTarget.gst)),
      hsn: editTarget.hsn
    } : emptyForm
  );
  const [lastTarget, setLastTarget] = reactExports.useState(editTarget);
  if (editTarget !== lastTarget) {
    setLastTarget(editTarget);
    setForm(
      editTarget ? {
        name: editTarget.name,
        price: (Number(editTarget.price) / 100).toFixed(2),
        stock: String(Number(editTarget.stock)),
        gst: String(Number(editTarget.gst)),
        hsn: editTarget.hsn
      } : emptyForm
    );
  }
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const isPending = addProduct.isPending || updateProduct.isPending;
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function handleClose() {
    setForm(emptyForm);
    onClose();
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    const priceRaw = Number.parseFloat(form.price);
    const stockRaw = Number.parseInt(form.stock || "0", 10);
    const gstRaw = Number.parseInt(form.gst || "18", 10);
    const hsn = form.hsn.trim();
    if (!name) return ue.error("Product name is required.");
    if (Number.isNaN(priceRaw) || priceRaw < 0)
      return ue.error("Enter a valid price.");
    if (Number.isNaN(stockRaw) || stockRaw < 0)
      return ue.error("Enter a valid stock quantity.");
    if (Number.isNaN(gstRaw) || gstRaw < 0 || gstRaw > 100)
      return ue.error("Enter a valid GST rate (0–100).");
    const pricePaise = BigInt(Math.round(priceRaw * 100));
    const stockBig = BigInt(stockRaw);
    const gstBig = BigInt(gstRaw);
    if (isEdit && editTarget) {
      await updateProduct.mutateAsync(
        {
          id: editTarget.id,
          name,
          price: pricePaise,
          stock: stockBig,
          gst: gstBig,
          hsn
        },
        {
          onSuccess: () => {
            ue.success("Product updated.");
            handleClose();
          },
          onError: () => ue.error("Failed to update product.")
        }
      );
    } else {
      await addProduct.mutateAsync(
        { name, price: pricePaise, stock: stockBig, gst: gstBig, hsn },
        {
          onSuccess: () => {
            ue.success("Product added to catalog.");
            handleClose();
          },
          onError: () => ue.error("Failed to add product.")
        }
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      "data-ocid": "catalog.dialog",
      className: "sm:max-w-md bg-card border-border shadow-warm-lg",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: isEdit ? "Edit Product" : "Add Product" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "prod-name", className: "text-sm font-medium", children: [
              "Product Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-name",
                "data-ocid": "catalog.name_input",
                placeholder: "e.g. Sambrani Cup Pack",
                value: form.name,
                onChange: (e) => handleChange("name", e.target.value),
                required: true,
                autoFocus: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "prod-price", className: "text-sm font-medium", children: [
              "Price (₹) ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm", children: "₹" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "prod-price",
                  "data-ocid": "catalog.price_input",
                  type: "number",
                  step: "0.01",
                  min: "0",
                  placeholder: "0.00",
                  className: "pl-7",
                  value: form.price,
                  onChange: (e) => handleChange("price", e.target.value),
                  required: true
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-gst", className: "text-sm font-medium", children: "GST Rate (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "prod-gst",
                  "data-ocid": "catalog.gst_input",
                  type: "number",
                  min: "0",
                  max: "100",
                  step: "1",
                  placeholder: "18",
                  value: form.gst,
                  onChange: (e) => handleChange("gst", e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-hsn", className: "text-sm font-medium", children: "HSN Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "prod-hsn",
                  "data-ocid": "catalog.hsn_input",
                  placeholder: "e.g. 3307",
                  value: form.hsn,
                  onChange: (e) => handleChange("hsn", e.target.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "prod-stock", className: "text-sm font-medium", children: [
              "Stock Quantity",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(reference only)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "prod-stock",
                "data-ocid": "catalog.stock_input",
                type: "number",
                min: "0",
                step: "1",
                placeholder: "0",
                value: form.stock,
                onChange: (e) => handleChange("stock", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "catalog.cancel_button",
                onClick: handleClose,
                disabled: isPending,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                "data-ocid": "catalog.submit_button",
                disabled: isPending,
                children: isPending ? isEdit ? "Saving…" : "Adding…" : isEdit ? "Save Changes" : "Add Product"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function DeleteDialog({ product, onClose }) {
  const deleteProduct = useDeleteProduct();
  async function handleConfirm() {
    if (!product) return;
    await deleteProduct.mutateAsync(product.id, {
      onSuccess: () => {
        ue.success(`"${product.name}" removed from catalog.`);
        onClose();
      },
      onError: () => ue.error("Failed to delete product.")
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!product, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AlertDialogContent,
    {
      "data-ocid": "catalog.delete_dialog",
      className: "bg-card border-border",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Delete Product" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-sm text-muted-foreground", children: [
            "Are you sure you want to remove",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              '"',
              product == null ? void 0 : product.name,
              '"'
            ] }),
            " ",
            "from the catalog? This action cannot be undone."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogCancel,
            {
              "data-ocid": "catalog.delete_cancel_button",
              onClick: onClose,
              disabled: deleteProduct.isPending,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              "data-ocid": "catalog.delete_confirm_button",
              onClick: handleConfirm,
              disabled: deleteProduct.isPending,
              className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              children: deleteProduct.isPending ? "Deleting…" : "Delete Product"
            }
          )
        ] })
      ]
    }
  ) });
}
function CatalogPage() {
  const { data: products = [], isLoading, error } = useProducts();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }
  function openEdit(product) {
    setEditTarget(product);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground leading-tight", children: "Product Catalog" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage products used when creating bills" })
        ] })
      ] }),
      products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "catalog.add_button",
          onClick: openAdd,
          className: "gap-2 hidden sm:flex",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Product"
          ]
        }
      )
    ] }),
    products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-primary/10 border border-primary/20 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-0.5", children: "Total Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-semibold text-primary", children: products.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-accent/10 border border-accent/20 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-0.5", children: "Avg. Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl font-semibold text-accent-foreground", children: [
          "₹",
          (products.reduce((s, p) => s + Number(p.price), 0) / products.length / 100).toLocaleString("en-IN", { minimumFractionDigits: 0 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted border border-border px-4 py-3 col-span-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-0.5", children: "Total Stock Units" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-semibold text-foreground", children: products.reduce((s, p) => s + Number(p.stock), 0).toLocaleString("en-IN") })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "catalog.error_state",
        className: "flex flex-col items-center gap-3 py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-7 h-7 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Could not load products. Please try refreshing." })
        ]
      }
    ) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onAdd: openAdd }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-4 px-4 mb-2 text-xs text-muted-foreground uppercase tracking-wide font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-28", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-20", children: "GST" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24", children: "HSN" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24", children: "Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-36", children: "Actions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "catalog.list", children: products.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductRow,
        {
          product,
          index: i + 1,
          onEdit: openEdit,
          onDelete: setDeleteTarget
        },
        String(product.id)
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 right-6 sm:hidden z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "catalog.add_button_mobile",
          onClick: openAdd,
          size: "lg",
          "aria-label": "Add product",
          className: "rounded-full w-14 h-14 shadow-warm-lg p-0",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-6 h-6" })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductModal,
      {
        open: modalOpen,
        editTarget,
        onClose: closeModal
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteDialog,
      {
        product: deleteTarget,
        onClose: () => setDeleteTarget(null)
      }
    )
  ] });
}
export {
  CatalogPage as default
};
