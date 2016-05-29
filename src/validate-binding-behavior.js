import {ValidationRenderer} from './validation-renderer';
import {inject} from 'aurelia-dependency-injection';
import {ValidationEngine} from './validation-engine';
import {getContextFor} from 'aurelia-binding';

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
