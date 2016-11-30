'use strict';

function YandexTestPage() {
  this.navigate = function () {
    browser.get('/yandex-test-page.html');
  };

  this.getYandexLogo = function () {
    return $('.wix-payment-yandex-logo');
  };

  this.clickYandexButton = function () {
    $('a').click();
  };
}

module.exports = YandexTestPage;
