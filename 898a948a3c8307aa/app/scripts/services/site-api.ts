'use strict';

class SiteApi {

  /* @ngInject */
  constructor(private $window, private $document: ng.IDocumentService, private paymentConstants) {
  }

  paymentComplete(paymentResponse: PaymentResponseDTO) {
    var siteMessageDTO = new SiteMessageDTO(this.paymentConstants.paymentStatusMapping[paymentResponse.paymentStatus.value]);
    siteMessageDTO.transactionKey = paymentResponse.transactionKey;
    this.sendMessage(siteMessageDTO);
  }

  isAlive() {
    this.sendMessage(new SiteMessageDTO(this.paymentConstants.isAlive));
  }

  setHeight(height) {
    this.sendMessage(new SiteMessageDTO(this.paymentConstants.setHeight, height));
  }

  startPaymentProcessing() {
    this.sendMessage(new SiteMessageDTO(this.paymentConstants.startPaymentProcessing));
  }

  sendMessage(data: SiteMessageDTO) {
    this.$window.parent.postMessage(data, '*');
  }
}

angular
  .module('paymentAppInternal')
  .service('siteApi', SiteApi);
