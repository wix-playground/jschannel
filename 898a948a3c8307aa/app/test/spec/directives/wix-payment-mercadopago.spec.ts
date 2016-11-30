'use strict';

describe('Directive: wixPaymentMercadopago', () => {
  let element: ng.IAugmentedJQuery;
  let scope: any;
  let $window;
  let spy;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;

  const configurations: ICashierPaymentsConfiguration = {
    appDefId: 'abcAppDefId',
    appInstanceId: 'abcAppInstanceId',
    orderId: '',
    visitorId: ''
  };

  beforeEach(module('wixPaymentMercadopago'));

  beforeEach(module(($provide) => {
    $window = { location: { assign: spy } };
    spy = jasmine['createSpy']('locasion_assign');
    $provide.value('$window', $window);
  }));

  beforeEach(inject(($rootScope: ng.IRootScopeService, _CashierPaymentMethodConstants_) => {
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(($compile: ng.ICompileService) => {
    element = angular.element('<wix-payment-mercadopago></wix-payment-mercadopago>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.find('.wix-payment-mercadopago').length).toBe(1);
  }));

  it('should redirect to cashier wallet/paypal server when clicked', inject(($compile: ng.ICompileService, mercadopagoCheckoutAPIUrl: string, $interpolate: ng.IInterpolateService) => {
    scope.configurations = configurations;
    element = angular.element('<wix-payment-mercadopago configurations="configurations"></wix-payment-mercadopago>');
    element = $compile(element)(scope);
    scope.$digest();
    element.find('[data-hook=wcsh-payment-button-mercadoPago]').click();
    let data = {
      orderId: configurations.orderId,
      paymentMethod: CashierPaymentMethodConstants.MERCADO_PAGO
    };
    let path = $interpolate(mercadopagoCheckoutAPIUrl)(data);
    const fullUrl = `${$window.location.protocol}//${$window.location.hostname}${path}`;
    expect($window.location.href).toEqual(fullUrl);
  }));

});
