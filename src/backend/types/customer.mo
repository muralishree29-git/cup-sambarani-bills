import Common "common";

module {
  public type Customer = {
    id : Common.CustomerId;
    name : Text;
    address : Text;
    phone : Text;
  };
};
