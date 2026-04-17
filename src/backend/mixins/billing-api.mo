import BillingTypes "../types/billing";
import Common "../types/common";
import BillingLib "../lib/billing";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  bills : Map.Map<Common.BillId, BillingTypes.Bill>,
  nextBillId : { var value : Nat },
  lastBillMonth : { var value : Text },
  monthlyBillCounter : { var value : Nat },
) {
  public func saveBill(
    customerName : ?Text,
    customerId : ?Common.CustomerId,
    customerAddress : ?Text,
    lineItems : [BillingTypes.LineItem],
  ) : async BillingTypes.Bill {
    let subtotal = computeSubtotal(lineItems);
    let totalGstAmount = computeTotalGst(lineItems);
    let grandTotal = subtotal + totalGstAmount;
    let now = Time.now();
    let currentMonth = BillingLib.timestampToYearMonth(now);
    // Reset counter if month changed, otherwise increment
    if (currentMonth == lastBillMonth.value) {
      monthlyBillCounter.value += 1;
    } else {
      lastBillMonth.value := currentMonth;
      monthlyBillCounter.value := 1;
    };
    let billNumber = BillingLib.formatBillNumber(now, monthlyBillCounter.value);
    BillingLib.saveBill(bills, nextBillId, billNumber, now, customerName, customerId, customerAddress, lineItems, subtotal, totalGstAmount, grandTotal);
  };

  public query func getBill(id : Common.BillId) : async ?BillingTypes.Bill {
    BillingLib.getBill(bills, id);
  };

  public query func listBills() : async [BillingTypes.Bill] {
    BillingLib.listBillsSortedByDate(bills);
  };

  func computeSubtotal(lineItems : [BillingTypes.LineItem]) : Nat {
    var total : Nat = 0;
    for (item in lineItems.values()) {
      total += item.amount;
    };
    total;
  };

  func computeTotalGst(lineItems : [BillingTypes.LineItem]) : Nat {
    var total : Nat = 0;
    for (item in lineItems.values()) {
      total += item.gstAmount;
    };
    total;
  };
};
