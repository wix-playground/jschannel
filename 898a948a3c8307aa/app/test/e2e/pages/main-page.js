'use strict';

function MainPage() {
  this.navigate = function (urlParams) {
    if (urlParams) {
      browser.get('/#?orderId=' + urlParams.orderSnapshotId + '&visitorId=' + (urlParams.visitorId ? urlParams.visitorId : '') + '&appInstanceId=' + (urlParams.appInstanceId ? urlParams.appInstanceId : '') + '&appDefId=' + (urlParams.appDefId ? urlParams.appDefId : '') + '&isTermsDefined=' + ((typeof urlParams.isTermsDefined !== undefined) ? urlParams.isTermsDefined : ''));
    } else {
      browser.get('/');
    }
  };

  this.getTitle = function () {
    return $('h3');
  };

  this.getCreditCardInput = function () {
    return $('#cardNumber');
  };

  this.fillCreditCard = function (number) {
    $('#cardNumber').sendKeys(number);
  };

  this.clearCreditCard = function () {
    $('#cardNumber').clear();
  };

  this.fillExpiration = function (month, year, freezedYear) {
    var currentYear = freezedYear ? freezedYear : new Date().getFullYear();
    var selectYear = year - currentYear + 1;
    $('#expirationMonth').$$('option').get(month).click();
    $('#expirationYear').$$('option').get(selectYear).click();
  };

  this.clearExpirationDate = function () {
    $('#expirationMonth').clear();
    $('#expirationYear').clear();
  };

  this.getSecurityCode = function () {
    return $('#securityNumber');
  };

  this.fillSecurityCode = function (code) {
    $('#securityNumber').sendKeys(code);
  };

  this.clearSecurityCode = function () {
    $('#securityNumber').clear();
  };

  this.fillName = function (name) {
    $('#cardHolderName').sendKeys(name);
  };

  this.getName = function () {
    return $('#cardHolderName');
  };

  this.clearName = function () {
    $('#cardHolderName').clear();
  };

  this.submitForm = function () {
    $('#submit-button').click();
  };

  this.getSecurityCardError = function () {
    return $('#securityNumberError');
  };

  this.hoverSecurityCode = function () {
    browser.actions().mouseMove($('.security-hint')).perform();
  };

  this.getSecurityCodeTooltip = function () {
    return $('.security-code-tooltip');
  };

  this.getCreditCardError = function () {
    return $('#cardNumberError');
  };

  this.getNameOnCardError = function () {
    return $('#nameOnCardError');
  };

  this.getExpirationDateError = function () {
    return $('#expirationDateError');
  };

  this.getSubmitErrorMessage = function () {
    return $('#generalError');
  };

  this.getPageHeight = function () {
    return $('.container').getCssValue('height');
  };

  this.getLastLine = function () {
    return $('.last-line');
  };

  this.getTermsAndConditions = function () {
    return $('.wix-payment-terms-and-conditions');
  };

  this.getTermsAndConditionsCB = function () {
    return $('.wix-payment-terms-and-conditions-cb');
  };

  this.clickTermsAndConditions = function () {
    $('.wix-payment-terms-and-conditions-cb').click();
  };

  this.getSubmitButton = function () {
    return $('#submit-button');
  };

}

module.exports = MainPage;
