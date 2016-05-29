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
