import Common "common";

module {
  public type LineItem = {
    productId : Common.ProductId;
    productName : Text;
    price : Nat;
    quantity : Nat;
    amount : Nat;
    gst : Nat;
    hsn : Text;
    gstAmount : Nat;
  };

  public type Bill = {
    id : Common.BillId;
    billNumber : Text;
    date : Common.Timestamp;
    customerName : ?Text;
    customerId : ?Common.CustomerId;
    customerAddress : ?Text;
    lineItems : [LineItem];
    subtotal : Nat;
    gstAmount : Nat;
    grandTotal : Nat;
  };
};
