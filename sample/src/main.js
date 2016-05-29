import Backend from 'i18next-xhr-backend';
import {I18N} from 'aurelia-i18n';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-i18n', (instance) => {
      instance.i18next.use(Backend);

      return instance.setup({
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        lng: 'nl'
      });
    })
    .plugin('aurelia-validatejs', config => {
      let i18n = aurelia.container.get(I18N);
      config.useTranslation(error => {
        let translation = i18n.tr(error.rule, error);
        return translation !== error.rule ? translation : undefined;
      });
    });

  aurelia.start().then(a => {
    a.setRoot('app');

    System.config({
      paths: {
        "*": "dist/*"
      }
    })
  });
}
