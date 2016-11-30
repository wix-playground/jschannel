'use strict';

function PaymentMethodsConstants() {
  this.CREDIT_CARD = 'creditCard';
  this.PAYPAL = 'payPal';
  this.YANDEX = 'yandex';
  this.MERCADO_PAGO = 'mercadoPago';
  this.OFFLINE = 'offline';
}

module.exports = new PaymentMethodsConstants();
