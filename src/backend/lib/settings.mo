import Types "../types/settings";

module {
  public func getSettings(
    settings : { var value : ?Types.ProducerSettings }
  ) : ?Types.ProducerSettings {
    settings.value;
  };

  public func setSettings(
    settings : { var value : ?Types.ProducerSettings },
    newSettings : Types.ProducerSettings,
  ) {
    settings.value := ?newSettings;
  };
};
