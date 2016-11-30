'use strict';

import {CreditCardComponentTestPage} from '../pages/cc-component-test-page.js';

require('../lib/matchers.protractor.js');
var MainPage = require('../pages/credit-card-page.js');
var experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');

var browserLogs = require('protractor-browser-logs');
var logs;

var ON_LOAD_RESPONSE_LABEL = 'onLoad';
var START_CC_PAYMENT_LABEL = 'onStartCcPaymentProcessing';
var ON_PAYMENT_COMPLETE_LABEL = 'onPaymentComplete';
var ON_PAYMENT_ERROR_LABEL = 'onPaymentError';
var ON_LOAD_ERROR_RESPONSE_LABEL = 'onError';

describe('wixPaymentApp Component Page', function () {
  var mainPage, creditCardComponentTestPage;

  function switchToPaymentFrame() {
    browser.switchTo().frame('payment');
  }

  function switchToTestFrame() {
    browser.switchTo().defaultContent();
  }

  //TODO: should I move all of this to pageobject? (code reuse vs is this the correct place)
  function fillValidForm() {
    mainPage.fillCreditCard('4222222222222');
    mainPage.fillExpiration(11, 2017);
    mainPage.fillSecurityCode(900);
    mainPage.fillName('John Doe');
  }

  function fillInvalidSecurityCodeForm() {
    mainPage.fillCreditCard('5424000000000015');
    mainPage.fillExpiration(8, 2018);
    mainPage.fillSecurityCode(901); //correct csc is 900 (on fake server)
    mainPage.fillName('John Doe');
  }

  function getUrlParams() {
    return {
      'orderSnapshotId': '12345',
      visitorId: '1111',
      appInstanceId: 'aaaa'
    };
  }

  function getOnLoadResponseLabel() {
    return creditCardComponentTestPage.responsesLabels.get(0).getText();
  }

  function getStartCcPaymentProcessingLabel() {
    return creditCardComponentTestPage.responsesLabels.get(1).getText();
  }

  function getPaymentResponseLabel() {
    return creditCardComponentTestPage.responsesLabels.get(2).getText();
  }

  function fillInvalidCreditCardForm() {
    mainPage.fillCreditCard('4222222222223');
    mainPage.fillExpiration(11, 2017);
    mainPage.fillSecurityCode(900);
    mainPage.fillName('John Doe');
  }

  function clearForm() {
    mainPage.clearSecurityCode();
    mainPage.clearCreditCard();
    mainPage.clearExpirationDate();
    mainPage.clearName();
  }

  function mockPaymentIframeUrl(url) {
    browser.addMockModule('mockPayment', function (url) {
      angular.module('mockPayment', ['paymentAppMocks']).config(function ($provide) {
        $provide.value('iframeUrlConstant', url);
      });
    }, url);
  }

  beforeEach(function () {
    logs = browserLogs(browser);

    logs.ignore(function (message) {
      return message.message.indexOf('') > -1;
    });
  });

  beforeEach(function () {
    mainPage = new MainPage();
    creditCardComponentTestPage = new CreditCardComponentTestPage();
    experimentManager.setExperiments({});
    browser.addMockModule('paymentAppMocks', function () {
    });
    browser.removeMockModule('disableTimeouts');
  });

  afterEach(function () {
    browser.clearMockModules();
    return logs.verify();
  });

  describe('Normal flow', function () {

    beforeEach(function () {
      mockPaymentIframeUrl('./credit-card-page.html');
    });

    it('should report "onLoad" after loaded', function () {
      var urlParams = getUrlParams();
      creditCardComponentTestPage.navigate(urlParams);
      expect(getOnLoadResponseLabel()).toBe(ON_LOAD_RESPONSE_LABEL);
    });

    it('should submit successfully', function () {
      var urlParams = getUrlParams();
      creditCardComponentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillValidForm();
      mainPage.submitForm();
      switchToTestFrame();
      expect(getOnLoadResponseLabel()).toBe(ON_LOAD_RESPONSE_LABEL);
      expect(getStartCcPaymentProcessingLabel()).toBe(START_CC_PAYMENT_LABEL);

      creditCardComponentTestPage.waitForPresenceOf(creditCardComponentTestPage.responsesLabels.get(2));
      expect(creditCardComponentTestPage.responsesLabels.get(2).getText()).toBe(ON_PAYMENT_COMPLETE_LABEL);
      expect(creditCardComponentTestPage.responsesLabels.count()).toBe(3);
    });

    it('should not submit valid form twice', function () {
      var urlParams = getUrlParams();
      creditCardComponentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillValidForm();
      mainPage.submitForm();
      mainPage.submitForm();
      switchToTestFrame();
      expect(getOnLoadResponseLabel()).toBe(ON_LOAD_RESPONSE_LABEL);
      expect(getStartCcPaymentProcessingLabel()).toBe(START_CC_PAYMENT_LABEL);
      expect(getPaymentResponseLabel()).toBe(ON_PAYMENT_COMPLETE_LABEL);
      expect(creditCardComponentTestPage.responsesLabels.count()).toBe(3);
    });

    it('should submit with error - invalid security code', function () {
      var urlParams = getUrlParams();
      creditCardComponentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillInvalidSecurityCodeForm();
      mainPage.submitForm();
      switchToTestFrame();
      expect(getOnLoadResponseLabel()).toBe(ON_LOAD_RESPONSE_LABEL);
      expect(getStartCcPaymentProcessingLabel()).toBe(START_CC_PAYMENT_LABEL);
      expect(getPaymentResponseLabel()).toBe(ON_PAYMENT_ERROR_LABEL);
      expect(creditCardComponentTestPage.responsesLabels.count()).toBe(3);
    });

    it('should set new height after error message and see last line', function () {
      var urlParams = getUrlParams();
      creditCardComponentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillInvalidSecurityCodeForm();
      mainPage.submitForm();
      expect(mainPage.getLastLine().isDisplayed()).toBeTruthy();
    });

    it('should submit valid form after failing first', function () {
      var urlParams = getUrlParams();
      creditCardComponentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillInvalidSecurityCodeForm();
      mainPage.submitForm();
      clearForm();
      fillValidForm();
      mainPage.submitForm();
      switchToTestFrame();
      expect(getOnLoadResponseLabel()).toBe(ON_LOAD_RESPONSE_LABEL);
      expect(getStartCcPaymentProcessingLabel()).toBe(START_CC_PAYMENT_LABEL);
      expect(getPaymentResponseLabel()).toBe(ON_PAYMENT_ERROR_LABEL);
      expect(creditCardComponentTestPage.responsesLabels.get(3).getText()).toBe(START_CC_PAYMENT_LABEL);
      expect(creditCardComponentTestPage.responsesLabels.get(4).getText()).toBe(ON_PAYMENT_COMPLETE_LABEL);
      expect(creditCardComponentTestPage.responsesLabels.count()).toBe(5);
    });

    it('should submit with error - invalid card number', function () {
      var urlParams = getUrlParams();
      creditCardComponentTestPage.navigate(urlParams);
      switchToPaymentFrame();
      fillInvalidCreditCardForm();
      mainPage.submitForm();
      switchToTestFrame();
      expect(getOnLoadResponseLabel()).toBe(ON_LOAD_RESPONSE_LABEL);
      expect(creditCardComponentTestPage.responsesLabels.count()).toBe(1);
    });

    // it('should set height according to iFrame height', function() {
    //   var urlParams = getUrlParams();
    //   creditCardComponentTestPage.navigate(urlParams);
    //   var componentPageHeight = creditCardComponentTestPage.getCcIframeHeight();
    //   switchToPaymentFrame();
    //   var mainPageHeight = mainPage.getPageHeight();
    //   //browser.pause();
    //   expect(componentPageHeight).toEqual(mainPageHeight);

    // });
  });

  describe('Broken iframe url', function () {
    beforeEach(function () {
      browser.removeMockModule('disableTimeouts');
      mockPaymentIframeUrl('./index1.html');
    });

    it('should trigger onError event if iFrame fail to load', function () {
      var urlParams = getUrlParams();
      creditCardComponentTestPage.navigate(urlParams);
      expect(getOnLoadResponseLabel()).toBe(ON_LOAD_ERROR_RESPONSE_LABEL);
    });
  });
});
