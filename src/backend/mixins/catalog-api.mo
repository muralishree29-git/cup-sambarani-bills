import CatalogTypes "../types/catalog";
import Common "../types/common";
import CatalogLib "../lib/catalog";
import Map "mo:core/Map";

mixin (
  products : Map.Map<Common.ProductId, CatalogTypes.Product>,
  nextProductId : { var value : Nat },
) {
  public func addProduct(name : Text, price : Nat, stock : Nat, gst : Nat, hsn : Text) : async CatalogTypes.Product {
    CatalogLib.addProduct(products, nextProductId, name, price, stock, gst, hsn);
  };

  public func getProduct(id : Common.ProductId) : async ?CatalogTypes.Product {
    CatalogLib.getProduct(products, id);
  };

  public func updateProduct(id : Common.ProductId, name : Text, price : Nat, stock : Nat, gst : Nat, hsn : Text) : async Bool {
    CatalogLib.updateProduct(products, id, name, price, stock, gst, hsn);
  };

  public func deleteProduct(id : Common.ProductId) : async Bool {
    CatalogLib.deleteProduct(products, id);
  };

  public query func listProducts() : async [CatalogTypes.Product] {
    CatalogLib.listProducts(products);
  };
};
