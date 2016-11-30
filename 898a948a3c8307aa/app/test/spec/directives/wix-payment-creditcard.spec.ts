'use strict';

class WixPaymentCreditCardDriver extends TurnerComponentDriver {

  render(config: ICashierPaymentsConfiguration, onStartLoadingAsync = jasmine['createSpy']): void {
    this.renderFromTemplate(`<wix-payment-credit-card configurations="config" on-start-loading-async="onStartLoadingAsync()"></wix-payment-credit-card>`, {
      config,
      onStartLoadingAsync
    });
  }

  get iframe(): ng.IAugmentedJQuery {
    return this.findByDataHook('wcsh-credit-card-iframe');
  }
}

describe('Directive: wixPaymentCreditCard', () => {

  let driver: WixPaymentCreditCardDriver;
  let $locale: ng.ILocaleService;

  beforeEach(function () {
    module('wixPaymentCreditCard');
  });

  beforeEach(inject((_$locale_) => {
    $locale = _$locale_;
  }));

  beforeEach(() => {
    driver = new WixPaymentCreditCardDriver();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should load payment iFrame', () => {
    let config = {
      'appDefId': '',
      'orderId': '1234',
      'visitorId': '5678',
      'appInstanceId': '111222333',
      'customCss': 'http://someUrl.com'
    };
    driver.render(config);
    driver.connectToBody();
    expect(driver.iframe).toBePresent();
  });

  it('should load payment iFrame with correct url', inject((iframeUrlConstant: string) => {
    let config = {
      appDefId: 'abcefd',
      orderId: '1234',
      visitorId: '5678',
      appInstanceId: '111222333',
      customCss: 'http://someUrl.com',
      useTermsAndConditions: true
    };
    let customCssParam = `&customCss=${config.customCss}`;
    //let localeId = `&uoulang=${$locale.id}`;
    let localeId = `?uoulang=${$locale.id}`;
    let termsAndConditions = `&isTermsDefined=${config.useTermsAndConditions}`;
    let biPaymentPageSource = `&biPaymentPageSource=undefined`;
    //let iframeUrl = `${iframeUrlConstant}#?orderId=${config.orderId}&visitorId=${config.visitorId}&appInstanceId=${config.appInstanceId}&appDefId=${config.appDefId}${customCssParam}${termsAndConditions}${localeId}${biPaymentPageSource}`;
    let iframeUrl = `${iframeUrlConstant}${localeId}#?orderId=${config.orderId}&visitorId=${config.visitorId}&appInstanceId=${config.appInstanceId}&appDefId=${config.appDefId}${customCssParam}${termsAndConditions}${biPaymentPageSource}`;
    driver.render(config);
    expect(driver.iframe).toHaveExactSrc(iframeUrl);
  }));

  it('should load payment iFrame without optional "customCss", if not available in config', inject((iframeUrlConstant: string) => {
    let config = {'appDefId': '3434343', 'orderId': '1234', 'visitorId': '5678', 'appInstanceId': '111222333'};
    //let localeId = `&uoulang=${$locale.id}`;
    let localeId = `?uoulang=${$locale.id}`;
    let biPaymentPageSource = `&biPaymentPageSource=undefined`;
    //let iframeUrl = `${iframeUrlConstant}#?orderId=${config.orderId}&visitorId=${config.visitorId}&appInstanceId=${config.appInstanceId}&appDefId=${config.appDefId}${localeId}${biPaymentPageSource}`;
    let iframeUrl = `${iframeUrlConstant}${localeId}#?orderId=${config.orderId}&visitorId=${config.visitorId}&appInstanceId=${config.appInstanceId}&appDefId=${config.appDefId}${biPaymentPageSource}`;
    driver.render(config);
    expect(driver.iframe).toHaveExactSrc(iframeUrl);
  }));

  it('should set configurations object correctly', () => {
    let config = {
      'appDefId': '',
      'orderId': '1234',
      'visitorId': '5678',
      'appInstanceId': '111222333',
      'customCss': 'http://someUrl.com'
    };

    driver.render(config);
    driver.connectToBody();
    expect(driver.scope['wixPaymentCreditCard']['configurations']).toEqual(config);
  });

  it('should report "onStartLoadingAsync" when start loading', () => {
    let config = {
      'appDefId': '',
      'orderId': '1234',
      'visitorId': '5678',
      'appInstanceId': '111222333',
      'customCss': 'http://someUrl.com'
    };
    let spy = jasmine['createSpy']('onStartLoadingAsync');
    driver.render(config, spy);
    driver.connectToBody();

    expect(spy).toHaveBeenCalled();
  });
});
