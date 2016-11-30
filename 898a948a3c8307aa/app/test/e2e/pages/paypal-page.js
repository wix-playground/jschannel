'use strict';

function PaypalTestPage() {
  this.navigate = function () {
    browser.get('/paypal-test-page.html');
  };

  this.getPaypalLogo = function () {
    return $('.wix-payment-pp-logo');
  };

  this.clickPaypalButton = function () {
    $('a').click();
  };
}

module.exports = PaypalTestPage;
