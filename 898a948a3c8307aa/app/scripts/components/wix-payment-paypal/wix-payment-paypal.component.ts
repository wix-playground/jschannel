'use strict';

class WixPaymentPaypal {
  configurations: ICashierPaymentsConfiguration;

  /* @ngInject */
  constructor(private wixPaymentPaypalService: WixPaymentPaypalService, private CashierPaymentMethodConstants: CashierPaymentMethodConstants) {
  }

  onPayButtonClicked() {
    this.wixPaymentPaypalService.payWithPaypal(this.configurations);
  }
}

angular
  .module('wixPaymentPaypal', ['wixConditionalPaymentButton', 'paymentTranslations', 'paymentAppConstants', 'paymentAppBi'])
  .directive('wixPaymentPaypal', () => {
    return {
      template: `
        <div class="wix-payment-paypal wallet-wrap">
          <a class="wix-payment-pp-logo" title="PayPal logo">
          </a>
          <p class="wix-payment-paypal-text wallet-text">{{::'payment.paypal_description' | translate}}</p>
          <wix-conditional-payment-button use-terms-and-conditions="::wixPaymentPaypal.configurations.useTermsAndConditions" payment-method="::wixPaymentPaypal.CashierPaymentMethodConstants.PAYPAL" on-pay-clicked="wixPaymentPaypal.onPayButtonClicked()" button-label-text="::'payment.paypal_submit'" classes="::'paypal-btn wallet-btn wix-payment-button-primary wcsh-next-button payment-svg-font-icons-lock'"></wix-conditional-payment-button>
        </div>`,
      controller: WixPaymentPaypal,
      controllerAs: 'wixPaymentPaypal',
      scope: {
        configurations: '='
      },
      bindToController: true,
      restrict: 'E'
    };
  });
