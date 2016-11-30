'use strict';

class WixPaymentCreditCardForm {
  creditCardNumber: string;
  expirationDate: {month: number, year: number};
  securityNumber: string;
  holderName: string;
  submittingForm: boolean = false;
  paymentForm;
  submitError: boolean;
  staticsBaseUrl: string;
  isOffsetsInitialized: boolean;

  /* @ngInject */
  constructor(private $scope: ng.IScope,
              private $location: ng.ILocationService,
              private siteApi: SiteApi,
              private paymentsApi: PaymentsApi,
              private biLoggerApi: BiLoggerApi, wixAngularTopology,
              private creditCard: CreditCard,
              private $window: ng.IWindowService,
              private clientFailureResponse: PaymentResponseDTO,
              private $timeout: ng.ITimeoutService,
              private domEventHelper: DomEventHelper,
              private CashierPaymentMethodConstants: CashierPaymentMethodConstants,
              private BiConstants: BiConstants) {

    $window.addEventListener('message', this._handleMessages.bind(this));

    $scope.$on('$destroy', () => {
      this.$window.removeEventListener('message', this._handleMessages);
    });

    this.siteApi.isAlive(); //todo: remove

    this.staticsBaseUrl = wixAngularTopology.staticsUrl; // todo: remove
    this._loadCreditCard();

    var biDTO = this._createBiDTO();
    biDTO.source = this._getBiPaymentPageSource();
    biDTO.paymentCategory = this.CashierPaymentMethodConstants.CREDIT_CARD;
    biLoggerApi.paymentPageLoaded(biDTO);
  }

  onButtonMouseDown(event) {
    // As explained in the following link, when invalid focused input is blurred, the ng-submit isn't triggered.
    // the problem occurs due to the movement of the button and the order of event actions, please read for detailed info:
    // http://stackoverflow.com/questions/21084932/angularjs-directives-ng-click-is-not-triggered-after-blur
    this.$timeout(() => {
      event.target.focus();
      event.target.click();
    });
    return this.domEventHelper.cancelEvent(event);
  }

  submitForm() {
    let paymentDto = new PaymentDTO(this._getOrderId(), this.creditCardNumber, this.expirationDate.month, this.expirationDate.year, this.securityNumber, this.holderName);
    this._submit(paymentDto);
  }

  securityHover() {
    this.biLoggerApi.securityHover(this._createBiDTO());
  }

  cardError() {
    this.biLoggerApi.cardError(this._createBiDTO());
  }

  sizeChanged(height) {
    this.siteApi.setHeight(height);
  }

  _submit(paymentDto: PaymentDTO) {

    if (!this.isAllowedToSubmitForm()) {
      return;
    }

    this.submittingForm = true;
    this.siteApi.startPaymentProcessing();

    let biDTO: BiDTO = this._createBiDTO();
    biDTO.status = true;
    biDTO.paymentProvider = this.CashierPaymentMethodConstants.CREDIT_CARD;
    biDTO.paymentMethodType = this.creditCard.getType(paymentDto.ccnumber);
    this.biLoggerApi.submitOrderRequest(biDTO);

    this.paymentsApi.pay(paymentDto).then((response: PaymentResponseDTO) => {
      this._handleResponse(response);
      this._handleSuccess(response, paymentDto);
    }).catch((response: PaymentResponseDTO) => {
      this._handleResponse(response);
      this._handleError();
    });
  }

  private isAllowedToSubmitForm() {

    if (this.submittingForm) {
      // This scenario is possible when external submit button was clicked twice in a row (for example..)
      return false;
    }

    return true;
  }

  _handleMessages(event: any) {
    if (event.data.eventType === 'submitPayment') {
      if (this.paymentForm.$invalid) {
        this.siteApi.paymentComplete(this.clientFailureResponse);
        return;
      }

      let paymentDto = new PaymentDTO(event.data.orderId, this.creditCardNumber, this.expirationDate.month, this.expirationDate.year, this.securityNumber, this.holderName);

      this._submit(paymentDto);
    }
  }

  _handleResponse(response: PaymentResponseDTO) {
    this.siteApi.paymentComplete(response);
    let biDTO: BiDTO = this._createBiDTO();
    biDTO.transactionStatus = response.paymentStatus.value;
    this.biLoggerApi.submitOrderResponse(biDTO);
  }

  _handleSuccess(responseData, paymentDto: PaymentDTO) {
    this.creditCard.save(responseData, paymentDto);
  }

  _loadCreditCard() {
    this.creditCard.load((response) => {

      this.submittingForm = true;
      this.siteApi.startPaymentProcessing();
      let paymentDto = new PaymentDTO(this._getOrderId(), response.encriptedCardNumber, response.expirationMonth, response.expirationYear, null, response.nameOnCard);

      this.paymentsApi.pay(paymentDto, true).then((response) => {
        this._handleResponse(response);
      }).catch((response: PaymentResponseDTO) => {
        this._handleResponse(response);
        this._handleError();
      });
    });
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

  _getBiPaymentPageSource(): string {
    return this.$location.search().biPaymentPageSource || this.BiConstants.Source.IFRAME_ONLY_INTEGRATION;
  }

  _getTermsAndConditionsFlag(): boolean {
    return (this.$location.search().isTermsDefined === 'true');
  }

  _getExternalSubmitButtonFlag(): boolean {
    return (this.$location.search().externalSubmitButton === 'true');
  }
}

angular
  .module('paymentAppInternal')
  .directive('wixPaymentCreditCardForm', () => {
    return {
      templateUrl: 'views/wix-payment-credit-card-form.preload.html',
      controller: WixPaymentCreditCardForm,
      controllerAs: 'wixPaymentCreditCardForm',
      bindToController: true,
      restrict: 'E'
    };
  }).value('clientFailureResponse', {
  'paymentStatus': {
    'enumClass': 'com.wixpress.payment.domain.PaymentStatus',
    'value': 'clientFailure'
  }
});
