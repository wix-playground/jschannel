'use strict';
function Utils() {
  this.runIfNotIE = function (callback) {
    return browser.getCapabilities().then(function (capabilities) {
      if (capabilities.get('browserName') !== 'internet explorer') {
        callback();
      }
    });
  };
}
module.exports = Utils;
