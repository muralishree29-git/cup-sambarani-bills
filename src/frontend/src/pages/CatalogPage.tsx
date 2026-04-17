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
import { Badge } from "@/components/ui/badge";
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
import { AlertTriangle, Package, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../hooks/useProducts";
import type { Product } from "../types";

// ─── Form helpers ────────────────────────────────────────────────────────────

interface ProductForm {
  name: string;
  price: string;
  stock: string;
  gst: string;
  hsn: string;
}

const emptyForm: ProductForm = {
  name: "",
  price: "",
  stock: "",
  gst: "18",
  hsn: "",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="space-y-3" data-ocid="catalog.loading_state">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-warm"
        >
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      data-ocid="catalog.empty_state"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <Package className="w-10 h-10 text-primary" />
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
        No products yet
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        Add your first product to the catalog. You can pick from these when
        creating a bill.
      </p>
      <Button
        data-ocid="catalog.empty_add_button"
        onClick={onAdd}
        className="gap-2"
      >
        <Plus className="w-4 h-4" /> Add Product
      </Button>
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function ProductRow({ product, index, onEdit, onDelete }: ProductRowProps) {
  const priceRupees = Number(product.price) / 100;
  const stockNum = Number(product.stock);
  const gstNum = Number(product.gst);

  return (
    <div
      data-ocid={`catalog.item.${index}`}
      className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card border border-border shadow-warm hover:shadow-warm-lg transition-smooth"
    >
      {/* Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium text-foreground truncate">
          {product.name}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 sm:w-28">
        <span className="text-xs text-muted-foreground sm:hidden">Price</span>
        <span className="font-semibold text-foreground">
          ₹{priceRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* GST % */}
      <div className="flex items-center gap-2 sm:w-20">
        <span className="text-xs text-muted-foreground sm:hidden">GST</span>
        <Badge variant="secondary" className="text-xs font-mono">
          {gstNum}% GST
        </Badge>
      </div>

      {/* HSN */}
      <div className="flex items-center gap-2 sm:w-24">
        <span className="text-xs text-muted-foreground sm:hidden">HSN</span>
        <span className="text-xs text-muted-foreground font-mono">
          {product.hsn || "—"}
        </span>
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2 sm:w-24">
        <span className="text-xs text-muted-foreground sm:hidden">Stock</span>
        <Badge
          variant={
            stockNum === 0
              ? "destructive"
              : stockNum <= 5
                ? "secondary"
                : "outline"
          }
          className="text-xs font-mono"
        >
          {stockNum} units
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          data-ocid={`catalog.edit_button.${index}`}
          variant="outline"
          size="sm"
          className="gap-1.5 h-8"
          onClick={() => onEdit(product)}
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Button>
        <Button
          data-ocid={`catalog.delete_button.${index}`}
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/60"
          onClick={() => onDelete(product)}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}

// ─── Product Form Modal ───────────────────────────────────────────────────────

interface ProductModalProps {
  open: boolean;
  editTarget: Product | null;
  onClose: () => void;
}

function ProductModal({ open, editTarget, onClose }: ProductModalProps) {
  const isEdit = editTarget !== null;

  const [form, setForm] = useState<ProductForm>(() =>
    editTarget
      ? {
          name: editTarget.name,
          price: (Number(editTarget.price) / 100).toFixed(2),
          stock: String(Number(editTarget.stock)),
          gst: String(Number(editTarget.gst)),
          hsn: editTarget.hsn,
        }
      : emptyForm,
  );

  // Sync form when editTarget changes
  const [lastTarget, setLastTarget] = useState(editTarget);
  if (editTarget !== lastTarget) {
    setLastTarget(editTarget);
    setForm(
      editTarget
        ? {
            name: editTarget.name,
            price: (Number(editTarget.price) / 100).toFixed(2),
            stock: String(Number(editTarget.stock)),
            gst: String(Number(editTarget.gst)),
            hsn: editTarget.hsn,
          }
        : emptyForm,
    );
  }

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const isPending = addProduct.isPending || updateProduct.isPending;

  function handleChange(field: keyof ProductForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setForm(emptyForm);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const priceRaw = Number.parseFloat(form.price);
    const stockRaw = Number.parseInt(form.stock || "0", 10);
    const gstRaw = Number.parseInt(form.gst || "18", 10);
    const hsn = form.hsn.trim();

    if (!name) return toast.error("Product name is required.");
    if (Number.isNaN(priceRaw) || priceRaw < 0)
      return toast.error("Enter a valid price.");
    if (Number.isNaN(stockRaw) || stockRaw < 0)
      return toast.error("Enter a valid stock quantity.");
    if (Number.isNaN(gstRaw) || gstRaw < 0 || gstRaw > 100)
      return toast.error("Enter a valid GST rate (0–100).");

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
          hsn,
        },
        {
          onSuccess: () => {
            toast.success("Product updated.");
            handleClose();
          },
          onError: () => toast.error("Failed to update product."),
        },
      );
    } else {
      await addProduct.mutateAsync(
        { name, price: pricePaise, stock: stockBig, gst: gstBig, hsn },
        {
          onSuccess: () => {
            toast.success("Product added to catalog.");
            handleClose();
          },
          onError: () => toast.error("Failed to add product."),
        },
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="catalog.dialog"
        className="sm:max-w-md bg-card border-border shadow-warm-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {isEdit ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-name" className="text-sm font-medium">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="prod-name"
              data-ocid="catalog.name_input"
              placeholder="e.g. Sambrani Cup Pack"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-price" className="text-sm font-medium">
              Price (₹) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                ₹
              </span>
              <Input
                id="prod-price"
                data-ocid="catalog.price_input"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-7"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
          </div>

          {/* GST Rate + HSN Code — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prod-gst" className="text-sm font-medium">
                GST Rate (%)
              </Label>
              <Input
                id="prod-gst"
                data-ocid="catalog.gst_input"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="18"
                value={form.gst}
                onChange={(e) => handleChange("gst", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-hsn" className="text-sm font-medium">
                HSN Code
              </Label>
              <Input
                id="prod-hsn"
                data-ocid="catalog.hsn_input"
                placeholder="e.g. 3307"
                value={form.hsn}
                onChange={(e) => handleChange("hsn", e.target.value)}
              />
            </div>
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <Label htmlFor="prod-stock" className="text-sm font-medium">
              Stock Quantity{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (reference only)
              </span>
            </Label>
            <Input
              id="prod-stock"
              data-ocid="catalog.stock_input"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="catalog.cancel_button"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="catalog.submit_button"
              disabled={isPending}
            >
              {isPending
                ? isEdit
                  ? "Saving…"
                  : "Adding…"
                : isEdit
                  ? "Save Changes"
                  : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────

interface DeleteDialogProps {
  product: Product | null;
  onClose: () => void;
}

function DeleteDialog({ product, onClose }: DeleteDialogProps) {
  const deleteProduct = useDeleteProduct();

  async function handleConfirm() {
    if (!product) return;
    await deleteProduct.mutateAsync(product.id, {
      onSuccess: () => {
        toast.success(`"${product.name}" removed from catalog.`);
        onClose();
      },
      onError: () => toast.error("Failed to delete product."),
    });
  }

  return (
    <AlertDialog open={!!product} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent
        data-ocid="catalog.delete_dialog"
        className="bg-card border-border"
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle className="font-display">
              Delete Product
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">
              "{product?.name}"
            </span>{" "}
            from the catalog? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="catalog.delete_cancel_button"
            onClick={onClose}
            disabled={deleteProduct.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="catalog.delete_confirm_button"
            onClick={handleConfirm}
            disabled={deleteProduct.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProduct.isPending ? "Deleting…" : "Delete Product"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const { data: products = [], isLoading, error } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditTarget(product);
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
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">
              Product Catalog
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage products used when creating bills
            </p>
          </div>
        </div>

        {products.length > 0 && (
          <Button
            data-ocid="catalog.add_button"
            onClick={openAdd}
            className="gap-2 hidden sm:flex"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Stats bar (only when products exist) */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
            <div className="text-xs text-muted-foreground mb-0.5">
              Total Products
            </div>
            <div className="font-display text-xl font-semibold text-primary">
              {products.length}
            </div>
          </div>
          <div className="rounded-xl bg-accent/10 border border-accent/20 px-4 py-3">
            <div className="text-xs text-muted-foreground mb-0.5">
              Avg. Price
            </div>
            <div className="font-display text-xl font-semibold text-accent-foreground">
              ₹
              {(
                products.reduce((s, p) => s + Number(p.price), 0) /
                products.length /
                100
              ).toLocaleString("en-IN", { minimumFractionDigits: 0 })}
            </div>
          </div>
          <div className="rounded-xl bg-muted border border-border px-4 py-3 col-span-2 sm:col-span-1">
            <div className="text-xs text-muted-foreground mb-0.5">
              Total Stock Units
            </div>
            <div className="font-display text-xl font-semibold text-foreground">
              {products
                .reduce((s, p) => s + Number(p.stock), 0)
                .toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <div
          data-ocid="catalog.error_state"
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <X className="w-7 h-7 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">
            Could not load products. Please try refreshing.
          </p>
        </div>
      ) : products.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <>
          {/* Column headers (desktop) */}
          <div className="hidden sm:flex items-center gap-4 px-4 mb-2 text-xs text-muted-foreground uppercase tracking-wide font-medium">
            <span className="flex-1">Name</span>
            <span className="w-28">Price</span>
            <span className="w-20">GST</span>
            <span className="w-24">HSN</span>
            <span className="w-24">Stock</span>
            <span className="w-36">Actions</span>
          </div>

          {/* Product rows */}
          <div className="space-y-2" data-ocid="catalog.list">
            {products.map((product, i) => (
              <ProductRow
                key={String(product.id)}
                product={product}
                index={i + 1}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>

          {/* Mobile FAB */}
          <div className="fixed bottom-6 right-6 sm:hidden z-20">
            <Button
              data-ocid="catalog.add_button_mobile"
              onClick={openAdd}
              size="lg"
              aria-label="Add product"
              className="rounded-full w-14 h-14 shadow-warm-lg p-0"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </>
      )}

      {/* Modals */}
      <ProductModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={closeModal}
      />
      <DeleteDialog
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
