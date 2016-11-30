'use strict';

require('../lib/matchers.protractor.js');
var MainPage = require('../pages/main-page.js');
var TestPage = require('../pages/test-page.js');
var experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');

var browserLogs = require('protractor-browser-logs');
var logs;

describe('wixPaymentApp Main Page', function () {
  var mainPage, testPage;

  function switchToPaymentFrame() {
    browser.switchTo().frame('payment');
  }

  function switchToTestFrame() {
    browser.switchTo().defaultContent();
  }

  function fillValidForm() {
    mainPage.fillCreditCard('4222222222222');
    mainPage.fillExpiration(11, 2017);
    mainPage.fillSecurityCode(900);
    mainPage.fillName('John Doe');
  }

  function fillInvalidCreditCardForm() {
    mainPage.fillCreditCard('4222222222223');
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
      appInstanceId: 'aaaa'
    };
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

  it('should report "isAlive" and "setHeight" when loaded', function () {
    var urlParams = getUrlParams();
    testPage.navigate(urlParams);
    expect(testPage.getResponsesLabel().get(0).getText()).toBe('isAlive');
    //expect(testPage.getResponsesLabel().get(1).getText()).toBe('setHeight');
  });

  it('should open form as an iframe and submit successfully', function () {
    var urlParams = getUrlParams();
    testPage.navigate(urlParams);
    switchToPaymentFrame();
    fillValidForm();
    mainPage.submitForm();
    switchToTestFrame();
    expect(testPage.getResponsesLabel().get(0).getText()).toBe('isAlive');
    //expect(testPage.getResponsesLabel().get(1).getText()).toBe('setHeight'); //TODO: test height
    expect(testPage.getResponsesLabel().get(1).getText()).toBe('startPaymentProcessing');
    expect(testPage.getResponsesLabel().get(2).getText()).toBe('paymentComplete');
    expect(testPage.getResponsesLabel().count()).toBe(3);
  });

  it('should not submit valid form twice', function () {
    var urlParams = getUrlParams();
    testPage.navigate(urlParams);
    switchToPaymentFrame();
    fillValidForm();
    mainPage.submitForm();
    mainPage.submitForm();
    switchToTestFrame();
    expect(testPage.getResponsesLabel().get(0).getText()).toBe('isAlive');
    //expect(testPage.getResponsesLabel().get(1).getText()).toBe('setHeight'); //TODO: test height
    expect(testPage.getResponsesLabel().get(1).getText()).toBe('startPaymentProcessing');
    expect(testPage.getResponsesLabel().get(2).getText()).toBe('paymentComplete');
    expect(testPage.getResponsesLabel().count()).toBe(3);
  });

  it('should open form as an iframe and submit with error - invalid security code', function () {
    var urlParams = getUrlParams();
    testPage.navigate(urlParams);
    switchToPaymentFrame();
    fillInvalidSecurityCodeForm();
    mainPage.submitForm();
    switchToTestFrame();
    expect(testPage.getResponsesLabel().get(0).getText()).toBe('isAlive');
    //expect(testPage.getResponsesLabel().get(1).getText()).toBe('setHeight'); //TODO: test height
    expect(testPage.getResponsesLabel().get(1).getText()).toBe('startPaymentProcessing');
    expect(testPage.getResponsesLabel().get(2).getText()).toBe('paymentError');
    //expect(testPage.getResponsesLabel().get(4).getText()).toBe('setHeight'); //TODO: test height
    expect(testPage.getResponsesLabel().count()).toBe(3);
  });

  it('should submit valid form after failing first', function () {
    var urlParams = getUrlParams();
    testPage.navigate(urlParams);
    switchToPaymentFrame();
    fillInvalidSecurityCodeForm();
    mainPage.submitForm();
    clearForm();
    fillValidForm();
    mainPage.submitForm();
    switchToTestFrame();
    expect(testPage.getResponsesLabel().get(0).getText()).toBe('isAlive');
    //expect(testPage.getResponsesLabel().get(1).getText()).toBe('setHeight'); //TODO: test height
    expect(testPage.getResponsesLabel().get(1).getText()).toBe('startPaymentProcessing');
    expect(testPage.getResponsesLabel().get(2).getText()).toBe('paymentError');
    //expect(testPage.getResponsesLabel().get(4).getText()).toBe('setHeight'); //TODO: test height
    expect(testPage.getResponsesLabel().get(3).getText()).toBe('startPaymentProcessing');
    expect(testPage.getResponsesLabel().get(4).getText()).toBe('paymentComplete');
    expect(testPage.getResponsesLabel().count()).toBe(5);
  });

  it('should open form as an iframe and submit with error - invalid card number', function () {
    var urlParams = getUrlParams();
    testPage.navigate(urlParams);
    switchToPaymentFrame();
    fillInvalidCreditCardForm();
    mainPage.submitForm();
    switchToTestFrame();
    expect(testPage.getResponsesLabel().get(0).getText()).toBe('isAlive');
    //expect(testPage.getResponsesLabel().get(1).getText()).toBe('setHeight'); //TODO: test height
    expect(testPage.getResponsesLabel().count()).toBe(1);
  });
});
