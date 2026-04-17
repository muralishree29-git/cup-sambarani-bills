import Types "../types/billing";
import Common "../types/common";
import Map "mo:core/Map";
import Int "mo:core/Int";

module {
  // Convert nanosecond timestamp to (year, month, day) using proleptic Gregorian calendar
  func timestampToDate(nanos : Int) : (Nat, Nat, Nat) {
    // Convert nanoseconds to days since Unix epoch (1970-01-01)
    let secondsPerDay : Int = 86_400;
    let nanosPerSecond : Int = 1_000_000_000;
    let daysSinceEpoch : Int = nanos / (nanosPerSecond * secondsPerDay);

    // Algorithm: civil_from_days (Gregorian calendar)
    let z = daysSinceEpoch + 719_468;
    let era : Int = (if (z >= 0) z else z - 146_096) / 146_097;
    let doe = z - era * 146_097; // day of era [0, 146096]
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365; // year of era [0, 399]
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100); // day of year [0, 365]
    let mp = (5 * doy + 2) / 153; // month prime [0, 11]
    let d = doy - (153 * mp + 2) / 5 + 1; // day [1, 31]
    let m = if (mp < 10) mp + 3 else mp - 9; // month [1, 12]
    let adjY = if (m <= 2) y + 1 else y;

    (Int.abs(adjY), Int.abs(m), Int.abs(d));
  };

  func pad2(n : Nat) : Text {
    if (n < 10) "0" # n.toText() else n.toText();
  };

  func pad3(n : Nat) : Text {
    if (n < 10) "00" # n.toText()
    else if (n < 100) "0" # n.toText()
    else n.toText();
  };

  // Format bill number as YYYYMMDD-NNN
  // date: nanosecond timestamp of bill creation
  // counter: monthly sequential counter (1-based)
  public func formatBillNumber(date : Int, counter : Nat) : Text {
    let (year, month, day) = timestampToDate(date);
    year.toText() # pad2(month) # pad2(day) # "-" # pad3(counter);
  };

  // Extract "YYYY-MM" string from nanosecond timestamp
  public func timestampToYearMonth(nanos : Int) : Text {
    let (year, month, _) = timestampToDate(nanos);
    year.toText() # "-" # pad2(month);
  };

  public func saveBill(
    bills : Map.Map<Common.BillId, Types.Bill>,
    nextId : { var value : Nat },
    billNumber : Text,
    date : Common.Timestamp,
    customerName : ?Text,
    customerId : ?Common.CustomerId,
    customerAddress : ?Text,
    lineItems : [Types.LineItem],
    subtotal : Nat,
    gstAmount : Nat,
    grandTotal : Nat,
  ) : Types.Bill {
    let id = nextId.value;
    nextId.value += 1;
    let bill : Types.Bill = {
      id;
      billNumber;
      date;
      customerName;
      customerId;
      customerAddress;
      lineItems;
      subtotal;
      gstAmount;
      grandTotal;
    };
    bills.add(id, bill);
    bill;
  };

  public func getBill(
    bills : Map.Map<Common.BillId, Types.Bill>,
    id : Common.BillId,
  ) : ?Types.Bill {
    bills.get(id);
  };

  public func listBillsSortedByDate(
    bills : Map.Map<Common.BillId, Types.Bill>
  ) : [Types.Bill] {
    let all = bills.values().toArray();
    all.sort(func(a, b) = Int.compare(b.date, a.date));
  };
};
