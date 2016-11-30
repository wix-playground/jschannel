'use strict';

require('../lib/matchers.protractor.js');
var WixPaymentTestPage = require('../pages/wix-payment-test-page.js');
var MainPage = require('../pages/credit-card-page.js');
var experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');
var cashierBiLoggerMock = require('./cashier-bi-logger.driver');
var biEvents = require('../constants/bi-events.js');
var paymentMethodsConstants = require('../constants/payment-methods-constants');
var paymentGatewayidsConstants = require('../constants/payment-gatewayids-constants');

var browserLogs = require('protractor-browser-logs');
var logs;

var START_CC_PAYMENT_LABEL = 'onPaymentStart';
var ON_PAYMENT_SUCCESS_LABEL = 'onPaymentSuccess';
var ON_PAYMENT_ERROR_LABEL = 'onPaymentError';
var ON_LOAD_ERROR_RESPONSE_LABEL = 'onError';
var ON_PAYMENT_NAVIGATE_LABEL = 'onPaymentNavigate';
var ON_PAYMENT_NAVIGATE_BACK_LABEL = 'onPaymentNavigateBack';
//var EVENT_DESC_CC = 'creditcard';

describe('wixPaymentApp WixPayment Page', function () {
  var wixPaymentTestPage;
  var creditCardPage;

  function switchToPaymentFrame() {
    browser.switchTo().frame('payment');
  }

  function switchToTestFrame() {
    return browser.switchTo().defaultContent();
  }

  //TODO: should I move all of this to pageobject? (code reuse vs is this the correct place)
  function fillValidForm() {
    creditCardPage.fillCreditCard('4222222222222');
    creditCardPage.fillExpiration(11, 2017);
    creditCardPage.fillSecurityCode(900);
    creditCardPage.fillName('John Doe');
  }

  function fillInvalidSecurityCodeForm() {
    creditCardPage.fillCreditCard('5424000000000015');
    creditCardPage.fillExpiration(8, 2018);
    creditCardPage.fillSecurityCode(901); //correct csc is 900 (on fake server)
    creditCardPage.fillName('John Doe');
  }

  // jscs:disable disallowTrailingWhitespace
  function getShowAllElementsResponse() {
    return {
      'paymentMethods': [
        {
          'paymentMethod': paymentMethodsConstants.PAYPAL,
          'gatewayId': paymentGatewayidsConstants.PAYPAL
        },
        {
          'paymentMethod': paymentMethodsConstants.YANDEX,
          'gatewayId': paymentGatewayidsConstants.YANDEX
        },
        {
          'paymentMethod': paymentMethodsConstants.CREDIT_CARD,
          'gatewayId': paymentGatewayidsConstants.STRIPE
        },
        {
          'paymentMethod': paymentMethodsConstants.OFFLINE,
          'gatewayId': paymentGatewayidsConstants.OFFLINE
        },
        {
          'paymentMethod': paymentMethodsConstants.MERCADO_PAGO,
          'gatewayId': paymentGatewayidsConstants.MERCADO_PAGO
        }
      ],
      'offlineText': {
        titleId: 'settings.offlineTitleOptionDefault',
        text: `
                <p>regular text</p>
                
                <p><span style="font-weight:bold;">bold text&nbsp;</span></p>
                
                <p><span style="font-style:italic;">indent text</span></p>
                
                <p><span style="text-decoration:underline;">underline text</span></p>
                
                <ul>
                  <li>bullets</li>
                  <li>bulltets</li>
                </ul>
                
                <ol>
                  <li>number</li>
                  <li>nubmer</li>
                </ol>
                
                <p><a href="http://www.google.com" target="_blank"><span style="text-decoration:underline;">link to google</span></a></p>
              `
      }
    };
  }

  function getShowAllElementsSquareResponse() {
    return {
      'paymentMethods': [
        {
          'paymentMethod': paymentMethodsConstants.PAYPAL,
          'gatewayId': paymentGatewayidsConstants.PAYPAL
        },
        {
          'paymentMethod': paymentMethodsConstants.YANDEX,
          'gatewayId': paymentGatewayidsConstants.YANDEX
        },
        {
          'paymentMethod': paymentMethodsConstants.CREDIT_CARD,
          'gatewayId': paymentGatewayidsConstants.SQUARE
        },
        {
          'paymentMethod': paymentMethodsConstants.OFFLINE,
          'gatewayId': paymentGatewayidsConstants.OFFLINE
        },
        {
          'paymentMethod': paymentMethodsConstants.MERCADO_PAGO,
          'gatewayId': paymentGatewayidsConstants.MERCADO_PAGO
        }
      ],
      'offlineText': {
        titleId: 'settings.offlineTitleOptionDefault',
        text: `
                <p>regular text</p>

                <p><span style="font-weight:bold;">bold text&nbsp;</span></p>

                <p><span style="font-style:italic;">indent text</span></p>

                <p><span style="text-decoration:underline;">underline text</span></p>

                <ul>
                  <li>bullets</li>
                  <li>bulltets</li>
                </ul>

                <ol>
                  <li>number</li>
                  <li>nubmer</li>
                </ol>

                <p><a href="http://www.google.com" target="_blank"><span style="text-decoration:underline;">link to google</span></a></p>
              `
      }
    };
  }

  // jscs:disable disallowTrailingWhitespace

  function getDoNotShowAllElementsResponse() {
    return {
      'paymentMethods': []
    };
  }

  function getShowCreditCardResponse() {
    return {
      'paymentMethods': [
        {
          'paymentMethod': paymentMethodsConstants.CREDIT_CARD,
          'isActive': true,
          'gatewayId': paymentGatewayidsConstants.STRIPE
        }
      ]
    };
  }

  function getShowPaypalResponse() {
    return {
      'paymentMethods': [
        {
          'paymentMethod': paymentMethodsConstants.PAYPAL,
          'isActive': true,
          'gatewayId': paymentGatewayidsConstants.PAYPAL
        }
      ]
    };
  }

  function getShowYandexResponse() {
    return {
      'paymentMethods': [
        {
          'paymentMethod': paymentMethodsConstants.YANDEX,
          'isActive': true,
          'gatewayId': paymentGatewayidsConstants.YANDEX
        }
      ]
    };
  }

  function getShowMercadoPagoResponse() {
    return {
      'paymentMethods': [
        {
          'paymentMethod': paymentMethodsConstants.MERCADO_PAGO,
          'isActive': true,
          'gatewayId': paymentGatewayidsConstants.MERCADO_PAGO
        }
      ]
    };
  }

  function getUrlParams() {
    return {
      'orderSnapshotId': 'bd670f11-93ec-4967-9f79-b4262f09cb95',
      visitorId: '1111',
      appInstanceId: 'aaaa',
      appDefId: 'bbbb'
    };
  }

  function getUrlParamsUsingTermsAndConds() {
    return {
      'orderSnapshotId': 'bd670f11-93ec-4967-9f79-b4262f09cb95',
      visitorId: '1111',
      appInstanceId: 'aaaa',
      useTermsAndConditions: true
    };
  }

  function mockData(settings, url) {
    browser.addMockModule('mockPayment', function (settings, url) {
      angular.module('mockPayment', ['paymentAppMocks']).config(function (preConfigureSettingsProvider, $provide) {
        preConfigureSettingsProvider.mockSettings(settings);
        $provide.value('iframeUrlConstant', url);
      });
    }, settings, url);
  }

  function getMessageAt(index) {
    return wixPaymentTestPage.getEventMessages().get(index).getText();
  }

  // function getMessageDescriptionAt(index) {
  //   return wixPaymentTestPage.getEventMessageDescription().get(index).getText();
  // }

  beforeEach(function () {
    logs = browserLogs(browser);

    logs.ignore(function (message) {
      return message.message.indexOf('') > -1;
    });
  });

  beforeEach(function () {
    wixPaymentTestPage = new WixPaymentTestPage();
    creditCardPage = new MainPage();
    experimentManager.setExperiments({});
    browser.addMockModule('paymentAppMocks', () => { });
    browser.removeMockModule('disableTimeouts');
  });

  afterEach(function () {
    browser.clearMockModules();
    //cashierBiLoggerMock.assertEmpty();
    cashierBiLoggerMock.clear();
    return logs.verify();
  });

  describe('Normal flow', function () {

    function mockSettings(settings) {
      var url = './credit-card-page.html';
      mockData(settings, url);
    }

    it('should load successfully', function () {
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
    });

    it('should load wix-payment-paypal && wix-payment-yandex && wix-payment-mercadopago && wix-payment-credit-card && wix-payment-offline tabs when visibility setting is set to true', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      expect(browser.isElementPresent(wixPaymentTestPage.getPaypalTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getYandexTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getCCTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getMercadoPagoTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getOfflineTab())).toBeTruthy();
    });

    it('should not load wix-payment-paypal && wix-payment-yandex && wix-payment-credit-card && wix-payment-mercadopago && wix-payment-offline tabs when visibility setting is set to false', function () {
      mockSettings(getDoNotShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      expect(browser.isElementPresent(wixPaymentTestPage.getPaypalTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getYandexTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getCCTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getMercadoPagoTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getOfflineTab())).toBe(false);
    });

    it('should load only payPal tab', function () {
      mockSettings(getShowPaypalResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      expect(browser.isElementPresent(wixPaymentTestPage.getPaypalControl())).toBe(true);
      expect(browser.isElementPresent(wixPaymentTestPage.getYandexTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getCCTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getMercadoPagoTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getOfflineTab())).toBe(false);
    });

    it('should load only yandex tab', function () {
      mockSettings(getShowYandexResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      expect(browser.isElementPresent(wixPaymentTestPage.getPaypalTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getYandexControl())).toBe(true);
      expect(browser.isElementPresent(wixPaymentTestPage.getCCTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getMercadoPagoTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getOfflineTab())).toBe(false);
    });

    it('should load only credit card tab', function () {
      mockSettings(getShowCreditCardResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      expect(browser.isElementPresent(wixPaymentTestPage.getPaypalTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getYandexTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getCreditCardControl())).toBe(true);
      expect(browser.isElementPresent(wixPaymentTestPage.getMercadoPagoTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getOfflineTab())).toBe(false);
    });

    it('should load only mercado pago tab', function () {
      mockSettings(getShowMercadoPagoResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      expect(browser.isElementPresent(wixPaymentTestPage.getPaypalTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getYandexTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getCCTab())).toBe(false);
      expect(browser.isElementPresent(wixPaymentTestPage.getMercadoPagoControl())).toBe(true);
      expect(browser.isElementPresent(wixPaymentTestPage.getOfflineTab())).toBe(false);
    });

    it('should trigger "onPaymentStart" event when user presses credit card\'s "pay" button', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      switchToPaymentFrame();

      fillValidForm();
      creditCardPage.submitForm();

      switchToTestFrame();

      expect(getMessageAt(0)).toBe(ON_PAYMENT_NAVIGATE_LABEL);
      expect(getMessageAt(1)).toBe(START_CC_PAYMENT_LABEL);
    });

    it('should not display PCI iframe when gatewayId is Square', function () {
      mockSettings(getShowAllElementsSquareResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      expect(browser.isElementPresent(wixPaymentTestPage.getPCIIframe())).toBeFalsy();
    });

    it('should display Square component when gatewayId is Square', function () {
      mockSettings(getShowAllElementsSquareResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      expect(browser.isElementPresent(wixPaymentTestPage.getSquareComponent())).toBeTruthy();
    });

    it('should display Terms And Conditions on credit card payment page', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParamsUsingTermsAndConds();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      switchToPaymentFrame();

      expect(browser.isElementPresent(wixPaymentTestPage.getTermsAndConditions())).toBeTruthy();
    });

    it('should trigger "onPaymentSuccess" event when user successfuly submits a payment', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      switchToPaymentFrame();
      fillValidForm();
      creditCardPage.submitForm();
      switchToTestFrame();
      expect(getMessageAt(0)).toBe(ON_PAYMENT_NAVIGATE_LABEL);
      expect(getMessageAt(1)).toBe(START_CC_PAYMENT_LABEL);
      expect(getMessageAt(2)).toBe(ON_PAYMENT_SUCCESS_LABEL);
      expect(wixPaymentTestPage.getEventMessages().count()).toBe(3);
    });

    it('should trigger "onPaymentError" after submiting credit card with error - invalid security code', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      switchToPaymentFrame();
      fillInvalidSecurityCodeForm();
      creditCardPage.submitForm();
      switchToTestFrame();
      expect(getMessageAt(0)).toBe(ON_PAYMENT_NAVIGATE_LABEL);
      expect(getMessageAt(1)).toBe(START_CC_PAYMENT_LABEL);
      expect(getMessageAt(2)).toBe(ON_PAYMENT_ERROR_LABEL);
      expect(wixPaymentTestPage.getEventMessages().count()).toBe(3);
    });

    it('should navigate to credit card page and back, using browser\'s "back" button', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      expect(browser.isElementPresent(wixPaymentTestPage.getCreditCardControl())).toBe(true);
      browser.navigate().back();
      expect(browser.isElementPresent(wixPaymentTestPage.getPaypalTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getYandexTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getCCTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getMercadoPagoTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getOfflineTab())).toBeTruthy();
    });

    it('should navigate to credit card page and back, using our "back" button', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      expect(browser.isElementPresent(wixPaymentTestPage.getCreditCardControl())).toBe(true);
      wixPaymentTestPage.getBackButton().click();
      expect(browser.isElementPresent(wixPaymentTestPage.getPaypalTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getYandexTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getCCTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getMercadoPagoTab())).toBeTruthy();
      expect(browser.isElementPresent(wixPaymentTestPage.getOfflineTab())).toBeTruthy();
    });

    it('should trigger "onPaymentNavigate" and "onPaymentNavigateBack" for credit card', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      wixPaymentTestPage.getBackButton().click();
      expect(getMessageAt(0)).toBe(ON_PAYMENT_NAVIGATE_LABEL);
      expect(getMessageAt(1)).toBe(ON_PAYMENT_NAVIGATE_BACK_LABEL);
      //expect(getMessageDescriptionAt(1)).toBe(EVENT_DESC_CC);
    });

    it('should trigger "onPaymentNavigate" and "onPaymentNavigateBack" for credit card', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();
      wixPaymentTestPage.getBackButton().click();
      expect(getMessageAt(0)).toBe(ON_PAYMENT_NAVIGATE_LABEL);
      expect(getMessageAt(1)).toBe(ON_PAYMENT_NAVIGATE_BACK_LABEL);
      //expect(getMessageDescriptionAt(1)).toBe(EVENT_DESC_CC);
    });

    it('should trigger "Buyer chooses payment method" BI event when user choose payment method', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      cashierBiLoggerMock.clear();
      wixPaymentTestPage.getPaypalTab().click();
      expect(cashierBiLoggerMock.shift()).toMatchBiUrl({
        evid: biEvents.BUYER_CHOOSE_PAYMENT_METHOD,
        src: biEvents.src,
        orderSnapshotId: urlParams.orderSnapshotId,
        visitorId: urlParams.visitorId,
        appInstanceId: urlParams.appInstanceId,
        appId: urlParams.appDefId
      });
      cashierBiLoggerMock.assertEmpty();
    });

    it('should trigger "Buyer back from chosen payment method" BI event when user choose payment method', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getPaypalTab().click();
      cashierBiLoggerMock.clear();
      wixPaymentTestPage.getBackButton().click();
      expect(cashierBiLoggerMock.shift()).toMatchBiUrl({
        evid: biEvents.BUYER_BACK_FROM_CHOSEN_PAYMENT_METHOD,
        src: biEvents.src,
        orderSnapshotId: urlParams.orderSnapshotId,
        visitorId: urlParams.visitorId,
        appInstanceId: urlParams.appInstanceId,
        appId: urlParams.appDefId
      });
      cashierBiLoggerMock.assertEmpty();
    });
  });

  describe('Broken iframe url', function () {
    function mockSettings(settings) {
      var url = './credit-card-page1.html';
      mockData(settings, url);
    }

    it('should trigger onError event if iFrame fail to load', function () {
      mockSettings(getShowAllElementsResponse());
      var urlParams = getUrlParams();
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getCCTab().click();

      expect(getMessageAt(0)).toBe(ON_PAYMENT_NAVIGATE_LABEL);
      expect(getMessageAt(1)).toBe(ON_LOAD_ERROR_RESPONSE_LABEL);
    });
  });

  describe('External submit button', function () {

    function mockSettings(settings) {
      var url = './credit-card-page.html';
      mockData(settings, url);
    }

    function getUrlParams() {
      return {
        visitorId: '1111',
        appInstanceId: 'aaaa',
        externalOrderId: '12345678'
      };
    }

    it('should hide submit payment button', function () {
      mockSettings(getShowCreditCardResponse());
      var urlParams = getUrlParams();
      urlParams.externalSubmitButton = true;
      wixPaymentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      expect(browser.isElementPresent(creditCardPage.getSubmitButton())).toBeFalsy();
    });

    it('should submit payment when external button clicked', function () {
      mockSettings(getShowCreditCardResponse());
      var urlParams = getUrlParams();
      urlParams.externalSubmitButton = true;
      wixPaymentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillValidForm();
      switchToTestFrame();
      wixPaymentTestPage.getExternalSubmitButton().click();
      expect(getMessageAt(0)).toBe(START_CC_PAYMENT_LABEL);
      expect(getMessageAt(1)).toBe(ON_PAYMENT_SUCCESS_LABEL);
      expect(wixPaymentTestPage.getEventMessages().count()).toBe(2);
    });

    it('should submit payment only once when external button is clicked twice in a row', function () {
      mockSettings(getShowCreditCardResponse());
      var urlParams = getUrlParams();
      urlParams.externalSubmitButton = true;
      wixPaymentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillValidForm();
      switchToTestFrame();
      wixPaymentTestPage.getExternalSubmitButton().click();
      wixPaymentTestPage.getExternalSubmitButton().click();
      expect(getMessageAt(0)).toBe(START_CC_PAYMENT_LABEL);
      expect(getMessageAt(1)).toBe(ON_PAYMENT_SUCCESS_LABEL);
      expect(wixPaymentTestPage.getEventMessages().count()).toBe(2);
    });

    it('should trigger error message when failing (server side) after submitting using external button', function () {
      mockSettings(getShowCreditCardResponse());
      var urlParams = getUrlParams();
      urlParams.externalSubmitButton = true;
      wixPaymentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillInvalidSecurityCodeForm();
      switchToTestFrame();
      wixPaymentTestPage.getExternalSubmitButton().click();
      expect(getMessageAt(0)).toBe(START_CC_PAYMENT_LABEL);
      expect(getMessageAt(1)).toBe(ON_PAYMENT_ERROR_LABEL);
      expect(wixPaymentTestPage.getEventMessages().count()).toBe(2);
    });

    it('should trigger error message when failing after submitting using external button (client side validation)', function () {
      mockSettings(getShowCreditCardResponse());
      var urlParams = getUrlParams();
      urlParams.externalSubmitButton = true;
      wixPaymentTestPage.navigate(urlParams);
      wixPaymentTestPage.getExternalSubmitButton().click();
      expect(wixPaymentTestPage.getEventMessages().count()).toBe(1);
      expect(getMessageAt(0)).toBe(ON_PAYMENT_ERROR_LABEL);
    });
  });

});
