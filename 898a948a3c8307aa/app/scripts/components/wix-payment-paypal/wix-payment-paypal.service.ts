'use strict';

class WixPaymentPaypalService {

  /* @ngInject */
  constructor(private $window: ng.IWindowService, private $interpolate: ng.IInterpolateService, private paypalExpressCheckoutAPIUrl: string, private CashierPaymentMethodConstants: CashierPaymentMethodConstants, private biLoggerApi: BiLoggerApi) {
  }

  payWithPaypal(configurations: ICashierPaymentsConfiguration) {

    let biDTO = new BiDTO(configurations);
    biDTO.paymentProvider = this.CashierPaymentMethodConstants.PAYPAL;
    biDTO.status = true;
    this.biLoggerApi.submitOrderRequest(biDTO);
    this.navigateToPaypalExpressCheckout(configurations.orderId);
  }

  navigateToPaypalExpressCheckout(orderId: string) {

    const path = this.$interpolate(this.paypalExpressCheckoutAPIUrl)({
      orderId: orderId,
      paymentMethod: this.CashierPaymentMethodConstants.PAYPAL
    });
    const fullUrl = `${this.$window.location.protocol}//${this.$window.location.hostname}${path}`;
    this.$window.location.href = fullUrl;
  }
}

angular
  .module('wixPaymentPaypal')
  .constant('paypalExpressCheckoutAPIUrl', '/_api/payment-services-web/wallet/start?orderId={{orderId}}&paymentMethod={{paymentMethod}}')
  .service('wixPaymentPaypalService', WixPaymentPaypalService);
