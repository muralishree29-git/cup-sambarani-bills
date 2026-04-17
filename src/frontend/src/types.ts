// Re-export backend types for use across the app
export type {
  Product,
  Bill,
  LineItem,
  ProductId,
  BillId,
  CustomerId,
  Timestamp,
  Customer,
  ProducerSettings,
} from "./backend.d.ts";

// UI-specific types
export interface LineItemForm {
  productId: bigint;
  productName: string;
  price: bigint;
  quantity: number;
  amount: bigint;
  gst: bigint;
  hsn: string;
  gstAmount: bigint;
}

export interface BillFormData {
  customerName: string;
  lineItems: LineItemForm[];
  gstRate: number;
}

export interface CustomerForm {
  name: string;
  address: string;
  phone: string;
}
