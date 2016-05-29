'use strict';

System.register([], function (_export, _context) {
  var ValidationConfig;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('ValidationConfig', ValidationConfig = function () {
        function ValidationConfig() {
          _classCallCheck(this, ValidationConfig);

          this.__validationRules__ = [];
        }

        ValidationConfig.prototype.addRule = function addRule(key, rule) {
          this.__validationRules__.push({ key: key, rule: rule });
        };

        ValidationConfig.prototype.validate = function validate(instance, reporter, key) {
          var _this = this;

          var errors = [];
          this.__validationRules__.forEach(function (rule) {
            if (!key || key === rule.key) {
              var result = rule.rule.validate(instance, rule.key);
              if (result) {
                errors.push(_this.translateError(result));
              }
            }
          });
          reporter.publish(errors);
          return errors;
        };

        ValidationConfig.prototype.translateError = function translateError(error) {
          var service = this.getTranslationService(error.propertyName);
          if (service) {
            var msg = service(error);
            if (msg) {
              error.message = msg;
            }
          }
          return error;
        };

        ValidationConfig.prototype.getTranslationService = function getTranslationService(key) {
          var errorHandler = this.__validationRules__.find(function (r) {
            return r.key === key && r.rule.name === 'errorHandler';
          });
          if (errorHandler) {
            errorHandler = errorHandler.rule.config;
          } else {
            var configBuilder = ValidationConfig.prototype.configBuilder;
            if (configBuilder.translationCallback) {
              errorHandler = configBuilder.translationCallback;
            }
          }
          return errorHandler;
        };

        ValidationConfig.prototype.getValidationRules = function getValidationRules() {
          return this.__validationRules__ || (this.__validationRules__ = aggregateValidationRules(this));
        };

        ValidationConfig.prototype.aggregateValidationRules = function aggregateValidationRules() {
          console.error('not yet implemented');
        };

        return ValidationConfig;
      }());

      _export('ValidationConfig', ValidationConfig);
    }
  };
});