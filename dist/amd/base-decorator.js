define(['exports', './property-observer', 'aurelia-metadata', './validation-config', './metadata-key'], function (exports, _propertyObserver, _aureliaMetadata, _validationConfig, _metadataKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.base = base;
  exports.addRule = addRule;
  function base(targetOrConfig, key, descriptor, rule) {
    if (key) {
      var target = targetOrConfig;
      targetOrConfig = null;
      return addRule(target, key, descriptor, targetOrConfig, rule);
    }
    return function (t, k, d) {
      return addRule(t, k, d, targetOrConfig, rule);
    };
  }

  function addRule(target, key, descriptor, targetOrConfig, rule) {
    var config = _aureliaMetadata.metadata.getOrCreateOwn(_metadataKey.validationMetadataKey, _validationConfig.ValidationConfig, target);
    config.addRule(key, rule(targetOrConfig));
    return (0, _propertyObserver.observeProperty)(target, key, descriptor, targetOrConfig, rule);
  }
});