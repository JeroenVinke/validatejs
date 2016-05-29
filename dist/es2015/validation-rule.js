import validate from 'validate.js';
import { ValidationError } from 'aurelia-validation';

export let ValidationRule = class ValidationRule {
  constructor(name, config, validateJS = true) {
    this.name = '';

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
};

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