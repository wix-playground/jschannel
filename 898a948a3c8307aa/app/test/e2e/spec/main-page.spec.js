'use strict';

var MainPage = require('../pages/main-page.js');
var TestPage = require('../pages/test-page.js');
var experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');
var cashierBiLoggerMock = require('./cashier-bi-logger.driver');
var biEvents = require('../constants/bi-events.js');
var paymentMethodConstant = require('../constants/payment-methods-constants');
var Utils = require('../lib/utils.js');
var utils = new Utils();
require('../lib/matchers.protractor.js');
var serverPaymentStatusConstants = require('../constants/server-payment-status-constants');

var browserLogs = require('protractor-browser-logs');
var logs;

describe('wixPaymentApp Main Page', function () {
  var mainPage, testPage;

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

  function clearForm() {
    mainPage.clearSecurityCode();
    mainPage.clearCreditCard();
    //mainPage.clearExpirationDate();
    mainPage.clearName();
  }

  function getUrlParams() {
    return {
      'orderSnapshotId': '12345',
      visitorId: '1111',
      appInstanceId: 'aaaa',
      appDefId: 'bbbb'
    };
  }

  function getUrlParamsWithTermsAndConditions(termsAndConditionsFlag) {
    var navigationParams = getUrlParams();
    navigationParams.isTermsDefined = termsAndConditionsFlag;
    return navigationParams;
  }

  function freezeTime(year, month, day) {
    browser.addMockModule('freezeTime', function (year, month, day) {
      angular.module('freezeTime', ['paymentAppMocks']).value('now', function () {
        return new Date(year, month, day);
      });
    }, year, month, day);
  }

  beforeEach(function () {
    logs = browserLogs(browser);

    logs.ignore(function (message) {
      return message.message.indexOf('') > -1;
    });
  });

  beforeEach(function () {
    mainPage = new MainPage();
    testPage = new TestPage();
    experimentManager.setExperiments({});
    browser.addMockModule('paymentAppMocks', function () {
    });

  });

  afterEach(function () {
    browser.clearMockModules();
    return logs.verify();
  });


  describe('BI events', function () {

    afterEach(function () {
      cashierBiLoggerMock.assertEmpty();
      cashierBiLoggerMock.clear();
    });

    //----BI----
    it('should trigger IFRAME_LOAD BI event when iFrame loads', function () {
      var urlParams = getUrlParams();
      mainPage.navigate(urlParams);
      expect(cashierBiLoggerMock.shift()).toMatchBiUrl({
        evid: biEvents.IFRAME_LOADED,
        src: biEvents.src,
        source: biEvents.Source.IFRAME_ONLY_INTEGRATION,
        paymentCategory: paymentMethodConstant.CREDIT_CARD,
        orderSnapshotId: urlParams.orderSnapshotId,
        visitorId: urlParams.visitorId,
        appInstanceId: urlParams.appInstanceId,
        appId: urlParams.appDefId
      });
    });

    it('should trigger bi event when failing credit card validation on submit', function () {
      var urlParams = getUrlParams();
      var wrongCreditCard = 4222222222223;
      mainPage.navigate(urlParams);
      cashierBiLoggerMock.clear();
      mainPage.fillCreditCard(wrongCreditCard);
      mainPage.submitForm();
      expect(cashierBiLoggerMock.shift()).toMatchBiUrl({
        evid: biEvents.INVALID_CARD,
        src: biEvents.src,
        orderSnapshotId: urlParams.orderSnapshotId,
        visitorId: urlParams.visitorId,
        appInstanceId: urlParams.appInstanceId,
        appId: urlParams.appDefId
      });
    });

    it('should send fail validation BI for wrong credit card on blur', function () {
      var wrongCreditCard = 4222222222223;
      var urlParams = getUrlParams();
      mainPage.navigate(urlParams);
      cashierBiLoggerMock.clear();
      mainPage.fillCreditCard(wrongCreditCard);
      mainPage.fillSecurityCode(123);
      expect(cashierBiLoggerMock.shift()).toMatchBiUrl({
        evid: biEvents.INVALID_CARD,
        src: biEvents.src,
        orderSnapshotId: urlParams.orderSnapshotId,
        visitorId: urlParams.visitorId,
        appInstanceId: urlParams.appInstanceId,
        appId: urlParams.appDefId
      });
    });

    it('should trigger "Approved" bi event for successful submit_order', function () {
      var urlParams = getUrlParams();
      mainPage.navigate(urlParams);
      cashierBiLoggerMock.clear();
      fillValidForm();
      mainPage.submitForm();
      expect(cashierBiLoggerMock.shift()).toMatchBiUrl({
        evid: biEvents.SUBMIT_ORDER_END,
        src: biEvents.src,
        orderSnapshotId: urlParams.orderSnapshotId,
        transactionStatus: serverPaymentStatusConstants.APPROVED,
        visitorId: urlParams.visitorId,
        appInstanceId: urlParams.appInstanceId,
        appId: urlParams.appDefId
      });
    });

    //TODO: add test for Failure & GatewayFailure
    it('should trigger "Decline" bi event for declined submit_order', function () {
      var urlParams = getUrlParams();
      mainPage.navigate(urlParams);
      cashierBiLoggerMock.clear();
      fillInvalidSecurityCodeForm();
      mainPage.submitForm();
      expect(cashierBiLoggerMock.shift()).toMatchBiUrl({
        evid: biEvents.SUBMIT_ORDER_END,
        src: biEvents.src,
        orderSnapshotId: urlParams.orderSnapshotId,
        visitorId: urlParams.visitorId,
        appInstanceId: urlParams.appInstanceId,
        appId: urlParams.appDefId,
        transactionStatus: serverPaymentStatusConstants.DECLINED
      });
    });

    it('should trigger bi event when hovering over security code hint', function () {
      var urlParams = getUrlParams();
      mainPage.navigate(urlParams);
      cashierBiLoggerMock.clear();
      mainPage.hoverSecurityCode();
      utils.runIfNotIE(function () {
        expect(cashierBiLoggerMock.shift()).toMatchBiUrl({
          evid: biEvents.VIEW_TOOLTIP,
          src: biEvents.src,
          orderSnapshotId: urlParams.orderSnapshotId,
          visitorId: urlParams.visitorId,
          appInstanceId: urlParams.appInstanceId,
          appId: urlParams.appDefId
        });
      });
    });
  });

  //----general load events----
  it('should load successfully', function () {
    mainPage.navigate();
  });

  it('should focus credit card field on load', function () {
    mainPage.navigate();
    expect(mainPage.getCreditCardInput().getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
  });

  it('should fail validation for wrong security code on submit', function () {
    var wrongSecurityCode = 1;
    mainPage.navigate();
    mainPage.fillSecurityCode(wrongSecurityCode);
    mainPage.submitForm();
    expect(mainPage.getSecurityCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for wrong security code on blur', function () {
    var wrongSecurityCode = 1;
    mainPage.navigate();
    mainPage.fillSecurityCode(wrongSecurityCode);
    mainPage.fillCreditCard('4222222222222');
    expect(mainPage.getSecurityCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for wrong security code on blur and then pass with valid one', function () {
    var wrongSecurityCode = 1;
    var validSecurityCode = 123;
    mainPage.navigate();
    mainPage.fillSecurityCode(wrongSecurityCode);
    mainPage.fillCreditCard('4222222222222');
    mainPage.clearSecurityCode();
    mainPage.clearCreditCard();
    mainPage.fillSecurityCode(validSecurityCode);
    mainPage.fillCreditCard('4222222222222');
    expect(mainPage.getSecurityCardError().isDisplayed()).toBeFalsy();
  });

  //----tooltip----
  it('should show tooltip when hovering security code hint', function () {
    mainPage.navigate();
    mainPage.hoverSecurityCode();
    expect(mainPage.getSecurityCodeTooltip().isDisplayed()).toBeTruthy();
  });

  //----credit card----
  it('should fail validation for wrong credit card on submit', function () {
    var wrongCreditCard = 4222222222223;
    mainPage.navigate();
    mainPage.fillCreditCard(wrongCreditCard);
    mainPage.submitForm();
    expect(mainPage.getCreditCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for wrong credit card on blur', function () {
    var wrongCreditCard = 4222222222223;
    mainPage.navigate();
    mainPage.fillCreditCard(wrongCreditCard);
    mainPage.fillSecurityCode(123);
    expect(mainPage.getCreditCardError().isDisplayed()).toBeTruthy();
  });

  //----general validation----
  it('should fail validation for empty credit card on submit', function () {
    mainPage.navigate();
    mainPage.submitForm();
    expect(mainPage.getCreditCardError().isDisplayed()).toBeTruthy();
  });

  it('should not fail validation for first loaded page', function () {
    mainPage.navigate();
    expect(mainPage.getCreditCardError().isDisplayed()).toBeFalsy();
    expect(mainPage.getNameOnCardError().isPresent()).toBeFalsy();
    expect(mainPage.getExpirationDateError().isPresent()).toBeFalsy();
    expect(mainPage.getSecurityCardError().isPresent()).toBeFalsy();
  });

  it('should not to have submit error message for first loaded page', function () {
    mainPage.navigate();
    expect(mainPage.getSubmitErrorMessage().isDisplayed()).toBeFalsy();
  });

  it('should show general error message when submit_order fails - wrong security code', function () {
    mainPage.navigate();
    fillInvalidSecurityCodeForm();
    mainPage.submitForm();
    expect(mainPage.getSubmitErrorMessage().isDisplayed()).toBeTruthy();
  });

  it('should not show general error message when submit_order success - wrong security code', function () {
    mainPage.navigate();
    fillValidForm();
    mainPage.submitForm();
    expect(mainPage.getSubmitErrorMessage().isDisplayed()).toBeFalsy();
  });

  it('should not show general error message when re-submiting order', function () {
    mainPage.navigate();
    fillInvalidSecurityCodeForm();
    mainPage.submitForm();
    clearForm();
    fillValidForm();
    mainPage.submitForm();
    expect(mainPage.getSubmitErrorMessage().isDisplayed()).toBeFalsy();
  });

  //----name on card----
  it('should fail validation for no "name on card" on submit', function () {
    mainPage.navigate();
    mainPage.fillName('');
    mainPage.submitForm();
    expect(mainPage.getNameOnCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for no "name on card" on blur', function () {
    mainPage.navigate();
    mainPage.fillName('');
    mainPage.fillSecurityCode(123);
    expect(mainPage.getNameOnCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for past expiration date on submit', function () {
    freezeTime(2015, 5, 5);
    mainPage.navigate();
    mainPage.fillExpiration(1, 2015, 2015);
    mainPage.submitForm();
    expect(mainPage.getExpirationDateError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for past expiration date on blur', function () {
    freezeTime(2015, 5, 5);
    mainPage.navigate();
    mainPage.fillExpiration(1, 2015, 2015);
    mainPage.fillSecurityCode(123);
    expect(mainPage.getExpirationDateError().isDisplayed()).toBeTruthy();
  });

  it('should show "terms and conditions" checkbox if "isTermsDefined" flag is set to true', function () {
    mainPage.navigate(getUrlParamsWithTermsAndConditions(true));
    expect(mainPage.getTermsAndConditions().isPresent()).toBeTruthy();
  });

  it('should not show "terms and conditions" checkbox if "isTermsDefined" flag is set to false', function () {
    mainPage.navigate(getUrlParamsWithTermsAndConditions(false));
    expect(mainPage.getTermsAndConditions().isPresent()).toBeFalsy();
  });

  it('should enable submit button if "terms and conditions" checkbox is checked', function () {
    mainPage.navigate(getUrlParamsWithTermsAndConditions(true));

    expect(mainPage.getSubmitButton().isEnabled()).toBe(true);
  });

  it('should enable submit button if "isTermsDefined" flag is set to false', function () {
    mainPage.navigate(getUrlParamsWithTermsAndConditions(false));
    expect(mainPage.getSubmitButton().isEnabled()).toBe(true);
  });

  it('should enable submit button if "isTermsDefined" flag is undefined', function () {
    mainPage.navigate();
    expect(mainPage.getSubmitButton().isEnabled()).toBe(true);
  });

  it('should check terms and conditions by default', function () {
    mainPage.navigate(getUrlParamsWithTermsAndConditions(true));
    expect(mainPage.getTermsAndConditionsCB().isSelected()).toBeTruthy();
  });
});
