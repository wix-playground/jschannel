'use strict';

class WixPaymentDriver extends WixBaseViewUnitDriver {

  q: ng.IQService;
  _paymentSettingsApi: SettingsApi;
  CashierPaymentMethodConstants: CashierPaymentMethodConstants;
  PaymentGatewayIdConstants: PaymentGatewayidConstants;

  constructor() {
    super();

    inject(($q: ng.IQService, paymentSettingsApi: SettingsApi, _CashierPaymentMethodConstants_: CashierPaymentMethodConstants, _PaymentGatewayidConstants_: PaymentGatewayidConstants) => {
      this.q = $q;
      this._paymentSettingsApi = paymentSettingsApi;
      this.CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
      this.PaymentGatewayIdConstants = _PaymentGatewayidConstants_;
    });
  }

  render(config: ICashierPaymentsConfiguration, onPaymentStart?, onPaymentSuccess?, onPaymentError?) {
    this.renderFromTemplate('<wix-payment configurations="config" on-load="onLoad()" on-payment-start="onPaymentStart()" on-payment-success="onPaymentSuccess()" on-payment-error="onPaymentError()"></wix-payment>', {
      config,
      onPaymentStart,
      onPaymentSuccess,
      onPaymentError
    });
  }

  get offlineTabHeader(): ng.IAugmentedJQuery {
    return this.findByDataHook('offline-tab-header');
  }

  get paymentPageTitle(): ng.IAugmentedJQuery {
    return this.findByDataHook('payment-page-title');
  }

  get offlineInstructionsText(): ng.IAugmentedJQuery {
    return this.findByDataHook('offline-instructions-text');
  }

  get allPaymentMehtods(): any {
    return [
      {
        'paymentMethod': this.CashierPaymentMethodConstants.PAYPAL,
        'gatewayId': this.PaymentGatewayIdConstants.PAYPAL
      },
      {
        'paymentMethod': this.CashierPaymentMethodConstants.YANDEX,
        'gatewayId': this.PaymentGatewayIdConstants.YANDEX
      },
      {
        'paymentMethod': this.CashierPaymentMethodConstants.CREDIT_CARD,
        'gatewayId': this.PaymentGatewayIdConstants.STRIPE
      },
      {
        'paymentMethod': this.CashierPaymentMethodConstants.OFFLINE,
        'gatewayId': this.PaymentGatewayIdConstants.OFFLINE
      },
      {
        'paymentMethod': this.CashierPaymentMethodConstants.MERCADO_PAGO,
        'gatewayId': this.PaymentGatewayIdConstants.MERCADO_PAGO
      }
    ];
  }

  get onlyPaypal(): any {
    return [
      {
        'paymentMethod': this.CashierPaymentMethodConstants.PAYPAL,
        'gatewayId': this.PaymentGatewayIdConstants.PAYPAL
      }
    ];
  }

  getShowAllElementsResponseAsync() {
    let deferred = this.q.defer();

    let offlineSettings = this.getOfflineSettings();
    let response: ISettingsDTO = {
      paymentMethods: this.allPaymentMehtods,
      offlineText: offlineSettings
    };
    deferred.resolve(response);
    return deferred.promise;
  }

  getShowPaypalResponseAsync() {
    let deferred = this.q.defer();

    let response: ISettingsDTO = {
      paymentMethods: this.onlyPaypal,
      offlineText: null
    };
    deferred.resolve(response);
    return deferred.promise;
  }

  getEmptyOfflineIntructionTextResponseAsync() {
    let deferred = this.q.defer();

    let offlineSettings = this.getOfflineSettings();
    offlineSettings.text = null;
    let response: ISettingsDTO = {
      paymentMethods: this.allPaymentMehtods,
      offlineText: offlineSettings
    };
    deferred.resolve(response);
    return deferred.promise;
  }

  getOfflineSettings(): IOfflineDTO {

    return {
      titleId: 'settings.offlineTitleOptionDefault',
      text: `
            <p>regular text</p>
            
            <p><span style="font-weight:bold;">bold text&nbsp;</span></p>
            
            <p><span style="font-style:italic;">indent text</span></p>
            
            <p><span style="text-decoration:underline;">underline text</span></p>
            
            <ul>
              <li>bullets</li>
              <li>bulltets</li>
            </ul>
            
            <ol>
              <li>number</li>
              <li>nubmer</li>
            </ol>
            
            <p><a href="http://www.google.com" target="_blank"><span style="text-decoration:underline;">link to google</span></a></p>
          `
    };
  }

  setRenderAllPaymentMethods() {
    spyOn(this._paymentSettingsApi, 'getSettings').and.callFake(this.getShowAllElementsResponseAsync.bind(this));
  }

  setEmptyOfflineInstructionTextResponse() {
    spyOn(this._paymentSettingsApi, 'getSettings').and.callFake(this.getEmptyOfflineIntructionTextResponseAsync.bind(this));
  }

  setRenderOnlyPaypal() {
    spyOn(this._paymentSettingsApi, 'getSettings').and.callFake(this.getShowPaypalResponseAsync.bind(this));
  }

  getPaypalTab() {
    return this.element.find('.tab.paypal-tab');
  }

  getYandexTab() {
    return this.element.find('.tab.yandex-tab');
  }

  getCreditCardTab() {
    return this.element.find('.tab.credit-card-tab');
  }

  getMercadoPagoTab() {
    return this.element.find('.tab.mercadopago-tab');
  }

  getOfflineTab() {
    return this.element.find('.tab.offline-tab');
  }

  getOfflinePayButton(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-button-offline');
  }

  getOfflineTermAndCondition(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-terms-and-conditions-offline');
  }

  getOfflineTermsAndConditionsCheckbox(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-checkbox-offline');
  }

  getPaypalTermAndCondition(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-terms-and-conditions-payPal');
  }

  getYandexTermAndCondition(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-terms-and-conditions-yandex');
  }

  getPaypalTermsAndConditionsCheckbox(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-checkbox-payPal');
  }

  getYandexTermsAndConditionsCheckbox(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-checkbox-yandex');
  }

  getMercadoPagoTermAndCondition(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-terms-and-conditions-mercadoPago');
  }

  getMercadoPagoTermsAndConditionsCheckbox(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-checkbox-mercadoPago');
  }

  getPaypalPayButton(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-button-payPal');
  }

  getYandexPayButton(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-button-yandex');
  }

  getMercadopagoPayButton(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-button-mercadoPago');
  }

  getPayPalPaymentPage(): ng.IAugmentedJQuery {
    return this.element.find('wix-payment-paypal');
  }

  getYandexPaymentPage(): ng.IAugmentedJQuery {
    return this.element.find('wix-payment-yandex');
  }

  uncheckedCheckbox(checkbox: ng.IAugmentedJQuery): void {
    checkbox.prop('checked', false);
    checkbox.triggerHandler('click');
  }

}
