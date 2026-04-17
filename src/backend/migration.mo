import Map "mo:core/Map";
import CatalogTypes "types/catalog";
import BillingTypes "types/billing";
import CustomerTypes "types/customer";
import SettingsTypes "types/settings";
import Common "types/common";

module {
  // Old inline types (from previous version)
  type OldLineItem = {
    productId : Common.ProductId;
    productName : Text;
    price : Nat;
    quantity : Nat;
    amount : Nat;
  };

  type OldBill = {
    id : Common.BillId;
    billNumber : Text;
    date : Common.Timestamp;
    customerName : ?Text;
    lineItems : [OldLineItem];
    subtotal : Nat;
    gstAmount : Nat;
    grandTotal : Nat;
  };

  type OldProduct = {
    id : Common.ProductId;
    name : Text;
    price : Nat;
    stock : Nat;
  };

  type OldActor = {
    products : Map.Map<Common.ProductId, OldProduct>;
    nextProductId : { var value : Nat };
    bills : Map.Map<Common.BillId, OldBill>;
    nextBillId : { var value : Nat };
    lastBillMonth : { var value : Text };
    monthlyBillCounter : { var value : Nat };
  };

  type NewActor = {
    products : Map.Map<Common.ProductId, CatalogTypes.Product>;
    nextProductId : { var value : Nat };
    bills : Map.Map<Common.BillId, BillingTypes.Bill>;
    nextBillId : { var value : Nat };
    lastBillMonth : { var value : Text };
    monthlyBillCounter : { var value : Nat };
    customers : Map.Map<Common.CustomerId, CustomerTypes.Customer>;
    nextCustomerId : { var value : Nat };
    producerSettings : { var value : ?SettingsTypes.ProducerSettings };
  };

  public func run(old : OldActor) : NewActor {
    let products = old.products.map<Common.ProductId, OldProduct, CatalogTypes.Product>(
      func(_id, p) {
        { p with gst = 18; hsn = "" }
      }
    );

    let bills = old.bills.map<Common.BillId, OldBill, BillingTypes.Bill>(
      func(_id, b) {
        let lineItems = b.lineItems.map(
          func(item : OldLineItem) : BillingTypes.LineItem {
            { item with gst = 18; hsn = ""; gstAmount = 0 }
          }
        );
        { b with customerAddress = null; customerId = null; lineItems }
      }
    );

    {
      products;
      nextProductId = old.nextProductId;
      bills;
      nextBillId = old.nextBillId;
      lastBillMonth = old.lastBillMonth;
      monthlyBillCounter = old.monthlyBillCounter;
      customers = Map.empty<Common.CustomerId, CustomerTypes.Customer>();
      nextCustomerId = { var value = 0 };
      producerSettings = { var value = null };
    }
  };
};
