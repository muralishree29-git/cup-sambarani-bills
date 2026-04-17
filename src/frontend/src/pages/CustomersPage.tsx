import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddCustomer,
  useListCustomers as useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
} from "../hooks/useCustomers";
import type { Customer } from "../types";

// ─── Form ────────────────────────────────────────────────────────────────────

interface CustForm {
  name: string;
  address: string;
  phone: string;
}
const emptyForm: CustForm = { name: "", address: "", phone: "" };

// ─── Skeletons / Empty ───────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="space-y-3" data-ocid="customers.loading_state">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-warm"
        >
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      data-ocid="customers.empty_state"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <Users className="w-10 h-10 text-primary" />
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
        No customers yet
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        Add your first customer. Their details can be included on bills.
      </p>
      <Button
        data-ocid="customers.empty_add_button"
        onClick={onAdd}
        className="gap-2"
      >
        <Plus className="w-4 h-4" /> Add Customer
      </Button>
    </div>
  );
}

// ─── Customer Row ─────────────────────────────────────────────────────────────

interface CustomerRowProps {
  customer: Customer;
  index: number;
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
}

function CustomerRow({ customer, index, onEdit, onDelete }: CustomerRowProps) {
  return (
    <div
      data-ocid={`customers.item.${index}`}
      className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card border border-border shadow-warm hover:shadow-warm-lg transition-smooth"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">
            {customer.name}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {customer.address}
          </p>
          {customer.phone && (
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {customer.phone}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          data-ocid={`customers.edit_button.${index}`}
          variant="outline"
          size="sm"
          className="gap-1.5 h-8"
          onClick={() => onEdit(customer)}
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Button>
        <Button
          data-ocid={`customers.delete_button.${index}`}
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/60"
          onClick={() => onDelete(customer)}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}

// ─── Customer Modal ───────────────────────────────────────────────────────────

interface CustomerModalProps {
  open: boolean;
  editTarget: Customer | null;
  onClose: () => void;
}

function CustomerModal({ open, editTarget, onClose }: CustomerModalProps) {
  const isEdit = editTarget !== null;

  const [form, setForm] = useState<CustForm>(() =>
    editTarget
      ? {
          name: editTarget.name,
          address: editTarget.address,
          phone: editTarget.phone,
        }
      : emptyForm,
  );

  const [lastTarget, setLastTarget] = useState(editTarget);
  if (editTarget !== lastTarget) {
    setLastTarget(editTarget);
    setForm(
      editTarget
        ? {
            name: editTarget.name,
            address: editTarget.address,
            phone: editTarget.phone,
          }
        : emptyForm,
    );
  }

  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();
  const isPending = addCustomer.isPending || updateCustomer.isPending;

  function handleChange(field: keyof CustForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setForm(emptyForm);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const address = form.address.trim();
    const phone = form.phone.trim();

    if (!name) return toast.error("Customer name is required.");
    if (!address) return toast.error("Customer address is required.");

    if (isEdit && editTarget) {
      await updateCustomer.mutateAsync(
        { id: editTarget.id, name, address, phone },
        {
          onSuccess: () => {
            toast.success("Customer updated.");
            handleClose();
          },
          onError: () => toast.error("Failed to update customer."),
        },
      );
    } else {
      await addCustomer.mutateAsync(
        { name, address, phone },
        {
          onSuccess: () => {
            toast.success("Customer added.");
            handleClose();
          },
          onError: () => toast.error("Failed to add customer."),
        },
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="customers.dialog"
        className="sm:max-w-md bg-card border-border shadow-warm-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {isEdit ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cust-name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cust-name"
              data-ocid="customers.name_input"
              placeholder="e.g. Ravi Enterprises"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cust-address" className="text-sm font-medium">
              Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cust-address"
              data-ocid="customers.address_input"
              placeholder="Full billing address"
              rows={3}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cust-phone" className="text-sm font-medium">
              Phone{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
            </Label>
            <Input
              id="cust-phone"
              data-ocid="customers.phone_input"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="customers.cancel_button"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="customers.submit_button"
              disabled={isPending}
            >
              {isPending
                ? isEdit
                  ? "Saving…"
                  : "Adding…"
                : isEdit
                  ? "Save Changes"
                  : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

interface DeleteDialogProps {
  customer: Customer | null;
  onClose: () => void;
}

function DeleteDialog({ customer, onClose }: DeleteDialogProps) {
  const deleteCustomer = useDeleteCustomer();

  async function handleConfirm() {
    if (!customer) return;
    await deleteCustomer.mutateAsync(customer.id, {
      onSuccess: () => {
        toast.success(`"${customer.name}" removed.`);
        onClose();
      },
      onError: () => toast.error("Failed to delete customer."),
    });
  }

  return (
    <AlertDialog open={!!customer} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent
        data-ocid="customers.delete_dialog"
        className="bg-card border-border"
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle className="font-display">
              Delete Customer
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">
              "{customer?.name}"
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="customers.delete_cancel_button"
            onClick={onClose}
            disabled={deleteCustomer.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="customers.delete_confirm_button"
            onClick={handleConfirm}
            disabled={deleteCustomer.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteCustomer.isPending ? "Deleting…" : "Delete Customer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const { data: customers = [], isLoading, error } = useCustomers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }
  function openEdit(c: Customer) {
    setEditTarget(c);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">
              Customers
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage customer details for billing
            </p>
          </div>
        </div>
        {customers.length > 0 && (
          <Button
            data-ocid="customers.add_button"
            onClick={openAdd}
            className="gap-2 hidden sm:flex"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </Button>
        )}
      </div>

      {/* Stats bar */}
      {customers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
            <div className="text-xs text-muted-foreground mb-0.5">
              Total Customers
            </div>
            <div className="font-display text-xl font-semibold text-primary">
              {customers.length}
            </div>
          </div>
          <div className="rounded-xl bg-muted border border-border px-4 py-3">
            <div className="text-xs text-muted-foreground mb-0.5">
              With Phone
            </div>
            <div className="font-display text-xl font-semibold text-foreground">
              {customers.filter((c) => c.phone).length}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <div
          data-ocid="customers.error_state"
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <X className="w-7 h-7 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">
            Could not load customers. Please try refreshing.
          </p>
        </div>
      ) : customers.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <>
          <div className="hidden sm:flex items-center gap-4 px-4 mb-2 text-xs text-muted-foreground uppercase tracking-wide font-medium">
            <span className="flex-1">Name / Address / Phone</span>
            <span className="w-36">Actions</span>
          </div>

          <div className="space-y-2" data-ocid="customers.list">
            {customers.map((c, i) => (
              <CustomerRow
                key={String(c.id)}
                customer={c}
                index={i + 1}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>

          {/* Mobile FAB */}
          <div className="fixed bottom-6 right-6 sm:hidden z-20">
            <Button
              data-ocid="customers.add_button_mobile"
              onClick={openAdd}
              size="lg"
              aria-label="Add customer"
              className="rounded-full w-14 h-14 shadow-warm-lg p-0"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </>
      )}

      <CustomerModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={closeModal}
      />
      <DeleteDialog
        customer={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
