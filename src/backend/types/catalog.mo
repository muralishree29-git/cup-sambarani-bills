import Common "common";

module {
  public type Product = {
    id : Common.ProductId;
    name : Text;
    price : Nat;
    stock : Nat;
    gst : Nat;
    hsn : Text;
  };
};
