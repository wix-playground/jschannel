'use strict';

function BiEvents() {
  this.src = 64;
  this.IFRAME_LOADED = 100;
  this.VIEW_TOOLTIP = 101;
  this.INVALID_CARD = 102;
  this.SUBMIT_ORDER_END = 103;
  this.SUBMIT_ORDER = 104;
  this.BUYER_CHOOSE_PAYMENT_METHOD = 105;
  this.BUYER_BACK_FROM_CHOSEN_PAYMENT_METHOD = 106;
  this.PaymentMethodType = {
    jcb: 'jcb',
    mastercard: 'mastercard',
    discover: 'discover',
    isracard: 'isracard',
    maestro: 'maestro',
    visa: 'visa',
    amex: 'amex',
    diners: 'diners',
    dankort: 'dankort',
    unionpay: 'unionpay'
  };
  this.Status = {
    FAILURE: false,
    SUCCESS: true
  };
  this.PageType = {
    CHOOSE_PAYMENT_METHOD_PAGE: 'payment method menu',
    PAYMENT_PAGE: 'payment page'
  };
  this.Source = {
    PAY_WITH: 'pay with',
    BUYER_CHOOSE: 'buyer choose',
    ONE_PAYMENT_METHOD: 'one payment method',
    IFRAME_ONLY_INTEGRATION: 'iframe only integration'
  };
}

module.exports = new BiEvents();
