export { length, required, date, datetime, email, equality, exclusion, inclusion, format, url, numericality, errorHandler } from './decorators';
export { ValidationEngine } from './validation-engine';
import { Validator } from 'aurelia-validation';
import { Validator as ValidateJSValidator } from './validator';
export { Validator } from './validator';
import { ValidationReporter } from 'aurelia-validation';
import { ValidationReporter as ValidateJSReporter } from './validation-reporter';
export { ValidationReporter } from './validation-reporter';
export { ValidationRenderer } from './validation-renderer';
import { ValidationConfig } from './validation-config';
import { ConfigBuilder } from './config-builder';

export function configure(aurelia, config) {
  aurelia.container.registerHandler(Validator, ValidateJSValidator);
  aurelia.container.registerHandler(ValidationReporter, ValidateJSReporter);
  aurelia.globalResources('./validate-binding-behavior');

  ValidationConfig.prototype.configBuilder = new ConfigBuilder();
  if (config !== undefined && typeof config === 'function') {
    config(ValidationConfig.prototype.configBuilder);
  }
}