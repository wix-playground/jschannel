'use strict';

function WixPaymentTestPage() {
  this.navigate = function (urlParams) {
    var url = '/wix-payment-test-page.html#?visitorId=' + (urlParams.visitorId ? urlParams.visitorId : '') + '&appInstanceId=' + (urlParams.appInstanceId ? urlParams.appInstanceId : '') + '&appDefId=' + (urlParams.appDefId ? urlParams.appDefId : '') + '&useTermsAndConditions=' + (urlParams.useTermsAndConditions ? urlParams.useTermsAndConditions : '');

    if (typeof urlParams.orderSnapshotId !== 'undefined') {
      url += '&orderId=' + urlParams.orderSnapshotId;
    }

    if (typeof urlParams.externalOrderId !== 'undefined') {
      url += '&externalOrderId=' + urlParams.externalOrderId;
    }

    if (typeof urlParams.externalSubmitButton !== 'undefined') {
      url += '&externalSubmitButton=' + urlParams.externalSubmitButton;
    }
    browser.get(url);
  };

  this.getPaypalControl = function () {
    return $('wix-payment-paypal');
  };

  this.getYandexControl = function () {
    return $('wix-payment-yandex');
  };

  this.getCreditCardControl = function () {
    return $('wix-payment-credit-card');
  };

  this.getMercadoPagoControl = function () {
    return $('wix-payment-mercadopago');
  };

  this.getPaypalTab = function () {
    return $('.paypal-tab');
  };

  this.getYandexTab = function () {
    return $('.yandex-tab');
  };

  this.getCCTab = function () {
    return $('.credit-card-tab');
  };

  this.getMercadoPagoTab = function () {
    return $('.mercadopago-tab');
  };

  this.getOfflineTab = function () {
    return $('.offline-tab');
  };

  this.selectOfflineTab = function () {
    this.getOfflineTab().click();
  };

  this.getOfflinePaymentButton = function () {
    return $('.offline-pay-btn');
  };

  this.clickOfflinePayButton = function () {
    this.getOfflinePaymentButton().click();
  };

  this.getPaypalPayButton = function () {
    return $('[data-hook="paypal-pay-btn"]');
  };

  this.clickPaypalPayButton = function () {
    this.getPaypalPayButton().click();
  };

  this.getEventMessages = function () {
    return $$('.response-title');
  };

  this.getEventMessageDescription = function () {
    return $$('.response-description');
  };

  this.getBackButton = function () {
    return $('.wix-payment-tabset-back');
  };

  this.getExternalSubmitButton = function () {
    return $('#payButton');
  };

  this.getTermsAndConditions = function () {
    return $('[data-hook="wcsh-payment-creditCard-terms-and-conditions"]');
  };

  this.getPCIIframe = function () {
    return $('[data-hook="wcsh-credit-card-iframe"]');
  };

  this.getSquareComponent = function () {
    return $('[data-hook="wix-payment-square-component"]');
  };

}

module.exports = WixPaymentTestPage;
