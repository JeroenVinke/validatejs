import {inject} from 'aurelia-framework';
import {length, required, date, datetime, email, equality, exclusion, inclusion, format, url, numericality} from 'aurelia-validatejs';
import {ValidationEngine, Validator} from 'aurelia-validatejs';

export class Decorators {
  model;
  errors = [];
  subscriber;
  constructor() {
    this.model = new Model();
    // this.validator = new Validator(this.model)
    //  .ensure('firstName')
    //  .required()
    //  .length({minimum: 5, maximum: 20});

    this.validator = new Validator(this)
     .ensure('model.firstName')
     .required()
     .length({minimum: 5, maximum: 20});

    this.reporter = ValidationEngine.getValidationReporter(this);
    this.subscriber = this.reporter.subscribe(result => {
      console.log(result);
      this.renderErrors(result);
    });
  }
  detached() {
    this.subscriber.dispose();
  }
  attached() {
    this.validator.validate();
  }
  submit() {
    this.validator.validate();
  }
  hasErrors() {
    return !!this.errors.length;
  }
  renderErrors(result) {
    this.errors.splice(0, this.errors.length);
    result.forEach(error => {
      this.errors.push(error)
    });
  }
}

class Model {
}
