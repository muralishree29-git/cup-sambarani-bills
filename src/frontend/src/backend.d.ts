import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProducerSettings {
    ifscCode: string;
    gstNumber: string;
    bankName: string;
    address: string;
    companyName: string;
    authorisedSignatory: string;
    accountNumber: string;
    accountHolder: string;
}
export type Timestamp = bigint;
export interface LineItem {
    gst: bigint;
    hsn: string;
    productId: ProductId;
    productName: string;
    gstAmount: bigint;
    quantity: bigint;
    price: bigint;
    amount: bigint;
}
export type CustomerId = bigint;
export interface Bill {
    id: BillId;
    customerName?: string;
    lineItems: Array<LineItem>;
    date: Timestamp;
    gstAmount: bigint;
    grandTotal: bigint;
    customerAddress?: string;
    billNumber: string;
    customerId?: CustomerId;
    subtotal: bigint;
}
export type ProductId = bigint;
export type BillId = bigint;
export interface Customer {
    id: CustomerId;
    name: string;
    address: string;
    phone: string;
}
export interface Product {
    id: ProductId;
    gst: bigint;
    hsn: string;
    name: string;
    stock: bigint;
    price: bigint;
}
export interface backendInterface {
    addCustomer(name: string, address: string, phone: string): Promise<Customer>;
    addProduct(name: string, price: bigint, stock: bigint, gst: bigint, hsn: string): Promise<Product>;
    deleteCustomer(id: CustomerId): Promise<boolean>;
    deleteProduct(id: ProductId): Promise<boolean>;
    getBill(id: BillId): Promise<Bill | null>;
    getCustomer(id: CustomerId): Promise<Customer | null>;
    getProducerSettings(): Promise<ProducerSettings | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    listBills(): Promise<Array<Bill>>;
    listCustomers(): Promise<Array<Customer>>;
    listProducts(): Promise<Array<Product>>;
    saveBill(customerName: string | null, customerId: CustomerId | null, customerAddress: string | null, lineItems: Array<LineItem>): Promise<Bill>;
    setProducerSettings(settings: ProducerSettings): Promise<void>;
    updateCustomer(id: CustomerId, name: string, address: string, phone: string): Promise<boolean>;
    updateProduct(id: ProductId, name: string, price: bigint, stock: bigint, gst: bigint, hsn: string): Promise<boolean>;
}
