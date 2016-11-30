'use strict';

class WixPaymentCreditCardFormDriver extends TurnerComponentDriver {

  _creditCardService: CreditCard;
  _paymentConstants;
  ServerPaymentStatusConstants: ServerPaymentStatusConstants;

  constructor() {
    super();

    inject((creditCard: CreditCard, paymentConstants, _ServerPaymentStatusConstants_: ServerPaymentStatusConstants) => {
      this._creditCardService = creditCard;
      this._paymentConstants = paymentConstants;
      this.ServerPaymentStatusConstants = _ServerPaymentStatusConstants_;
    });
  }

  renderCCPage(config: ICashierPaymentsConfiguration) {
    this.renderFromTemplate('<wix-payment-credit-card configurations="config"></wix-payment-credit-card>', {config});
  }

  render() {
    this.renderFromTemplate('<wix-payment-credit-card-form></wix-payment-credit-card-form>');
  }

  getCreditCardField(): ng.IAugmentedJQuery {
    return this.findByDataHook('payment-iframe-card-number');
  }

  getExpirationYear(): ng.IAugmentedJQuery {
    return this.findByDataHook('expiration-year');
  }

  getExpirationMonth(): ng.IAugmentedJQuery {
    return this.findByDataHook('expiration-month');
  }

  getSecurityCode(): ng.IAugmentedJQuery {
    return this.findByDataHook('payment-iframe-security-number');
  }

  getNameOnCard(): ng.IAugmentedJQuery {
    return this.findByDataHook('payment-iframe-card-holder-name');
  }

  getSubmitButton(): ng.IAugmentedJQuery {
    return this.findByDataHook('payment-iframe-submit');
  }

  getSubmitErrorMessage(): ng.IAugmentedJQuery {
    return this.findByDataHook('submit-error-message');
  }

  getTermsAndConditionsWraper(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-creditCard-terms-and-conditions');
  }

  fillCardNumber(number: string): void {
    this.getCreditCardField().val(number).change();
  }

  fillSecurityCode(number: string): void {
    this.getSecurityCode().val(number).change();
  }

  fillValidForm(): void {
    this.getCreditCardField().val('' + this.getValidForm().creditCard).change();
    this.getExpirationYear().val('' + this.getValidForm().expirationYear).change();
    this.getExpirationMonth().val('' + this.getValidForm().expirationMonth).change();
    this.getSecurityCode().val(this.getValidForm().securityCode).change();
    this.getNameOnCard().val(this.getValidForm().nameOnCard).change();
  }

  getValidForm() {
    return {
      creditCard: '4222222222222',
      expirationMonth: 12,
      expirationYear: 30,
      securityCode: '123',
      nameOnCard: 'My name is XXX'
    };
  }

  getValidFormPaymentDto(): PaymentDTO {
    return new PaymentDTO('1234', this.getValidForm().creditCard, this.getValidForm().expirationMonth, this.getValidForm().expirationYear, this.getValidForm().securityCode, this.getValidForm().nameOnCard);
  }

  submitForm() {
    this.getSubmitButton().click();
  }

  getSuccessResponseNoEncApi(): PaymentResponseDTO {
    return this.getSuccessResponseMock(false);
  }

  getSuccessResponseMock(useApiWithEnc: boolean = true): PaymentResponseDTO {

    let response: PaymentResponseDTO = {
      paymentStatus: {
        enumClass: 'com.wixpress.payment.domain.PaymentStatus',
        value: this.ServerPaymentStatusConstants.APPROVED
      },
      transactionKey: 'abc123'
    };

    if (useApiWithEnc) {
      response.enc = 'this_is_encrypted_string';
    }

    return response;
  }

  _getFailedResponseMock(value: string, useApiWithEnc: boolean = true): PaymentResponseDTO {

    let response: PaymentResponseDTO = {
      paymentStatus: {
        enumClass: 'com.wixpress.payment.domain.PaymentStatus',
        value: value
      },
      transactionKey: '360aacbe-b5e9-4648-8c70-1db97643a074'
    };

    if (useApiWithEnc) {
      response.enc = '40286381186467d02a972fe2d23a7fa59f3e443b84aa6824eaaf3d3533b6243970d4a15f5164f35eda54d03b6244215a';
    }

    return response;
  }

  getGatewayFailureResponseMock(useApiWithEnc: boolean = true): PaymentResponseDTO {

    return this._getFailedResponseMock(this.ServerPaymentStatusConstants.GATEWAY_FAILURE, useApiWithEnc);
  }

  getDeclinedResponseMock(useApiWithEnc: boolean = true): PaymentResponseDTO {

    return this._getFailedResponseMock(this.ServerPaymentStatusConstants.DECLINED, useApiWithEnc);
  }

  getFailureResponseMock(useApiWithEnc: boolean = true): PaymentResponseDTO {

    return this._getFailedResponseMock(this.ServerPaymentStatusConstants.FAILURE, useApiWithEnc);
  }

  getSavedCreditCardDataWithFourDigitYear() {
    let cc = this.getSaveCreditCardDataObject();
    cc.expirationYear = 2000 + cc.expirationYear;
    return cc;
  }

  getSaveCreditCardDataObject() {
    return this._getSaveCreditCardDataObjectWithEncryptedValue(this.getSuccessResponseMock().enc);
  }

  getSavedCreditCardDataWithNullEncryptedValueObject() {
    return this._getSaveCreditCardDataObjectWithEncryptedValue(null);
  }

  getSavedCreditCardDataWithEmptyEncryptedValueObject() {
    return this._getSaveCreditCardDataObjectWithEncryptedValue('');
  }

  _getSaveCreditCardDataObjectWithEncryptedValue(encryptedCcValue: string) {
    let cc = <any> this.getSavedCreditCardDataWithUndefinedCcNumberObject();
    cc.encriptedCardNumber = encryptedCcValue;
    return cc;
  }

  getSavedCreditCardDataWithUndefinedCcNumberObject() {
    return {
      expirationMonth: this.getValidFormPaymentDto().month,
      expirationYear: this.getValidFormPaymentDto().year,
      nameOnCard: this.getValidFormPaymentDto().nameOnCard
    };
  }

  setSaveCreditCardFeatureToggle(flag: boolean = false): void {
    spyOn(this._creditCardService, 'getSaveCreditCardFeatureToggle').and.returnValue(flag);
  }

  maskCreditCard(creditCard): string {
    return `**** **** **** ${creditCard.substring((creditCard.length - 5), 4)}`;
  }

  getFailedPaymentBiDTO(config: ICashierPaymentsConfiguration): BiDTO {
    let biDTO: BiDTO = new BiDTO(config);
    biDTO.transactionStatus = this.getGatewayFailureResponseMock().paymentStatus.value;
    biDTO.evid = this._paymentConstants.bi.biEvents.SUBMIT_ORDER_END.evid;
    return biDTO;
  }

  hoverOnSecurityCodeQuestionMark(): void {
    this.getSecurityCodeQuestionMark().triggerHandler('mouseover');
  }

  getSecurityCodeQuestionMark(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-security-tooltip-wrapper');
  }

  getSecurityCodeTooltipMessage(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-security-tooltip-message');
  }
}
