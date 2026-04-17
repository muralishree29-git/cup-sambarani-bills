import { r as reactExports, j as jsxRuntimeExports, U as Users, B as Button, S as Skeleton, u as ue } from "./index-BmkvLqip.js";
import { X, P as Pencil, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, A as AlertDialog, e as AlertDialogContent, f as AlertDialogHeader, T as TriangleAlert, g as AlertDialogTitle, h as AlertDialogDescription, i as AlertDialogFooter, j as AlertDialogCancel, k as AlertDialogAction } from "./dialog-1Hof1xWT.js";
import { L as Label, I as Input } from "./label-DUjBUsjq.js";
import { T as Textarea } from "./textarea-CU-vabGP.js";
import { u as useListCustomers, a as useAddCustomer, b as useUpdateCustomer, c as useDeleteCustomer } from "./useCustomers-CMjnZQig.js";
import { P as Plus, T as Trash2 } from "./trash-2-CrQfTDRv.js";
import "./index-BI_yI9q8.js";
import "./backend-DxYwS8Zo.js";
const emptyForm = { name: "", address: "", phone: "" };
function TableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "customers.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-warm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-56" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20" }),
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
      "data-ocid": "customers.empty_state",
      className: "flex flex-col items-center justify-center py-20 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "No customers yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: "Add your first customer. Their details can be included on bills." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "customers.empty_add_button",
            onClick: onAdd,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              " Add Customer"
            ]
          }
        )
      ]
    }
  );
}
function CustomerRow({ customer, index, onEdit, onDelete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `customers.item.${index}`,
      className: "group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card border border-border shadow-warm hover:shadow-warm-lg transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: customer.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mt-0.5", children: customer.address }),
            customer.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono mt-0.5", children: customer.phone })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `customers.edit_button.${index}`,
              variant: "outline",
              size: "sm",
              className: "gap-1.5 h-8",
              onClick: () => onEdit(customer),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `customers.delete_button.${index}`,
              variant: "outline",
              size: "sm",
              className: "gap-1.5 h-8 text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/60",
              onClick: () => onDelete(customer),
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
function CustomerModal({ open, editTarget, onClose }) {
  const isEdit = editTarget !== null;
  const [form, setForm] = reactExports.useState(
    () => editTarget ? {
      name: editTarget.name,
      address: editTarget.address,
      phone: editTarget.phone
    } : emptyForm
  );
  const [lastTarget, setLastTarget] = reactExports.useState(editTarget);
  if (editTarget !== lastTarget) {
    setLastTarget(editTarget);
    setForm(
      editTarget ? {
        name: editTarget.name,
        address: editTarget.address,
        phone: editTarget.phone
      } : emptyForm
    );
  }
  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();
  const isPending = addCustomer.isPending || updateCustomer.isPending;
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
    const address = form.address.trim();
    const phone = form.phone.trim();
    if (!name) return ue.error("Customer name is required.");
    if (!address) return ue.error("Customer address is required.");
    if (isEdit && editTarget) {
      await updateCustomer.mutateAsync(
        { id: editTarget.id, name, address, phone },
        {
          onSuccess: () => {
            ue.success("Customer updated.");
            handleClose();
          },
          onError: () => ue.error("Failed to update customer.")
        }
      );
    } else {
      await addCustomer.mutateAsync(
        { name, address, phone },
        {
          onSuccess: () => {
            ue.success("Customer added.");
            handleClose();
          },
          onError: () => ue.error("Failed to add customer.")
        }
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      "data-ocid": "customers.dialog",
      className: "sm:max-w-md bg-card border-border shadow-warm-lg",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: isEdit ? "Edit Customer" : "Add Customer" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "cust-name", className: "text-sm font-medium", children: [
              "Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "cust-name",
                "data-ocid": "customers.name_input",
                placeholder: "e.g. Ravi Enterprises",
                value: form.name,
                onChange: (e) => handleChange("name", e.target.value),
                required: true,
                autoFocus: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "cust-address", className: "text-sm font-medium", children: [
              "Address ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "cust-address",
                "data-ocid": "customers.address_input",
                placeholder: "Full billing address",
                rows: 3,
                value: form.address,
                onChange: (e) => handleChange("address", e.target.value),
                required: true,
                className: "resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "cust-phone", className: "text-sm font-medium", children: [
              "Phone",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "cust-phone",
                "data-ocid": "customers.phone_input",
                placeholder: "e.g. 9876543210",
                value: form.phone,
                onChange: (e) => handleChange("phone", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "customers.cancel_button",
                onClick: handleClose,
                disabled: isPending,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                "data-ocid": "customers.submit_button",
                disabled: isPending,
                children: isPending ? isEdit ? "Saving…" : "Adding…" : isEdit ? "Save Changes" : "Add Customer"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function DeleteDialog({ customer, onClose }) {
  const deleteCustomer = useDeleteCustomer();
  async function handleConfirm() {
    if (!customer) return;
    await deleteCustomer.mutateAsync(customer.id, {
      onSuccess: () => {
        ue.success(`"${customer.name}" removed.`);
        onClose();
      },
      onError: () => ue.error("Failed to delete customer.")
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!customer, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AlertDialogContent,
    {
      "data-ocid": "customers.delete_dialog",
      className: "bg-card border-border",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Delete Customer" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-sm text-muted-foreground", children: [
            "Are you sure you want to remove",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              '"',
              customer == null ? void 0 : customer.name,
              '"'
            ] }),
            "? This action cannot be undone."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogCancel,
            {
              "data-ocid": "customers.delete_cancel_button",
              onClick: onClose,
              disabled: deleteCustomer.isPending,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              "data-ocid": "customers.delete_confirm_button",
              onClick: handleConfirm,
              disabled: deleteCustomer.isPending,
              className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              children: deleteCustomer.isPending ? "Deleting…" : "Delete Customer"
            }
          )
        ] })
      ]
    }
  ) });
}
function CustomersPage() {
  const { data: customers = [], isLoading, error } = useListCustomers();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }
  function openEdit(c) {
    setEditTarget(c);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground leading-tight", children: "Customers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage customer details for billing" })
        ] })
      ] }),
      customers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "customers.add_button",
          onClick: openAdd,
          className: "gap-2 hidden sm:flex",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            " Add Customer"
          ]
        }
      )
    ] }),
    customers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-primary/10 border border-primary/20 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-0.5", children: "Total Customers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-semibold text-primary", children: customers.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted border border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-0.5", children: "With Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-semibold text-foreground", children: customers.filter((c) => c.phone).length })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "customers.error_state",
        className: "flex flex-col items-center gap-3 py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-7 h-7 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Could not load customers. Please try refreshing." })
        ]
      }
    ) : customers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onAdd: openAdd }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-4 px-4 mb-2 text-xs text-muted-foreground uppercase tracking-wide font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: "Name / Address / Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-36", children: "Actions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "customers.list", children: customers.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CustomerRow,
        {
          customer: c,
          index: i + 1,
          onEdit: openEdit,
          onDelete: setDeleteTarget
        },
        String(c.id)
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 right-6 sm:hidden z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "customers.add_button_mobile",
          onClick: openAdd,
          size: "lg",
          "aria-label": "Add customer",
          className: "rounded-full w-14 h-14 shadow-warm-lg p-0",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-6 h-6" })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomerModal,
      {
        open: modalOpen,
        editTarget,
        onClose: closeModal
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteDialog,
      {
        customer: deleteTarget,
        onClose: () => setDeleteTarget(null)
      }
    )
  ] });
}
export {
  CustomersPage as default
};
