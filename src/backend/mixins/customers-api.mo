import CustomerTypes "../types/customer";
import Common "../types/common";
import CustomersLib "../lib/customers";
import Map "mo:core/Map";

mixin (
  customers : Map.Map<Common.CustomerId, CustomerTypes.Customer>,
  nextCustomerId : { var value : Nat },
) {
  public func addCustomer(name : Text, address : Text, phone : Text) : async CustomerTypes.Customer {
    CustomersLib.addCustomer(customers, nextCustomerId, name, address, phone);
  };

  public query func getCustomer(id : Common.CustomerId) : async ?CustomerTypes.Customer {
    CustomersLib.getCustomer(customers, id);
  };

  public func updateCustomer(id : Common.CustomerId, name : Text, address : Text, phone : Text) : async Bool {
    CustomersLib.updateCustomer(customers, id, name, address, phone);
  };

  public func deleteCustomer(id : Common.CustomerId) : async Bool {
    CustomersLib.deleteCustomer(customers, id);
  };

  public query func listCustomers() : async [CustomerTypes.Customer] {
    CustomersLib.listCustomers(customers);
  };
};
