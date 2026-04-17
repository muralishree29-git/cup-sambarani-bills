import SettingsTypes "../types/settings";
import SettingsLib "../lib/settings";

mixin (
  producerSettings : { var value : ?SettingsTypes.ProducerSettings },
) {
  public query func getProducerSettings() : async ?SettingsTypes.ProducerSettings {
    SettingsLib.getSettings(producerSettings);
  };

  public func setProducerSettings(settings : SettingsTypes.ProducerSettings) : async () {
    SettingsLib.setSettings(producerSettings, settings);
  };
};
