'use strict';

class WixPayment {
  configurations: ICashierPaymentsConfiguration;
  settings: Settings;
  isSelected: boolean = false;
  onPaymentNavigate: Function;
  onPaymentNavigateBack: Function;
  creditCardGatewayId: string;

  /* @ngInject */
  constructor($sce: ng.ISCEService,
              paymentSettingsApi: SettingsApi,
              $translate: any,
              private biLoggerApi: BiLoggerApi,
              private biService: BiService,
              private configurationsService: cashier.services.ConfigurationsService,
              private CashierPaymentMethodConstants: CashierPaymentMethodConstants) {

    configurationsService.configurations = this.configurations;

    biLoggerApi.paymentsComponentLoadStart(this.configurations);
    paymentSettingsApi.getSettings(this.configurations.appDefId, this.configurations.appInstanceId).then((settingsResponse: ISettingsDTO) => {
      this.creditCardGatewayId = this.getCreditCardGatewayId(settingsResponse);
      biService.init(this.configurations, settingsResponse);
      this.settings = new Settings(settingsResponse, $sce, $translate, CashierPaymentMethodConstants);
      biLoggerApi.paymentsComponentLoadCompleteSuccessfully(this.configurations);
    }).catch((e: ng.IHttpPromiseCallbackArg<any> | any) => {
      let errorDescription = '';
      if (e.data) {
        errorDescription = e.data.errorDescription;
      } else if (e.message) {
        errorDescription = e.message;
      }
      biLoggerApi.paymentsComponentLoadFailed(this.configurations, errorDescription);
      throw e;
    });
  }

  getCreditCardGatewayId(settingsResponse: ISettingsDTO): string {
    if (settingsResponse.paymentMethods) {
      let creditCardMethods: IPaymentMethodDTO[] = settingsResponse.paymentMethods.filter((method) => {
        return method.paymentMethod === this.CashierPaymentMethodConstants.CREDIT_CARD;
      });
      if (creditCardMethods.length) {
        return creditCardMethods[0].gatewayId;
      }
    }
    return '';
  }

  useThisPaymentMethod(paymentMethod: string): boolean {
    return ((this.settings.isOnlyOnePaymentMethodExists()) || (this.configurations.payWith === paymentMethod));
  }

  isPaymentMethodVisible(paymentMethod: string): boolean {
    if (!this.settings) {
      return false;
    }
    if (this.configurations.payWith) {
      return this.configurations.payWith === paymentMethod;
    }
    return this.settings.isPaymentMethodVisible(paymentMethod);
  }

  isPayWithMode(): boolean {
    return !!this.configurations.payWith;
  }

  getSelected(): boolean {
    return this.isSelected;
  }

  onSelect(): void {
    this.isSelected = true;
    if (this.onPaymentNavigate) {
      this.onPaymentNavigate();
    }
    this.biLoggerApi.buyerChoosePaymentMethod(this._createBiDTO());
  }

  onUnSelect(): void {
    this.isSelected = false;
    if (this.onPaymentNavigateBack) {
      this.onPaymentNavigateBack();
    }
    this.biLoggerApi.buyerBackFromChosenPaymentMethod(this._createBiDTO());
  }

  _createBiDTO() {
    return new BiDTO(this.configurations);
  }
}
// TODO: Add new angular module to biservice and replace dependency in 'paymentAppInternal' with this new module
angular.module('wixPayment', ['wixPaymentTabs', 'wixPaymentTab', 'wixPaymentCreditCard', 'wixPaymentPaypal', 'wixPaymentYandex', 'wixPaymentSettingsApi', 'wixPaymentMercadopago', 'wixPaymentOffline', 'paymentAppInternal'])
  .component('wixPayment', {
    template: `<div class="wix-payment-wrapper">
                    <h2 class="choose-payment-header" ng-if="!wixPayment.settings.isOnlyOnePaymentMethodExists() && !wixPayment.isPayWithMode() && !wixPayment.getSelected()" data-hook="choose-payment-header-title">{{'payment.chooseYourPaymentMethod' | translate}}</h2>
                    <wix-payment-tabset class="wcsh-wix-tabs" on-select="wixPayment.onSelect()" on-un-select="wixPayment.onUnSelect()">
                      <wix-payment-tab ng-if="wixPayment.isPaymentMethodVisible(wixPayment.CashierPaymentMethodConstants.CREDIT_CARD)" payment-method="{{wixPayment.CashierPaymentMethodConstants.CREDIT_CARD}}" use-this-payment-method="::wixPayment.useThisPaymentMethod(wixPayment.CashierPaymentMethodConstants.CREDIT_CARD)" custom-class="credit-card-tab" header="{{'payment.creditCard' | translate}}">
                        <wix-payment-credit-card on-payment-start="wixPayment.onPaymentStart()" on-payment-success="wixPayment.onPaymentSuccess()" on-error="wixPayment.onError()" on-payment-error="wixPayment.onPaymentError()" configurations="::wixPayment.configurations" gateway-id="::wixPayment.creditCardGatewayId"></wix-payment-credit-card>
                      </wix-payment-tab>
                      <wix-payment-tab ng-if="wixPayment.isPaymentMethodVisible(wixPayment.CashierPaymentMethodConstants.PAYPAL)" payment-method="{{wixPayment.CashierPaymentMethodConstants.PAYPAL}}" use-this-payment-method="::wixPayment.useThisPaymentMethod(wixPayment.CashierPaymentMethodConstants.PAYPAL)" custom-class="paypal-tab" header="{{'payment.paypal' | translate}}">
                        <wix-payment-paypal configurations="::wixPayment.configurations"></wix-payment-paypal>
                      </wix-payment-tab>
                      <wix-payment-tab ng-if="wixPayment.isPaymentMethodVisible(wixPayment.CashierPaymentMethodConstants.YANDEX)" payment-method="{{wixPayment.CashierPaymentMethodConstants.YANDEX}}" use-this-payment-method="::wixPayment.useThisPaymentMethod(wixPayment.CashierPaymentMethodConstants.YANDEX)" custom-class="yandex-tab" header="{{'payment.yandex' | translate}}">
                        <wix-payment-yandex configurations="::wixPayment.configurations"></wix-payment-yandex>
                      </wix-payment-tab>
                      <wix-payment-tab ng-if="wixPayment.isPaymentMethodVisible(wixPayment.CashierPaymentMethodConstants.MERCADO_PAGO)" payment-method="{{wixPayment.CashierPaymentMethodConstants.MERCADO_PAGO}}" use-this-payment-method="::wixPayment.useThisPaymentMethod(wixPayment.CashierPaymentMethodConstants.MERCADO_PAGO)" custom-class="mercadopago-tab" header="{{'payment.mercadoPago' | translate}}">
                        <wix-payment-mercadopago configurations="::wixPayment.configurations"></wix-payment-mercadopago>
                      </wix-payment-tab>
                      <wix-payment-tab ng-if="wixPayment.isPaymentMethodVisible(wixPayment.CashierPaymentMethodConstants.OFFLINE)" payment-method="{{wixPayment.CashierPaymentMethodConstants.OFFLINE}}" use-this-payment-method="::wixPayment.useThisPaymentMethod(wixPayment.CashierPaymentMethodConstants.OFFLINE)" custom-class="offline-tab" header="{{::wixPayment.settings.offlineVM.titleTranslationId | translate}}">
                        <wix-payment-offline configurations="::wixPayment.configurations" offline-data="::wixPayment.settings.offlineVM" on-payment-start="wixPayment.onPaymentStart()" on-payment-success="wixPayment.onPaymentSuccess()" on-payment-error="wixPayment.onPaymentError()"></wix-payment-offline>
                      </wix-payment-tab>
                    </wix-payment-tabset>
                  </div>`,
    controller: WixPayment,
    controllerAs: 'wixPayment',
    bindings: {
      onError: '&',
      onPaymentStart: '&',
      onPaymentSuccess: '&',
      onPaymentError: '&',
      onPaymentNavigate: '&',
      onPaymentNavigateBack: '&',
      configurations: '='
    }
  });
