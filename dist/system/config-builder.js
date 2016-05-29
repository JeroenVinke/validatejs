"use strict";

System.register([], function (_export, _context) {
  var ConfigBuilder;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export("ConfigBuilder", ConfigBuilder = function () {
        function ConfigBuilder() {
          _classCallCheck(this, ConfigBuilder);
        }

        ConfigBuilder.prototype.useTranslation = function useTranslation(callback) {
          this.translationCallback = callback;
        };

        return ConfigBuilder;
      }());

      _export("ConfigBuilder", ConfigBuilder);
    }
  };
});