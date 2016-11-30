'use strict';

class PaymentController {
  creditCardNumber: string;
  expirationDate;
  securityNumber: string;
  holderName: string;
  submittingForm: boolean = false;
  paymentForm;
  submitError: boolean;
  staticsBaseUrl: string;
  /* @ngInject */
  constructor(private $location: ng.ILocationService,
              private siteApi: SiteApi,
              private paymentsApi: PaymentsApi,
              private biLoggerApi: BiLoggerApi,
              private BiConstants: BiConstants,
              private CashierPaymentMethodConstants: CashierPaymentMethodConstants,
              wixAngularTopology) {
    this.siteApi.isAlive();

    var biDTO = this._createBiDTO();
    biDTO.source = this._getBiSource();
    biDTO.paymentCategory = this.CashierPaymentMethodConstants.CREDIT_CARD;
    biLoggerApi.paymentPageLoaded(biDTO);
    this.staticsBaseUrl = wixAngularTopology.staticsUrl;
  }

  submitForm() {

    this.submittingForm = true;
    this.siteApi.startPaymentProcessing();
    let paymentDto = new PaymentDTO(this._getOrderId(), this.creditCardNumber, this.expirationDate.month, this.expirationDate.year, this.securityNumber, this.holderName);

    this.paymentsApi.submitOrder(paymentDto).then((response: PaymentResponseDTO) => {
      this._handleResponse(response);
    }).catch((response) => {
      this._handleResponse(response);
      this._handleError();
    });
  }

  cardError() {
    this.biLoggerApi.cardError(this._createBiDTO());
  }

  securityHover() {
    this.biLoggerApi.securityHover(this._createBiDTO());
  }

  sizeChanged(height) {
    this.siteApi.setHeight(height);
  }

  _handleResponse(response: PaymentResponseDTO) {
    this.siteApi.paymentComplete(response);
    let biDTO: BiDTO = this._createBiDTO();
    biDTO.transactionStatus = response.paymentStatus.value;
    this.biLoggerApi.submitOrderResponse(biDTO);
  }

  _createBiDTO() {
    let config: ICashierPaymentsConfiguration = {
      appDefId: this._getAppDefId(),
      appInstanceId: this._getAppInstanceId(),
      visitorId: this._getVisitorId(),
      orderId: this._getOrderId()
    };
    return new BiDTO(config);
  }

  _handleError() {
    this.submittingForm = false;
    this.submitError = true;
  }

  _getOrderId(): string {
    return this.$location.search().orderId;
  }

  _getVisitorId(): string {
    return this.$location.search().visitorId;
  }

  _getAppInstanceId(): string {
    return this.$location.search().appInstanceId;
  }

  _getAppDefId(): string {
    return this.$location.search().appDefId;
  }

  _getBiSource(): string {
    return this.$location.search().biSource || this.BiConstants.Source.IFRAME_ONLY_INTEGRATION;
  }

  _getTermsAndConditionsFlag(): boolean {
    return (this.$location.search().isTermsDefined === 'true');
  }
}

angular
  .module('paymentAppInternal')
  .controller('PaymentController', PaymentController);
