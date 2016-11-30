'use strict';
import ISCEService = angular.ISCEService;

describe('Directive: wixPayment', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;
  let q: ng.IQService;
  let compile: ng.ICompileService;
  let _paymentSettingsApi: SettingsApi;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;
  let PaymentGatewayidConstants: PaymentGatewayidConstants;
  let $sce: ISCEService;

  function getShowAllElementsResponse(): ISettingsDTO {
    let offlineText = getOfflineSettingsResponse();
    return {
      'paymentMethods': [
        {
          'paymentMethod': CashierPaymentMethodConstants.PAYPAL,
          'gatewayId': PaymentGatewayidConstants.PAYPAL
        },
        {
          'paymentMethod': CashierPaymentMethodConstants.YANDEX,
          'gatewayId': PaymentGatewayidConstants.YANDEX
        },
        {
          'paymentMethod': CashierPaymentMethodConstants.CREDIT_CARD,
          'gatewayId': PaymentGatewayidConstants.STRIPE
        },
        {
          'paymentMethod': CashierPaymentMethodConstants.OFFLINE,
          'gatewayId': PaymentGatewayidConstants.OFFLINE
        },
        {
          'paymentMethod': CashierPaymentMethodConstants.MERCADO_PAGO,
          'gatewayId': PaymentGatewayidConstants.MERCADO_PAGO
        }
      ],
      'offlineText': offlineText
    };
  }

  function getDoNotShowAllElementsResponse() {
    return {
      'paymentMethods': []
    };
  }

  function getShowPaypalElementsResponse() {
    return {
      'paymentMethods': [
        {
          'paymentMethod': CashierPaymentMethodConstants.PAYPAL,
          'gatewayId': PaymentGatewayidConstants.PAYPAL
        }
      ]
    };
  }

  function getShowMercadoPagoElementsResponse() {
    return {
      'paymentMethods': [
        {
          'paymentMethod': CashierPaymentMethodConstants.MERCADO_PAGO,
          'gatewayId': PaymentGatewayidConstants.MERCADO_PAGO
        }
      ]
    };
  }

  function getShowOfflineElementsResponse(): ISettingsDTO {
    return {
      'paymentMethods': [
        {
          'paymentMethod': CashierPaymentMethodConstants.OFFLINE,
          'gatewayId': PaymentGatewayidConstants.OFFLINE
        }
      ],
      'offlineText': getOfflineSettingsResponse()
    };
  }

  function getShowAllElementsResponseAsync() {
    let deferred = q.defer();
    deferred.resolve(getShowAllElementsResponse());
    return deferred.promise;
  }

  function getOfflineSettingsResponse(): IOfflineDTO {

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

  function getDoNotShowAllElementsResponseAsync() {
    let deferred = q.defer();
    deferred.resolve(getDoNotShowAllElementsResponse());
    return deferred.promise;
  }

  function getShowPaypalElementsResponseAsync() {
    let deferred = q.defer();
    deferred.resolve(getShowPaypalElementsResponse());
    return deferred.promise;
  }

  function getShowMercadoPagoElementsResponseAsync() {
    let deferred = q.defer();
    deferred.resolve(getShowMercadoPagoElementsResponse());
    return deferred.promise;
  }

  function getShowOfflineElementsResponseAsync() {
    let deferred = q.defer();
    deferred.resolve(getShowOfflineElementsResponse());
    return deferred.promise;
  }

  function getPaypalTab() {
    return element.find('.tab.paypal-tab');
  }

  function getYandexTab() {
    return element.find('.tab.yandex-tab');
  }

  function getCreditCardTab() {
    return element.find('.tab.credit-card-tab');
  }

  function getMercadoPagoTab() {
    return element.find('.tab.mercadopago-tab');
  }

  function getOfflineTab() {
    return element.find('.tab.offline-tab');
  }

  function getOfflinePayButton() {
    return element.find('[data-hook=wcsh-payment-button-offline]');
  }

  function createWixPaymentElement() {
    element = angular.element('<wix-payment configurations="config" on-load="onLoad()"></wix-payment>');
    element = compile(element)(scope);
    scope.$digest();
  }

  function getHeader() {
    return element.find('[data-hook="choose-payment-header-title"]');
  }

  beforeEach(module('wixPayment'));

  beforeEach(inject(($rootScope: ng.IRootScopeService, $q: ng.IQService, $compile: ng.ICompileService, paymentSettingsApi: SettingsApi, _CashierPaymentMethodConstants_: CashierPaymentMethodConstants, _PaymentGatewayidConstants_: PaymentGatewayidConstants, _$sce_) => {
    scope = $rootScope.$new();
    q = $q;
    compile = $compile;
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
    PaymentGatewayidConstants = _PaymentGatewayidConstants_;
    scope['config'] = {
      appInstanceId: 'abcAppInstanceId',
      appDefId: 'abcAppDefId',
      orderId: 'myOrderId'
    };
    _paymentSettingsApi = paymentSettingsApi;
    $sce = _$sce_;
  }));

  it('should show paypal, yandex, cc and MercadoPago tabs if settings set to true for all', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    let paypalTabElement = getPaypalTab();
    let yandexTabElement = getYandexTab();
    let ccTabElement = getCreditCardTab();
    let mercadoPagoTabElement = getMercadoPagoTab();

    expect(paypalTabElement.length).toBe(1);
    expect(yandexTabElement.length).toBe(1);
    expect(ccTabElement.length).toBe(1);
    expect(mercadoPagoTabElement.length).toBe(1);
  });

  it('should not show paypal, yandex, cc and MercadoPago tabs if settings set to false for all', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getDoNotShowAllElementsResponseAsync);
    createWixPaymentElement();
    let paypalTabElement = getPaypalTab();
    let yandexTabElement = getYandexTab();
    let ccTabElement = getCreditCardTab();
    let mercadoPagoTabElement = getMercadoPagoTab();

    expect(paypalTabElement.length).toBe(0);
    expect(yandexTabElement.length).toBe(0);
    expect(ccTabElement.length).toBe(0);
    expect(mercadoPagoTabElement.length).toBe(0);
  });

  it('should call settings-api to get settings when first loaded', inject(($httpBackend: ng.IHttpBackendService, $interpolate: ng.IInterpolateService, settingsApiUrl: string, offlineApiUrl: string) => {
    $httpBackend.expectGET($interpolate(settingsApiUrl)({
      appDefId: scope['config']['appDefId'],
      appInstanceId: scope['config']['appInstanceId']
    })).respond(getShowAllElementsResponse());
    createWixPaymentElement();
    $httpBackend.flush();
  }));

  it('should call settings-api service to get settings when first loaded', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    expect(_paymentSettingsApi.getSettings).toHaveBeenCalledWith(scope['config'].appDefId, scope['config'].appInstanceId);
  });

  it('should load wix-payment-credit-card after tab was clicked', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    getCreditCardTab().click();
    expect(element.find('wix-payment-credit-card').length).toBe(1);
    expect(element.find('wix-payment-credit-card')[0].innerHTML).not.toBe('');
  });

  it('should load wix-payment-paypal after tab was clicked', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    getPaypalTab().click();
    expect(element.find('wix-payment-paypal').length).toBe(1);
    expect(element.find('wix-payment-paypal')[0].innerHTML).not.toBe('');
  });

  it('should load wix-payment-yandex after tab was clicked', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    getYandexTab().click();
    expect(element.find('wix-payment-yandex').length).toBe(1);
    expect(element.find('wix-payment-yandex')[0].innerHTML).not.toBe('');
  });

  it('should load wix-payment-mercadopago after tab was clicked', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    getMercadoPagoTab().click();
    expect(element.find('wix-payment-mercadopago').length).toBe(1);
    expect(element.find('wix-payment-mercadopago')[0].innerHTML).not.toBe('');
  });

  it('should select tab if there is only one', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowPaypalElementsResponseAsync);
    createWixPaymentElement();
    expect(element.find('wix-payment-credit-card').length).toBe(0);
    expect(element.find('wix-payment-paypal').length).toBe(1);
  });

  it('should show title if more than one payment method', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    expect(getHeader().length).toBe(1);
  });

  it('should hide title if only one payment method', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowPaypalElementsResponseAsync);
    createWixPaymentElement();
    expect(getHeader().length).toBe(0);
  });

  it('should select mercadopago component when it is the only one', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowMercadoPagoElementsResponseAsync);
    createWixPaymentElement();
    expect(element.find('wix-payment-mercadopago').length).toBe(1);
    expect(element.find('wix-payment-paypal').length).toBe(0);
  });

  it('should select offline component when it is the only one', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowOfflineElementsResponseAsync);
    createWixPaymentElement();
    expect(getOfflinePayButton().length).toBe(1);
  });

  it('should not show tabs when there is only one payment method', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowOfflineElementsResponseAsync);
    createWixPaymentElement();
    expect(getOfflineTab().length).toBe(0);
    expect(getPaypalTab().length).toBe(0);
    expect(getYandexTab().length).toBe(0);
    expect(getMercadoPagoTab().length).toBe(0);
    expect(getCreditCardTab().length).toBe(0);
  });

  it('should pass configurations to "wix-payment-credit-card"', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    getCreditCardTab().click();
    let creditCardElement = element.find('wix-payment-credit-card');
    // TODO: Figure out if the use of 'wixPaymentCreditCard' (controllerAs of the child element) considered bad practice/code smell?
    expect(creditCardElement.isolateScope()['wixPaymentCreditCard']['configurations']).toEqual(scope['config']);
  });

  it('should hide tabs and show content when pressing a tab', () => {
    spyOn(_paymentSettingsApi, 'getSettings').and.callFake(getShowAllElementsResponseAsync);
    createWixPaymentElement();
    getCreditCardTab().click();
    expect(getOfflineTab().length).toBe(0);
    expect(getPaypalTab().length).toBe(0);
    expect(getYandexTab().length).toBe(0);
    expect(getMercadoPagoTab().length).toBe(0);
    expect(getCreditCardTab().length).toBe(0);
    expect(element.find('wix-payment-credit-card').length).toBe(1);
  });

});
