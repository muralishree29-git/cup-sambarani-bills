import Types "../types/catalog";
import Common "../types/common";
import Map "mo:core/Map";


module {
  public func addProduct(
    products : Map.Map<Common.ProductId, Types.Product>,
    nextId : { var value : Nat },
    name : Text,
    price : Nat,
    stock : Nat,
    gst : Nat,
    hsn : Text,
  ) : Types.Product {
    let id = nextId.value;
    nextId.value += 1;
    let product : Types.Product = { id; name; price; stock; gst; hsn };
    products.add(id, product);
    product;
  };

  public func getProduct(
    products : Map.Map<Common.ProductId, Types.Product>,
    id : Common.ProductId,
  ) : ?Types.Product {
    products.get(id);
  };

  public func updateProduct(
    products : Map.Map<Common.ProductId, Types.Product>,
    id : Common.ProductId,
    name : Text,
    price : Nat,
    stock : Nat,
    gst : Nat,
    hsn : Text,
  ) : Bool {
    switch (products.get(id)) {
      case null { false };
      case (?existing) {
        products.add(id, { existing with name; price; stock; gst; hsn });
        true;
      };
    };
  };

  public func deleteProduct(
    products : Map.Map<Common.ProductId, Types.Product>,
    id : Common.ProductId,
  ) : Bool {
    switch (products.get(id)) {
      case null { false };
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  public func listProducts(
    products : Map.Map<Common.ProductId, Types.Product>
  ) : [Types.Product] {
    products.values().toArray();
  };
};
