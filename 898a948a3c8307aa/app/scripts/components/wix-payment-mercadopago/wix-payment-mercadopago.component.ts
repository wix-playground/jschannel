'use strict';

class WixPaymentMercadopago {
  configurations: ICashierPaymentsConfiguration;

  /* @ngInject */
  constructor(private wixPaymentMercadopagoService: WixPaymentMercadopagoService, private CashierPaymentMethodConstants: CashierPaymentMethodConstants) {
    //
  }

  onPayWithMercadopagoClicked() {
    this.wixPaymentMercadopagoService.payWithMercadopago(this.configurations);
  }
}

angular
  .module('wixPaymentMercadopago', ['wixConditionalPaymentButton', 'paymentTranslations', 'paymentAppConstants', 'paymentAppBi'])
  .directive('wixPaymentMercadopago', () => {
    return {
      template: `
        <div class="wix-payment-mercadopago wallet-wrap">
          <a class="wix-payment-mercadopago-logo">
          </a>
          <p class="wix-payment-mercadopago-text wallet-text">{{::'payment.mercadopago_description' | translate}}</p>
          <wix-conditional-payment-button use-terms-and-conditions="::wixPaymentMercadopago.configurations.useTermsAndConditions" payment-method="::wixPaymentMercadopago.CashierPaymentMethodConstants.MERCADO_PAGO" on-pay-clicked="wixPaymentMercadopago.onPayWithMercadopagoClicked()" button-label-text="::'payment.mercadoPago_submit'" classes="::'mercadopago-btn wallet-btn wix-payment-button-primary wcsh-next-button payment-svg-font-icons-lock'"></wix-conditional-payment-button>
        </div>
      `,
      controller: WixPaymentMercadopago,
      controllerAs: 'wixPaymentMercadopago',
      scope: {
        configurations: '='
      },
      bindToController: true,
      restrict: 'E'
    };
  });
