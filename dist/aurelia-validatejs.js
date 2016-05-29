import {ValidationError} from 'aurelia-validation';
import {DOM} from 'aurelia-pal';
import {metadata} from 'aurelia-metadata';
import {inject} from 'aurelia-dependency-injection';
import {getContextFor} from 'aurelia-binding';

import validate from 'validate.js';
export class ValidationRule {
  name = '';
  config;
  constructor(name, config, validateJS = true) {
    this.name = name;
    this.config = config;
    this.validateJS = validateJS;
  }
  validate(target, propName) {
    if (target && propName && this.validateJS) {
      let validator = { [propName]: { [this.name]: this.config } };
      let result = validate(target, validator);
      if (result) {
        let error = cleanResult(result);
        result = new ValidationError(Object.assign(error, { rule: this.name }));
      }
      return result;
    } else if (!target || !propName) {
      throw new Error('Invalid target or property name.');
    }
  }
  static date(config = true) {
    return new ValidationRule('date', config);
  }
  static datetime(config = true) {
    return new ValidationRule('datetime', config);
  }
  static email(config = true) {
    return new ValidationRule('email', config);
  }
  static equality(config) {
    return new ValidationRule('equality', config);
  }
  static exclusion(config) {
    return new ValidationRule('exclusion', config);
  }
  static format(config) {
    return new ValidationRule('format', config);
  }
  static inclusion(config) {
    return new ValidationRule('inclusion', config);
  }
  static lengthRule(config) {
    return new ValidationRule('length', config);
  }
  static numericality(config = true) {
    return new ValidationRule('numericality', config);
  }
  static presence(config = true) {
    return new ValidationRule('presence', config);
  }
  static url(config = true) {
    return new ValidationRule('url', config);
  }
  static errorHandler(callback) {
    return new ValidationRule('errorHandler', callback, false);
  }
}

export function cleanResult(data) {
  let result = {};
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      result = {
        propertyName: prop,
        message: data[prop][0]
      };
    }
  }
  return result;
}

function getRandomId() {
  let rand = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  let id = new Date().getTime() + rand;
  return id;
}

export class ValidationObserver {
  id = getRandomId();
  callback;
  reporter;
  constructor(reporter, callback) {
    this.reporter = reporter;
    this.callback = callback;
  }
  dispose() {
    this.reporter.destroyObserver(this);
  }
}

export class ValidationReporter {
  callback;
  __callbacks__ = {};
  subscribe(callback) {
    let observer = new ValidationObserver(this, callback);
    this.__callbacks__[observer.id] = observer;
    return observer;
  }
  publish(errors) {
    for (let key of Object.keys(this.__callbacks__)) {
      let observer = this.__callbacks__[key];
      observer.callback(errors);
    }
  }
  destroyObserver(observer) {
    delete this.__callbacks__[observer.id];
    return true;
  }
}

export class ValidationRenderer {
  renderErrors(node, relevantErrors) {
    this.unrenderErrors(node);
    if (relevantErrors.length) {
      node.parentElement.classList.add('has-error');
      relevantErrors.forEach(error => {
        if (node.parentElement.textContent.indexOf(error.message) === -1) {
          let errorMessageHelper = DOM.createElement('span');
          let errorMessageNode = DOM.createTextNode(error.message);
          errorMessageHelper.appendChild(errorMessageNode);
          errorMessageHelper.classList.add('help-block', 'au-validation');
          node.parentElement.appendChild(errorMessageHelper);
        }
      });
    }
  }
  unrenderErrors(node) {
    let deleteThese = [];
    node.parentElement.classList.remove('has-error');
    let children = node.parentElement.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child.classList.contains('help-block') && child.classList.contains('au-validation')) {
        deleteThese.push(child);
      }
    }
    deleteThese.forEach(child => {
      node.parentElement.removeChild(child);
    });
  }
}

export class ConfigBuilder {
  useTranslation(callback) {
    this.translationCallback = callback;
  }
}

export const validationMetadataKey = 'aurelia:validation';

export class ValidationConfig {
  __validationRules__ = [];
  addRule(key, rule) {
    this.__validationRules__.push({ key: key, rule: rule });
  }
  validate(instance, reporter, key) {
    let errors = [];
    this.__validationRules__.forEach(rule => {
      if (!key || key === rule.key) {
        let result = rule.rule.validate(instance, rule.key);
        if (result) {
          errors.push(this.translateError(result));
        }
      }
    });
    reporter.publish(errors);
    return errors;
  }
  translateError(error) {
    let service = this.getTranslationService(error.propertyName);
    if (service) {
      let msg = service(error);
      if (msg) { // if null/undefined is returned, keep the default message
        error.message = msg;
      }
    }
    return error;
  }
  getTranslationService(key) {
    // is there an errorHandler rule for this key?
    // .errorHandler(error => return something)
    let errorHandler = this.__validationRules__.find(r => r.key === key && r.rule.name === 'errorHandler');
    if (errorHandler) {
      errorHandler = errorHandler.rule.config;
    } else {
      // check if a global translation callback has been set in the configBuilder
      let configBuilder = ValidationConfig.prototype.configBuilder;
      if (configBuilder.translationCallback) {
        errorHandler = configBuilder.translationCallback;
      }
    }
    return errorHandler;
  }
  getValidationRules() {
    return this.__validationRules__ || (this.__validationRules__ = aggregateValidationRules(this));
  }
  aggregateValidationRules() {
    console.error('not yet implemented');
    //get __validationRules__ from class using metadata
    //merge with any instance specific __validationRules__
  }
}

export class ValidationEngine {
  static getValidationReporter(instance) {
    return instance.__validationReporter__ || (instance.__validationReporter__ = new ValidationReporter());
  }
}

export function observeProperty(target, key, descriptor) {
  let config = metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, target);

  // TODO: REMOVE
  let innerPropertyName = `_${key}`;

  // typescript or babel?
  let babel = descriptor !== undefined;

  if (babel) {
    // babel passes in the property descriptor with a method to get the initial value.

    // set the initial value of the property if it is defined.
    if (typeof descriptor.initializer === 'function') {
      target[innerPropertyName] = descriptor.initializer();
    }
  } else {
    descriptor = {};
  }

  delete descriptor.writable;
  delete descriptor.initializer;

  descriptor.get = function() { return this[innerPropertyName]; };
  descriptor.set = function(newValue) {
    let reporter = ValidationEngine.getValidationReporter(this);

    this[innerPropertyName] = newValue;

    config.validate(this, reporter);
  };

  descriptor.get.dependencies = [innerPropertyName];

  if (!babel) {
    Reflect.defineProperty(target, key, descriptor);
  }
}

@inject(ValidationRenderer)
export class ValidateBindingBehavior {
  constructor(renderer) {
    this.renderer = renderer;
  }
  bind(binding, source, elem) {
    let targetProperty;
    let target;
    let reporter;
    targetProperty = this.getTargetProperty(binding);
    target = this.getPropertyContext(source, targetProperty);
    reporter = this.getReporter(target);
    reporter.subscribe(errors => {
      let relevantErrors = errors.filter(error => {
        return error.propertyName === targetProperty;
      });
      this.renderer.renderErrors(elem ? elem : binding.target, relevantErrors);
    });
  }
  unbind(binding, source) {
    // TODO: destroy yourself, gracefully
  }
  getTargetProperty(binding) {
    let targetProperty;
    let expr = binding.sourceExpression.expression;
    while (expr) {
      targetProperty = expr.name + (targetProperty ? '.' + targetProperty : '');
      expr = expr.object;
    }
    return targetProperty;
  }
  getPropertyContext(source, targetProperty) {
    let target = getContextFor(targetProperty, source, 0);
    return target;
  }
  getReporter(target) {
    return ValidationEngine.getValidationReporter(target);
  }
}

export class Validator {
  object;
  config;
  constructor(object) {
    this.object = object;
  }
  validate(prop) {
    let config = metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, this.object);
    let reporter = ValidationEngine.getValidationReporter(this.object);
    if (prop) {
      config.validate(this.object, reporter, prop);
    } else {
      config.validate(this.object, reporter);
    }
  }
  getProperties() {
    console.error('Not yet implemented');
  }
  ensure(prop) {
    let config = metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, this.object);
    this.config = config;
    this.currentProperty = prop;
    return this;
  }
  length(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.lengthRule(configuration));
    return this;
  }
  presence(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.presence(configuration));
    return this;
  }
  required(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.presence(configuration));
    return this;
  }
  numericality(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.numericality(configuration));
    return this;
  }
  date(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.date(configuration));
    return this;
  }
  datetime(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.datetime(configuration));
    return this;
  }
  email(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.email(configuration));
    return this;
  }
  equality(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.equality(configuration));
    return this;
  }
  format(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.format(configuration));
    return this;
  }
  inclusion(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.inclusion(configuration));
    return this;
  }
  exclusion(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.exclusion(configuration));
    return this;
  }
  url(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.url(configuration));
    return this;
  }
  errorHandler(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.errorHandler(configuration));
    return this;
  }
}

export function base(targetOrConfig, key, descriptor, rule) {
  if (key) {
    let target = targetOrConfig;
    targetOrConfig = null;
    return addRule(target, key, descriptor, targetOrConfig, rule);
  }
  return function(t, k, d) {
    return addRule(t, k, d, targetOrConfig, rule);
  };
}

export function addRule(target, key, descriptor, targetOrConfig, rule) {
  let config = metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, target);
  config.addRule(key, rule(targetOrConfig));
  return observeProperty(target, key, descriptor, targetOrConfig, rule);
}

export function length(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.lengthRule);
}

export function presence(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.presence);
}

export function required(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.presence);
}

export function date(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.date);
}

export function datetime(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.datetime);
}

export function email(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.email);
}

export function equality(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.equality);
}

export function exclusion(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.exclusion);
}

export function inclusion(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.inclusion);
}

export function format(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.format);
}

export function url(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.url);
}

export function numericality(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.numericality);
}

export function errorHandler(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.errorHandler);
}
