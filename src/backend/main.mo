import CatalogTypes "types/catalog";
import BillingTypes "types/billing";
import CustomerTypes "types/customer";
import SettingsTypes "types/settings";
import Common "types/common";
import Map "mo:core/Map";
import CatalogMixin "mixins/catalog-api";
import BillingMixin "mixins/billing-api";
import CustomersMixin "mixins/customers-api";
import SettingsMixin "mixins/settings-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let products = Map.empty<Common.ProductId, CatalogTypes.Product>();
  let nextProductId = { var value : Nat = 0 };

  let bills = Map.empty<Common.BillId, BillingTypes.Bill>();
  let nextBillId = { var value : Nat = 0 };
  let lastBillMonth = { var value : Text = "" };
  let monthlyBillCounter = { var value : Nat = 0 };

  let customers = Map.empty<Common.CustomerId, CustomerTypes.Customer>();
  let nextCustomerId = { var value : Nat = 0 };

  let producerSettings = { var value : ?SettingsTypes.ProducerSettings = null };

  include CatalogMixin(products, nextProductId);
  include BillingMixin(bills, nextBillId, lastBillMonth, monthlyBillCounter);
  include CustomersMixin(customers, nextCustomerId);
  include SettingsMixin(producerSettings);
};
