'use strict';

class WixPaymentYandexDriver extends WixBaseViewUnitDriver {

  render(data: ICashierPaymentsConfiguration) {
    this.renderFromTemplate(`<wix-payment-yandex configurations="data" ></wix-payment-yandex>`, {data: data});
  }

  get payButton(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-button-yandex');
  }

  isPaymentButtonDisplayed(): boolean {
    return this.payButton.length > 0;
  }

  clickOnPayButton(): void {
    this.payButton.click();
  }
}

describe('Directive: wixPaymentYandex', () => {

  let $window;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;

  let driver: WixPaymentYandexDriver;
  const configurations: ICashierPaymentsConfiguration = {
    appInstanceId: 'abcde',
    appDefId: 'ab334',
    orderId: '134-dfd30-f',
    visitorId: ''
  };

  beforeEach(module('wixPaymentYandex'));

  beforeEach(module(($provide) => {
    $window = {
      location: {
        protocol: 'https',
        hostname: 'cashier.wix.com'
      }
    };
    $provide.value('$window', $window);
  }));

  beforeEach(inject((_CashierPaymentMethodConstants_) => {
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
  }));

  beforeEach(() => {
    driver = new WixPaymentYandexDriver();
    driver.render(configurations);
    driver.connectToBody();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should make hidden element visible', () => {
    expect(driver.isPaymentButtonDisplayed()).toBeTruthy();
  });

  it('should redirect to cashier wallet/yandex server when clicked', inject((yandexExpressCheckoutAPIUrl: string, $interpolate: ng.IInterpolateService) => {
    driver.clickOnPayButton();
    let data = {
      orderId: configurations.orderId,
      paymentMethod: CashierPaymentMethodConstants.YANDEX
    };
    let path = $interpolate(yandexExpressCheckoutAPIUrl)(data);
    const fullUrl = `${$window.location.protocol}//${$window.location.hostname}${path}`;
    expect($window.location.href).toEqual(fullUrl);
  }));
});
