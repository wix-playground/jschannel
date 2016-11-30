'use strict';

class WixPaymentMercadopagoService {

  /* @ngInject */
  constructor(private $window: ng.IWindowService, private $interpolate: ng.IInterpolateService, private mercadopagoCheckoutAPIUrl: string, private CashierPaymentMethodConstants: CashierPaymentMethodConstants, private biLoggerApi: BiLoggerApi) {
  }

  payWithMercadopago(configurations: ICashierPaymentsConfiguration) {

    let biDTO = new BiDTO(configurations);
    biDTO.paymentProvider = this.CashierPaymentMethodConstants.MERCADO_PAGO;
    biDTO.status = true;
    this.biLoggerApi.submitOrderRequest(biDTO);

    //this.navigateToMercadopagoCheckout(configurations.appDefId, configurations.appInstanceId);
    this.navigateToMercadopagoCheckout(configurations.orderId);
  }

  //navigateToMercadopagoCheckout(appDefId: string, appInstanceId: string) {
  //  this.$window.location.assign(this.$interpolate(this.mercadopagoCheckoutAPIUrl)({
  //    appDefId: appDefId,
  //    appInstanceId: appInstanceId
  //  }));
  //}

  navigateToMercadopagoCheckout(orderId: string) {
    const path = this.$interpolate(this.mercadopagoCheckoutAPIUrl)({
      orderId: orderId,
      paymentMethod: this.CashierPaymentMethodConstants.MERCADO_PAGO
    });
    const fullUrl = `${this.$window.location.protocol}//${this.$window.location.hostname}${path}`;
    this.$window.location.href = fullUrl;
  }

}

angular
  .module('wixPaymentMercadopago')
  .constant('mercadopagoCheckoutAPIUrl', '/_api/payment-services-web/wallet/start?orderId={{orderId}}&paymentMethod={{paymentMethod}}')
  .service('wixPaymentMercadopagoService', WixPaymentMercadopagoService);
