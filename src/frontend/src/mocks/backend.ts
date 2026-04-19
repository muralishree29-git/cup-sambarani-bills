import type { backendInterface, Product, Bill, LineItem, Customer, ProducerSettings } from "../backend";

const sampleProducts: Product[] = [
  { id: BigInt(1), name: "VJ Traders - Regular Pack", price: BigInt(15000), stock: BigInt(100), gst: BigInt(18), hsn: "3307" },
  { id: BigInt(2), name: "VJ Traders - Large Pack", price: BigInt(25000), stock: BigInt(50), gst: BigInt(18), hsn: "3307" },
  { id: BigInt(3), name: "Sambrani Sticks - Pack of 10", price: BigInt(8000), stock: BigInt(200), gst: BigInt(18), hsn: "3307" },
];

const sampleLineItem: LineItem = {
  productId: BigInt(1),
  productName: "VJ Traders - Regular Pack",
  quantity: BigInt(2),
  price: BigInt(15000),
  amount: BigInt(30000),
  gst: BigInt(18),
  hsn: "3307",
  gstAmount: BigInt(5400),
};

const sampleBill: Bill = {
  id: BigInt(1),
  billNumber: "BILL-0001",
  customerName: "Ravi Kumar",
  lineItems: [sampleLineItem],
  subtotal: BigInt(30000),
  gstAmount: BigInt(5400),
  grandTotal: BigInt(35400),
  date: BigInt(Date.now()) * BigInt(1_000_000),
};

const sampleCustomer: Customer = {
  id: BigInt(1),
  name: "Ravi Enterprises",
  address: "12, Gandhi Nagar, Chennai - 600001",
  phone: "9876543210",
};

const defaultSettings: ProducerSettings = {
  companyName: "VJ Traders",
  address: "",
  gstNumber: "",
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  ifscCode: "",
  authorisedSignatory: "",
};

export const mockBackend: backendInterface = {
  addProduct: async (name, price, stock, gst, hsn) => ({
    id: BigInt(Date.now()),
    name,
    price,
    stock,
    gst,
    hsn,
  }),
  deleteProduct: async () => true,
  getBill: async () => sampleBill,
  getProduct: async () => sampleProducts[0],
  listBills: async () => [sampleBill],
  listProducts: async () => sampleProducts,
  saveBill: async (customerName, _customerId, _customerAddress, lineItems) => ({
    id: BigInt(Date.now()),
    billNumber: "BILL-0002",
    customerName: customerName ?? undefined,
    lineItems,
    subtotal: BigInt(30000),
    gstAmount: BigInt(5400),
    grandTotal: BigInt(35400),
    date: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  updateProduct: async () => true,
  addCustomer: async (name, address, phone) => ({ id: BigInt(Date.now()), name, address, phone }),
  deleteCustomer: async () => true,
  getCustomer: async () => sampleCustomer,
  listCustomers: async () => [sampleCustomer],
  updateCustomer: async () => true,
  getProducerSettings: async () => defaultSettings,
  setProducerSettings: async () => undefined,
};
