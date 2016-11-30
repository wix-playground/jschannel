'use strict';

class WixPaymentYandex {
  configurations: ICashierPaymentsConfiguration;

  /* @ngInject */
  constructor(private wixPaymentYandexService: WixPaymentYandexService, private CashierPaymentMethodConstants: CashierPaymentMethodConstants) {
  }

  onPayButtonClicked() {
    this.wixPaymentYandexService.payWithYandex(this.configurations);
  }
}

angular
  .module('wixPaymentYandex', ['wixConditionalPaymentButton', 'paymentTranslations', 'paymentAppConstants', 'paymentAppBi'])
  .directive('wixPaymentYandex', () => {
    return {
      template: `
        <div class="wix-payment-yandex wallet-wrap">
          <a class="wix-payment-yandex-logo" title="Yandex logo">
          </a>
          <p class="wix-payment-yandex-text wallet-text">{{::'payment.yandex_description' | translate}}</p>
          <wix-conditional-payment-button use-terms-and-conditions="::WixPaymentYandex.configurations.useTermsAndConditions" payment-method="::WixPaymentYandex.CashierPaymentMethodConstants.YANDEX" on-pay-clicked="WixPaymentYandex.onPayButtonClicked()" button-label-text="::'payment.yandex_submit'" classes="::'yandex-btn wallet-btn wix-payment-button-primary wcsh-next-button payment-svg-font-icons-lock'"></wix-conditional-payment-button>
        </div>`,
      controller: WixPaymentYandex,
      controllerAs: 'WixPaymentYandex',
      scope: {
        configurations: '='
      },
      bindToController: true,
      restrict: 'E'
    };
  });
