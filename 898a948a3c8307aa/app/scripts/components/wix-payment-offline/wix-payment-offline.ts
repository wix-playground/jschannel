'use strict';

class WixPaymentOffline {
  configurations: ICashierPaymentsConfiguration;
  offlineVM: OfflineVM;
  onPaymentStart: () => void;
  onPaymentSuccess: () => void;
  onPaymentError: () => void;

  /* @ngInject */
  constructor(private CashierPaymentMethodConstants: CashierPaymentMethodConstants, private biLoggerApi: BiLoggerApi, private paymentsApi: PaymentsApi) {
    //
  }

  onPayOfflineClicked() {
    this.triggerSubmitOfflineBiEvent();
    this.onPaymentStart();
    this.paymentsApi.payOffline(this.configurations.orderId)
        .then(() => {
          this.onPaymentSuccess();
        })
        .catch(() => {
          this.onPaymentError();
        });
  }

  triggerSubmitOfflineBiEvent() {
    let biDTO = new BiDTO(this.configurations);
    biDTO.paymentProvider = this.CashierPaymentMethodConstants.OFFLINE;
    biDTO.status = true;
    this.biLoggerApi.submitOrderRequest(biDTO);
  }
}

angular
  .module('wixPaymentOffline', ['wixConditionalPaymentButton', 'wixPaymentSettingsApi', 'paymentTranslations', 'paymentAppConstants', 'paymentAppBi'])
  .directive('wixPaymentOffline', () => {
    return {
      template: `
        <div class="wix-payment-offline wallet-wrap">
          <p class="wix-payment-offline-text wallet-text" data-hook="offline-instructions-text" ng-bind-html="::wixPaymentOffline.offlineVM.instructionsHtml"></p>
          <wix-conditional-payment-button ng-if="!wixPaymentOffline.configurations.hideOfflinePaymentButton" use-terms-and-conditions="::wixPaymentOffline.configurations.useTermsAndConditions" payment-method="::wixPaymentOffline.CashierPaymentMethodConstants.OFFLINE" on-pay-clicked="wixPaymentOffline.onPayOfflineClicked()" button-label-text="::'payment.offline_submit'" classes="::'offline-btn wallet-btn wix-payment-button-primary wcsh-next-button payment-svg-font-icons-lock'"></wix-conditional-payment-button>
        </div>
      `,
      controller: WixPaymentOffline,
      controllerAs: 'wixPaymentOffline',
      bindToController: true,
      scope: {
        configurations: '=',
        onPaymentStart: '&',
        onPaymentSuccess: '&',
        onPaymentError: '&',
        offlineVM: '=offlineData'
      },
      restrict: 'E'
    };
  });
