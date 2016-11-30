'use strict';

class WixPaymentYandexService {

  /* @ngInject */
  constructor(private $window: ng.IWindowService, private $interpolate: ng.IInterpolateService, private yandexExpressCheckoutAPIUrl: string, private CashierPaymentMethodConstants: CashierPaymentMethodConstants, private biLoggerApi: BiLoggerApi) {
  }

  payWithYandex(configurations: ICashierPaymentsConfiguration) {

    let biDTO = new BiDTO(configurations);
    biDTO.paymentProvider = this.CashierPaymentMethodConstants.YANDEX;
    biDTO.status = true;
    this.biLoggerApi.submitOrderRequest(biDTO);

    this.navigateToYandexExpressCheckout(configurations.orderId);
  }

  navigateToYandexExpressCheckout(orderId: string) {

    const path = this.$interpolate(this.yandexExpressCheckoutAPIUrl)({
      orderId: orderId,
      paymentMethod: this.CashierPaymentMethodConstants.YANDEX
    });
    const fullUrl = `${this.$window.location.protocol}//${this.$window.location.hostname}${path}`;
    this.$window.location.href = fullUrl;
  }
}

angular
  .module('wixPaymentYandex')
  .constant('yandexExpressCheckoutAPIUrl', '/_api/payment-services-web/wallet/start?orderId={{orderId}}&paymentMethod={{paymentMethod}}')
  .service('wixPaymentYandexService', WixPaymentYandexService);
