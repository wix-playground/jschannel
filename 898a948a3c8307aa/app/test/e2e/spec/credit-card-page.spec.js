'use strict';

var MainPage = require('../pages/credit-card-page.js');
var TestPage = require('../pages/test-page.js');
var experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');
var cashierBiLoggerMock = require('./cashier-bi-logger.driver.js');
var biEvents = require('../constants/bi-events.js');
var paymentMethodConstant = require('../constants/payment-methods-constants');
require('../lib/matchers.protractor.js');

var browserLogs = require('protractor-browser-logs');
var logs;

describe('wixPaymentApp Credit Card Page', function () {
  var creditCardPage, testPage;

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

  function clearForm() {
    creditCardPage.clearSecurityCode();
    creditCardPage.clearCreditCard();
    creditCardPage.clearExpirationDate();
    creditCardPage.clearName();
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
    creditCardPage = new MainPage();
    testPage = new TestPage();
    experimentManager.setExperiments({});
    browser.addMockModule('paymentAppMocks', function () {
    });

  });

  afterEach(function () {
    browser.clearMockModules();
    return logs.verify();
  });

  //----general load events----
  it('should load successfully', function () {
    creditCardPage.navigate();
  });

  it('should focus credit card field on load', function () {
    creditCardPage.navigate();
    expect(creditCardPage.getCreditCardInput().getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
  });

  //----BI----
  describe('BI Events', function () {

    afterEach(function () {
      cashierBiLoggerMock.assertEmpty();
      cashierBiLoggerMock.clear();
    });

    it('should trigger IFRAME_LOAD BI event when iFrame loads', function () {
      var urlParams = getUrlParams();
      creditCardPage.navigate(urlParams);
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

    //TODO: add this back
    // it('should trigger bi event when hovering over security code hint', function () {
    //   var urlParams = getUrlParams();
    //   creditCardPage.navigate(urlParams);
    //   cashierBiLoggerMock.clear();
    //   creditCardPage.hoverSecurityCode();
    //   utils.runIfNotIE(function () {
    //     expect(cashierBiLoggerMock.shift()).toMatchBiUrl({evid: biEvents.VIEW_TOOLTIP, src: biEvents.src, orderSnapshotId: urlParams.orderSnapshotId, visitorId: urlParams.visitorId, appInstanceId: urlParams.appInstanceId});
    //     cashierBiLoggerMock.assertEmpty();
    //   });
    // });
  });


  it('should fail validation for wrong security code on submit', function () {
    var wrongSecurityCode = 1;
    creditCardPage.navigate();
    creditCardPage.fillSecurityCode(wrongSecurityCode);
    creditCardPage.submitForm();
    expect(creditCardPage.getSecurityCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for empty on enter', function () {
    creditCardPage.navigate();
    $('#cardNumber').sendKeys(protractor.Key.ENTER);

    expect(creditCardPage.getCreditCardError().isDisplayed()).toBeTruthy();
    expect(creditCardPage.getExpirationDateError().isDisplayed()).toBeTruthy();
    expect(creditCardPage.getSecurityCardError().isDisplayed()).toBeTruthy();
    expect(creditCardPage.getNameOnCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for empty on submit', function () {
    creditCardPage.navigate();
    creditCardPage.submitForm();

    expect(creditCardPage.getCreditCardError().isDisplayed()).toBeTruthy();
    expect(creditCardPage.getExpirationDateError().isDisplayed()).toBeTruthy();
    expect(creditCardPage.getSecurityCardError().isDisplayed()).toBeTruthy();
    expect(creditCardPage.getNameOnCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for wrong security code on blur', function () {
    var wrongSecurityCode = 1;
    creditCardPage.navigate();
    creditCardPage.fillSecurityCode(wrongSecurityCode);
    creditCardPage.fillCreditCard('4222222222222');
    expect(creditCardPage.getSecurityCardError().isDisplayed()).toBeTruthy();
  });

  it('should hide security code label on page load', function () {
    creditCardPage.navigate();
    expect(creditCardPage.getSecurityCardLabel().isDisplayed()).toBeFalsy();
  });

  it('should show security code label for when filling security code', function () {
    var securityCode = 123;
    creditCardPage.navigate();
    creditCardPage.fillSecurityCode(securityCode);
    expect(creditCardPage.getSecurityCardLabel().isDisplayed()).toBeTruthy();
  });

  it('should show security code label for wrong security code on submit', function () {
    var wrongSecurityCode = 1;
    creditCardPage.navigate();
    creditCardPage.fillSecurityCode(wrongSecurityCode);
    creditCardPage.submitForm();
    expect(creditCardPage.getSecurityCardLabel().isDisplayed()).toBeTruthy();
  });

  it('should show security code label for wrong security code on blur', function () {
    var wrongSecurityCode = 1;
    creditCardPage.navigate();
    creditCardPage.fillSecurityCode(wrongSecurityCode);
    creditCardPage.fillCreditCard('4222222222222');
    expect(creditCardPage.getSecurityCardLabel().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for wrong security code on blur and then pass with valid one', function () {
    var wrongSecurityCode = 1;
    var validSecurityCode = 123;
    creditCardPage.navigate();
    creditCardPage.fillSecurityCode(wrongSecurityCode);
    creditCardPage.fillCreditCard('4222222222222');
    creditCardPage.clearSecurityCode();
    creditCardPage.clearCreditCard();
    creditCardPage.fillSecurityCode(validSecurityCode);
    creditCardPage.fillCreditCard('4222222222222');
    expect(creditCardPage.getSecurityCardError().isDisplayed()).toBeFalsy();
    expect(creditCardPage.getSecurityCardLabel().isDisplayed()).toBeTruthy();
  });

  it('should give the same height for Expiry Date and Security Code validation error messages', function () {
    creditCardPage.navigate();

    var wrongMonth = 'xx';
    var wrongYear = 'yy';
    creditCardPage.fillExpiration(wrongMonth, wrongYear);

    var wrongSecurityCode = 1;
    creditCardPage.fillSecurityCode(wrongSecurityCode);

    creditCardPage.submitForm();

    // iPhone 6 dimensions
    browser.manage().window().setSize(375, 667);

    expect(creditCardPage.getSecurityCardErrorLabelHeight()).toEqual(creditCardPage.getExpirationDateErrorLabelHeight());
  });

  //TODO: Put this back!
  // it('should focus on fail validation for wrong security code on submit', function () {
  //   var wrongSecurityCode = 1;
  //   var validCreditCard = '4222222222222';
  //   creditCardPage.navigate();
  //   creditCardPage.fillCreditCard(validCreditCard);
  //   creditCardPage.fillExpiration(12, new Date().getFullYear() + 1);
  //   creditCardPage.fillSecurityCode(wrongSecurityCode);
  //   creditCardPage.submitForm();
  //   expect(creditCardPage.getSecurityCode().getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
  // });

  //----tooltip----
  //TODO: Put this back!
  // it('should show tooltip when hovering security code hint', function () {
  //   creditCardPage.navigate();
  //   creditCardPage.hoverSecurityCode();
  //   expect(creditCardPage.getSecurityCodeTooltip().isDisplayed()).toBeTruthy();
  // });

  //----credit card----
  it('should fail validation for wrong credit card on submit', function () {
    var wrongCreditCard = 4222222222223;
    creditCardPage.navigate();
    creditCardPage.fillCreditCard(wrongCreditCard);
    creditCardPage.submitForm();
    expect(creditCardPage.getCreditCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for wrong credit card on blur', function () {
    var wrongCreditCard = 4222222222223;
    creditCardPage.navigate();
    creditCardPage.fillCreditCard(wrongCreditCard);
    creditCardPage.fillSecurityCode(123);
    expect(creditCardPage.getCreditCardError().isDisplayed()).toBeTruthy();
  });

  //TODO: Put this back!
  // it('should focus on fail validation for wrong credit card on submit', function () {
  //   var wrongCreditCard = 4222222222223;
  //   creditCardPage.navigate();
  //   creditCardPage.fillCreditCard(wrongCreditCard);
  //   creditCardPage.submitForm();
  //   expect(creditCardPage.getCreditCardInput().getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
  // });

  it('should show input label when filling credit card', function () {
    var creditCard = 4222222222222;
    creditCardPage.navigate();
    creditCardPage.fillCreditCard(creditCard);
    expect(creditCardPage.getCreditCardLabel().isDisplayed()).toBeTruthy();
  });

  it('should not show input label when filling credit card', function () {
    var creditCard = 42222222;
    creditCardPage.navigate();
    creditCardPage.fillCreditCard(creditCard);
    expect(creditCardPage.getCreditCardError().isDisplayed()).toBeFalsy();
  });

  it('should show input label when entering cc number which have no chance to be valid', function () {
    var creditCard = '1234x';
    creditCardPage.navigate();
    creditCardPage.fillCreditCard(creditCard);
    expect(creditCardPage.getCreditCardError().isDisplayed()).toBeTruthy();
  });

  it('should show input label for wrong credit card on blur', function () {
    var wrongCreditCard = 4222222222223;
    creditCardPage.navigate();
    creditCardPage.fillCreditCard(wrongCreditCard);
    creditCardPage.fillSecurityCode(123);
    expect(creditCardPage.getCreditCardLabel().isDisplayed()).toBeTruthy();
  });

  it('should show input label for wrong credit card on submit', function () {
    var wrongCreditCard = 4222222222223;
    creditCardPage.navigate();
    creditCardPage.fillCreditCard(wrongCreditCard);
    creditCardPage.submitForm();
    expect(creditCardPage.getCreditCardLabel().isDisplayed()).toBeTruthy();
  });

  //----general validation----
  it('should fail validation for empty credit card on submit', function () {
    creditCardPage.navigate();
    creditCardPage.submitForm();
    expect(creditCardPage.getCreditCardError().isDisplayed()).toBeTruthy();
  });

  it('should not fail validation for first loaded page', function () {
    creditCardPage.navigate();
    expect(creditCardPage.getCreditCardError().isDisplayed()).toBeFalsy();
    expect(creditCardPage.getNameOnCardError().isDisplayed()).toBeFalsy();
    expect(creditCardPage.getExpirationDateError().isDisplayed()).toBeFalsy();
    expect(creditCardPage.getSecurityCardError().isDisplayed()).toBeFalsy();
  });

  it('should not to have submit error message for first loaded page', function () {
    creditCardPage.navigate();
    expect(creditCardPage.getSubmitErrorMessage().isDisplayed()).toBeFalsy();
  });

  it('should show general error message when submit_order fails - wrong security code', function () {
    creditCardPage.navigate();
    fillInvalidSecurityCodeForm();
    creditCardPage.submitForm();
    expect(creditCardPage.getSubmitErrorMessage().isDisplayed()).toBeTruthy();
  });

  it('should not show general error message when submit_order success - wrong security code', function () {
    creditCardPage.navigate();
    fillValidForm();
    creditCardPage.submitForm();
    expect(creditCardPage.getSubmitErrorMessage().isDisplayed()).toBeFalsy();
  });

  it('should not show general error message when re-submiting order', function () {
    creditCardPage.navigate();
    fillInvalidSecurityCodeForm();
    creditCardPage.submitForm();
    clearForm();
    fillValidForm();
    creditCardPage.submitForm();
    expect(creditCardPage.getSubmitErrorMessage().isDisplayed()).toBeFalsy();
  });

  //----name on card----
  it('should fail validation for no "name on card" on submit', function () {
    creditCardPage.navigate();
    creditCardPage.fillName('');
    creditCardPage.submitForm();
    expect(creditCardPage.getNameOnCardError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for no "name on card" on blur', function () {
    creditCardPage.navigate();
    creditCardPage.fillName('');
    creditCardPage.fillSecurityCode(123);
    expect(creditCardPage.getNameOnCardError().isDisplayed()).toBeTruthy();
  });

  it('should hide name on card label for no "name on card" on submit', function () {
    creditCardPage.navigate();
    creditCardPage.fillName('');
    creditCardPage.submitForm();
    expect(creditCardPage.getNameOnCardLabel().isDisplayed()).toBeFalsy();
  });

  it('should hide name on card label for no "name on card" on blur', function () {
    creditCardPage.navigate();
    creditCardPage.fillName('');
    creditCardPage.fillSecurityCode(123);
    expect(creditCardPage.getNameOnCardLabel().isDisplayed()).toBeFalsy();
  });


  //TODO: Put this back!
  // it('should focus on fail validation for no "name on card" on submit', function () {
  //   var validSecurityCode = 123;
  //   var validCreditCard = '4222222222222';
  //   creditCardPage.navigate();
  //   creditCardPage.fillCreditCard(validCreditCard);
  //   creditCardPage.fillExpiration(12, new Date().getFullYear() + 1);
  //   creditCardPage.fillSecurityCode(validSecurityCode);
  //   creditCardPage.fillName('');
  //   creditCardPage.submitForm();
  //   browser.pause();
  //   expect(creditCardPage.getName().getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
  // });

  //--expiration date----
  //TODO: Put this back!!
  // it('should fail validation for empty expiration date on submit', function () {
  //   creditCardPage.navigate();
  //   creditCardPage.submitForm();
  //   expect(creditCardPage.getExpirationDateError().isDisplayed()).toBeTruthy();
  // });

  it('should fail validation for past expiration date on submit', function () {
    freezeTime(2015, 5, 5);
    creditCardPage.navigate();
    creditCardPage.fillExpiration(1, 15);
    creditCardPage.submitForm();
    expect(creditCardPage.getExpirationDateError().isDisplayed()).toBeTruthy();
  });

  it('should fail validation for past expiration date on blur', function () {
    freezeTime(2015, 5, 5);
    creditCardPage.navigate();
    creditCardPage.fillExpiration(1, 15);
    creditCardPage.fillSecurityCode(123);
    expect(creditCardPage.getExpirationDateError().isDisplayed()).toBeTruthy();
  });

  it('should focus on expiration month, when credit card is valid, expiration date is invalid, and form submitted', function () {
    freezeTime(2015, 5, 5);
    var creditCard = 4222222222222;

    creditCardPage.navigate();
    creditCardPage.fillCreditCard(creditCard);
    creditCardPage.fillExpiration(1, 15);
    creditCardPage.submitForm();

    expect(creditCardPage.getExpirationMonth().getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
  });

  it('should focus on expiration month, when credit card is valid, expiration date is empty, and form submitted', function () {
    freezeTime(2015, 5, 5);
    var creditCard = 4222222222222;

    creditCardPage.navigate();
    creditCardPage.fillCreditCard(creditCard);
    creditCardPage.submitForm();

    expect(creditCardPage.getExpirationMonth().getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
  });

  it('should not be able to put more than two letters for expiration date month', function () {
    freezeTime(2015, 5, 5);
    creditCardPage.navigate();
    creditCardPage.fillExpiration(111, 16);
    creditCardPage.fillSecurityCode(123);
    expect(creditCardPage.getExpirationMonth().getAttribute('value')).toEqual('11');
  });

  it('should not be able to put more than two letters for expiration date year', function () {
    freezeTime(2015, 5, 5);
    creditCardPage.navigate();
    creditCardPage.fillExpiration(11, 2016);
    creditCardPage.fillSecurityCode(123);
    expect(creditCardPage.getExpirationYear().getAttribute('value')).toEqual('20');
  });

  it('should add credit-card type class', function () {
    var validVisaCreditCard = '4222222222222';
    creditCardPage.navigate();
    creditCardPage.fillCreditCard(validVisaCreditCard);
    creditCardPage.fillExpiration(12, new Date().getFullYear() + 1);
    expect(creditCardPage.getCreditCardContainer().getAttribute('class')).toMatch('visa');
  });

  it('should show "terms and conditions" checkbox if "isTermsDefined" flag is set to true', function () {
    creditCardPage.navigate(getUrlParamsWithTermsAndConditions(true));
    expect(creditCardPage.getTermsAndConditions().isPresent()).toBeTruthy();
  });

  it('should not show "terms and conditions" checkbox if "isTermsDefined" flag is set to false', function () {
    creditCardPage.navigate(getUrlParamsWithTermsAndConditions(false));
    expect(creditCardPage.getTermsAndConditions().isPresent()).toBeFalsy();
  });

  // it('should disable submit button if "terms and conditions" checkbox is not checked', function () {
  //   creditCardPage.navigate(getUrlParamsWithTermsAndConditions(true));
  //   creditCardPage.getTermsAndConditionsCB().click();
  //   expect(creditCardPage.getSubmitButton().isEnabled()).toBe(false);
  // });


  it('should enable submit button if "isTermsDefined" flag is set to false', function () {
    creditCardPage.navigate(getUrlParamsWithTermsAndConditions(false));
    expect(creditCardPage.getSubmitButton().isEnabled()).toBe(true);
  });

  it('should enable submit button if "terms and conditions" checkbox is checked', function () {
    creditCardPage.navigate(getUrlParamsWithTermsAndConditions(true));

    expect(creditCardPage.getSubmitButton().isEnabled()).toBe(true);
  });

  it('should enable submit button if "isTermsDefined" flag is undefined', function () {
    creditCardPage.navigate();
    expect(creditCardPage.getSubmitButton().isEnabled()).toBe(true);
  });

  it('should check terms and conditions by default', function () {
    creditCardPage.navigate(getUrlParamsWithTermsAndConditions(true));
    expect(creditCardPage.getTermsAndConditionsCB().isSelected()).toBeTruthy();
  });

  it('should focus on year input when month input is full', function () {
    creditCardPage.navigate();
    creditCardPage.fillExpirationMonth(3);
    expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe(creditCardPage.getExpirationYear().getAttribute('id'));
  });

  //---- UI -----
  it('should hide the placeholder when input is empty and in focus', function () {

    // given
    creditCardPage.navigate();
    expect(creditCardPage.getSecurityCode().getAttribute('placeholder')).not.toEqual('');

    // when
    creditCardPage.setFocusOnSecurityCode();

    // then
    expect(creditCardPage.getSecurityCode().getAttribute('placeholder')).toEqual('');
  });

  it('should show input label when input is empty and in focus', function () {

    // given
    creditCardPage.navigate();
    expect(creditCardPage.getSecurityCardLabel().isDisplayed()).toBeFalsy();

    // when
    creditCardPage.setFocusOnSecurityCode();

    // expect
    expect(creditCardPage.getSecurityCardLabel().isDisplayed()).toBeTruthy();
  });
});
