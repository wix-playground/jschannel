'use strict';

class WixPaymentPaypalDriver extends WixBaseViewUnitDriver {

  render(data: ICashierPaymentsConfiguration) {
    this.renderFromTemplate(`<wix-payment-paypal configurations="data" ></wix-payment-paypal>`, {data: data});
  }

  get payButton(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-payment-button-payPal');
  }

  isPaymentButtonDisplayed(): boolean {
    return this.payButton.length > 0;
  }

  clickOnPayButton(): void {
    this.payButton.click();
  }
}

describe('Directive: wixPaymentPaypal', () => {

  let $window;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;

  let driver: WixPaymentPaypalDriver;
  const configurations: ICashierPaymentsConfiguration = {
    appInstanceId: 'abcde',
    appDefId: 'ab334',
    orderId: '134-dfd30-f',
    visitorId: ''
  };

  beforeEach(module('wixPaymentPaypal'));

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
    driver = new WixPaymentPaypalDriver();
    driver.render(configurations);
    driver.connectToBody();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should make hidden element visible', () => {
    expect(driver.isPaymentButtonDisplayed()).toBeTruthy();
  });

  it('should redirect to cashier wallet/paypal server when clicked', inject((paypalExpressCheckoutAPIUrl: string, $interpolate: ng.IInterpolateService) => {
    driver.clickOnPayButton();
    let data = {
      orderId: configurations.orderId,
      paymentMethod: CashierPaymentMethodConstants.PAYPAL
    };
    let path = $interpolate(paypalExpressCheckoutAPIUrl)(data);
    const fullUrl = `${$window.location.protocol}//${$window.location.hostname}${path}`;
    expect($window.location.href).toEqual(fullUrl);
  }));
});
