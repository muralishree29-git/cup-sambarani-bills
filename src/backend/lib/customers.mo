import Types "../types/customer";
import Common "../types/common";
import Map "mo:core/Map";

module {
  public func addCustomer(
    customers : Map.Map<Common.CustomerId, Types.Customer>,
    nextId : { var value : Nat },
    name : Text,
    address : Text,
    phone : Text,
  ) : Types.Customer {
    let id = nextId.value;
    nextId.value += 1;
    let customer : Types.Customer = { id; name; address; phone };
    customers.add(id, customer);
    customer;
  };

  public func getCustomer(
    customers : Map.Map<Common.CustomerId, Types.Customer>,
    id : Common.CustomerId,
  ) : ?Types.Customer {
    customers.get(id);
  };

  public func updateCustomer(
    customers : Map.Map<Common.CustomerId, Types.Customer>,
    id : Common.CustomerId,
    name : Text,
    address : Text,
    phone : Text,
  ) : Bool {
    switch (customers.get(id)) {
      case null { false };
      case (?existing) {
        customers.add(id, { existing with name; address; phone });
        true;
      };
    };
  };

  public func deleteCustomer(
    customers : Map.Map<Common.CustomerId, Types.Customer>,
    id : Common.CustomerId,
  ) : Bool {
    switch (customers.get(id)) {
      case null { false };
      case (?_) {
        customers.remove(id);
        true;
      };
    };
  };

  public func listCustomers(
    customers : Map.Map<Common.CustomerId, Types.Customer>
  ) : [Types.Customer] {
    customers.values().toArray();
  };
};
