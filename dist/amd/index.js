define(['exports', './decorators', './validation-engine', './validator', './validation-reporter', './validation-renderer', 'aurelia-validation', './validation-config', './config-builder'], function (exports, _decorators, _validationEngine, _validator, _validationReporter, _validationRenderer, _aureliaValidation, _validationConfig, _configBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ValidationRenderer = exports.ValidationReporter = exports.Validator = exports.ValidationEngine = exports.errorHandler = exports.numericality = exports.url = exports.format = exports.inclusion = exports.exclusion = exports.equality = exports.email = exports.datetime = exports.date = exports.required = exports.length = undefined;
  Object.defineProperty(exports, 'length', {
    enumerable: true,
    get: function () {
      return _decorators.length;
    }
  });
  Object.defineProperty(exports, 'required', {
    enumerable: true,
    get: function () {
      return _decorators.required;
    }
  });
  Object.defineProperty(exports, 'date', {
    enumerable: true,
    get: function () {
      return _decorators.date;
    }
  });
  Object.defineProperty(exports, 'datetime', {
    enumerable: true,
    get: function () {
      return _decorators.datetime;
    }
  });
  Object.defineProperty(exports, 'email', {
    enumerable: true,
    get: function () {
      return _decorators.email;
    }
  });
  Object.defineProperty(exports, 'equality', {
    enumerable: true,
    get: function () {
      return _decorators.equality;
    }
  });
  Object.defineProperty(exports, 'exclusion', {
    enumerable: true,
    get: function () {
      return _decorators.exclusion;
    }
  });
  Object.defineProperty(exports, 'inclusion', {
    enumerable: true,
    get: function () {
      return _decorators.inclusion;
    }
  });
  Object.defineProperty(exports, 'format', {
    enumerable: true,
    get: function () {
      return _decorators.format;
    }
  });
  Object.defineProperty(exports, 'url', {
    enumerable: true,
    get: function () {
      return _decorators.url;
    }
  });
  Object.defineProperty(exports, 'numericality', {
    enumerable: true,
    get: function () {
      return _decorators.numericality;
    }
  });
  Object.defineProperty(exports, 'errorHandler', {
    enumerable: true,
    get: function () {
      return _decorators.errorHandler;
    }
  });
  Object.defineProperty(exports, 'ValidationEngine', {
    enumerable: true,
    get: function () {
      return _validationEngine.ValidationEngine;
    }
  });
  Object.defineProperty(exports, 'Validator', {
    enumerable: true,
    get: function () {
      return _validator.Validator;
    }
  });
  Object.defineProperty(exports, 'ValidationReporter', {
    enumerable: true,
    get: function () {
      return _validationReporter.ValidationReporter;
    }
  });
  Object.defineProperty(exports, 'ValidationRenderer', {
    enumerable: true,
    get: function () {
      return _validationRenderer.ValidationRenderer;
    }
  });
  exports.configure = configure;
  function configure(aurelia, config) {
    aurelia.container.registerHandler(_aureliaValidation.Validator, _validator.Validator);
    aurelia.container.registerHandler(_aureliaValidation.ValidationReporter, _validationReporter.ValidationReporter);
    aurelia.globalResources('./validate-binding-behavior');

    _validationConfig.ValidationConfig.prototype.configBuilder = new _configBuilder.ConfigBuilder();
    if (config !== undefined && typeof config === 'function') {
      config(_validationConfig.ValidationConfig.prototype.configBuilder);
    }
  }
});