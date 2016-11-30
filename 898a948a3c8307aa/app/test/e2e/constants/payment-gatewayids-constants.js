'use strict';

function PaymentGatewayidConstants() {
  this.SQUARE = 'com.square';
  this.STRIPE = 'com.stripe';
  this.EWAY = 'com.eway';
  this.PAYPAL = 'payPal';
  this.YANDEX = 'yandex';
  this.MERCADO_PAGO = 'NA';
  this.OFFLINE = 'NA';
}

module.exports = new PaymentGatewayidConstants();
