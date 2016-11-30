'use strict';

function MercadoPagoTestPage() {
  this.navigate = function () {
    browser.get('/mercadopago-test-page.html');
  };

  this.getMercadoPagoLogo = function () {
    return $('.wix-payment-mercadopago-logo');
  };
}

module.exports = MercadoPagoTestPage;
