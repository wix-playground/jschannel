'use strict';

function MainPage() {
  this.navigate = function (urlParams) {
    if (urlParams) {
      browser.get('/credit-card-page.html#?orderId=' + urlParams.orderSnapshotId + '&visitorId=' + (urlParams.visitorId ? urlParams.visitorId : '') + '&appInstanceId=' + (urlParams.appInstanceId ? urlParams.appInstanceId : '') + '&appDefId=' + (urlParams.appDefId ? urlParams.appDefId : '') + '&isTermsDefined=' + ((typeof urlParams.isTermsDefined !== undefined) ? urlParams.isTermsDefined : ''));
    } else {
      browser.get('/credit-card-page.html');
    }
  };

  this.getTitle = function () {
    return $('h3');
  };

  this.getCreditCardContainer = function () {
    return $('.credit-card-container');
  };

  this.getCreditCardInput = function () {
    return $('#cardNumber');
  };

  this.getCreditCardLabel = function () {
    return $('.form-label[data-hook="card-number-label"]');
  };

  this.fillCreditCard = function (number) {
    $('#cardNumber').sendKeys(number);
  };

  this.clearCreditCard = function () {
    $('#cardNumber').clear();
  };

  this.getExpirationMonth = function () {
    return $('.expiration-month');
  };

  this.getExpirationYear = function () {
    return $('.expiration-year');
  };

  this.fillExpiration = function (month, year) {
    this.fillExpirationMonth(month);
    $('.expiration-year').sendKeys(year);
  };

  this.fillExpirationMonth = function (month) {
    $('[data-hook="expiration-date-default"]').click();
    $('.expiration-month').sendKeys(month);
  };

  this.clearExpirationDate = function () {
    $('.expiration-month').clear();
    $('.expiration-year').clear();
  };

  this.getExpirationDateLabel = function () {
    return $('.expiration-label');
  };

  this.getSecurityCode = function () {
    return $('#securityNumber');
  };

  this.getSecurityCardLabel = function () {
    return $('.security-label');
  };

  this.fillSecurityCode = function (code) {
    $('#securityNumber').sendKeys(code);
  };

  this.clearSecurityCode = function () {
    $('#securityNumber').clear();
  };

  this.setFocusOnSecurityCode = function () {
    this.getSecurityCode().click();
  };

  this.fillName = function (name) {
    $('#cardHolderName').sendKeys(name);
  };

  this.getName = function () {
    return $('#cardHolderName');
  };

  this.getNameOnCardLabel = function () {
    return $('.name-on-card-label');
  };

  this.clearName = function () {
    $('#cardHolderName').clear();
  };

  this.submitForm = function () {
    $('#submit-button').click();
  };

  this.getSubmitButton = function () {
    return $('#submit-button');
  };

  this.getSecurityCardError = function () {
    return $('.wix-payment-invalid-form-input-label[data-hook="invalid-security-code"]');
  };

  this.hoverSecurityCode = function () {
    browser.actions().mouseMove($('.security-hint')).perform();
  };

  this.getSecurityCodeTooltip = function () {
    return $('.security-code-tooltip');
  };

  this.getCreditCardError = function () {
    return $('.wix-payment-invalid-form-input-label[data-hook="invalid-card-number"]');
  };

  this.getNameOnCardError = function () {
    return $('.wix-payment-invalid-form-input-label[data-hook="invalid-name-on-card"]');
  };

  this.getExpirationDateError = function () {
    return $('.wix-payment-invalid-form-input-label[data-hook="invalid-expiration-date"]');
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

  this.getExpirationDateErrorLabelHeight = function () {
    return this.getExpirationDateError().getCssValue('height');
  };

  this.getSecurityCardErrorLabelHeight = function () {
    return this.getSecurityCardError().getCssValue('height');
  };
}

module.exports = MainPage;
