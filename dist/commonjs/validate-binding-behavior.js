'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidateBindingBehavior = undefined;

var _dec, _class;

var _validationRenderer = require('./validation-renderer');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _validationEngine = require('./validation-engine');

var _aureliaBinding = require('aurelia-binding');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidateBindingBehavior = exports.ValidateBindingBehavior = (_dec = (0, _aureliaDependencyInjection.inject)(_validationRenderer.ValidationRenderer), _dec(_class = function () {
  function ValidateBindingBehavior(renderer) {
    _classCallCheck(this, ValidateBindingBehavior);

    this.renderer = renderer;
  }

  ValidateBindingBehavior.prototype.bind = function bind(binding, source, elem) {
    var _this = this;

    var targetProperty = void 0;
    var target = void 0;
    var reporter = void 0;
    targetProperty = this.getTargetProperty(binding);
    target = this.getPropertyContext(source, targetProperty);
    reporter = this.getReporter(target);
    reporter.subscribe(function (errors) {
      var relevantErrors = errors.filter(function (error) {
        return error.propertyName === targetProperty;
      });
      _this.renderer.renderErrors(elem ? elem : binding.target, relevantErrors);
    });
  };

  ValidateBindingBehavior.prototype.unbind = function unbind(binding, source) {};

  ValidateBindingBehavior.prototype.getTargetProperty = function getTargetProperty(binding) {
    var targetProperty = void 0;
    var expr = binding.sourceExpression.expression;
    while (expr) {
      targetProperty = expr.name + (targetProperty ? '.' + targetProperty : '');
      expr = expr.object;
    }
    return targetProperty;
  };

  ValidateBindingBehavior.prototype.getPropertyContext = function getPropertyContext(source, targetProperty) {
    var target = (0, _aureliaBinding.getContextFor)(targetProperty, source, 0);
    return target;
  };

  ValidateBindingBehavior.prototype.getReporter = function getReporter(target) {
    return _validationEngine.ValidationEngine.getValidationReporter(target);
  };

  return ValidateBindingBehavior;
}()) || _class);