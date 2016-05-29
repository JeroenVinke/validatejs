export class App {
  configureRouter(config, router) {
    config.title = 'aurelia-validate.js';
    config.map([
      { route: ['', 'decorators'], name: 'decorators', moduleId: 'decorators', nav: true, title: 'Decorators' },
      { route: 'fluent', name: 'fluent', moduleId: 'fluent', nav: true, title: 'Fluent' },
      { route: 'i18n', name: 'i18n', moduleId: 'i18n', nav: true, title: 'i18n' }
    ]);
    this.router = router;
  }
}
