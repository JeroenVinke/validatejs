export let ConfigBuilder = class ConfigBuilder {
  useTranslation(callback) {
    this.translationCallback = callback;
  }
};