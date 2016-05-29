"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConfigBuilder = exports.ConfigBuilder = function () {
  function ConfigBuilder() {
    _classCallCheck(this, ConfigBuilder);
  }

  ConfigBuilder.prototype.useTranslation = function useTranslation(callback) {
    this.translationCallback = callback;
  };

  return ConfigBuilder;
}();