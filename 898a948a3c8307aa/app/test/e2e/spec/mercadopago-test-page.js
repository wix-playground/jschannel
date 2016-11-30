'use strict';

require('../lib/matchers.protractor.js');
var MercadoPagpPage = require('../pages/mercadopago-page.js');
var experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');

var browserLogs = require('protractor-browser-logs');
var logs;

describe('wixPaymentApp Mercado Pago Page', function () {
  var mercadoPagpPage;

  beforeEach(function () {
    logs = browserLogs(browser);

    logs.ignore(function (message) {
      return message.message.indexOf('') > -1;
    });
  });

  beforeEach(function () {
    mercadoPagpPage = new MercadoPagpPage();

    experimentManager.setExperiments({});
    browser.addMockModule('paymentAppMocks', function () {
    });
  });

  afterEach(function () {
    browser.clearMockModules();
    return logs.verify();
  });

  it('should load successfully', function () {
    mercadoPagpPage.navigate();
  });

  it('should show mercadopago logo', function () {
    expect(mercadoPagpPage.getMercadoPagoLogo().isDisplayed()).toBeTruthy();
  });
});
