'use strict';

describe('Domain: Settings', () => {

  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;
  let PaymentGatewayidConstants: PaymentGatewayidConstants;
  let $sce: ng.ISCEService;
  let $translate: any;

  beforeEach(module('wixPayment'));

  beforeEach(inject((_CashierPaymentMethodConstants_, _PaymentGatewayidConstants_, _$sce_, _$translate_) => {
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
    PaymentGatewayidConstants = _PaymentGatewayidConstants_;
    $sce = _$sce_;
    $translate = _$translate_;
  }));

  function createSettings(): Settings {
    let settingsDTO: ISettingsDTO = {
      'paymentMethods': [
        {
          'paymentMethod': CashierPaymentMethodConstants.PAYPAL,
          'gatewayId': PaymentGatewayidConstants.PAYPAL
        },
        {
          'paymentMethod': CashierPaymentMethodConstants.CREDIT_CARD,
          'gatewayId': PaymentGatewayidConstants.STRIPE
        },
        {
          'paymentMethod': CashierPaymentMethodConstants.OFFLINE,
          'gatewayId': PaymentGatewayidConstants.OFFLINE
        }
      ],
      'offlineText': getOfflineSettingsResponse()
    };

    return new Settings(settingsDTO, $sce, $translate, CashierPaymentMethodConstants);
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

  it('should initialize paymentMethods array', () => {
    let settings = createSettings();
    expect(settings.paymentMethods.length).toBe(3);
    expect(settings.paymentMethods.map((payment) => payment.paymentMethod)).toEqual([CashierPaymentMethodConstants.PAYPAL, CashierPaymentMethodConstants.CREDIT_CARD, CashierPaymentMethodConstants.OFFLINE]);
  });

  it('should get number of visible payment methods', () => {
    let settings = createSettings();

    expect(settings.getNumberOfVisiblePaymentMethods()).toBe(3);
  });

  it('should return payment visibility', () => {
    let settings = createSettings();
    expect(settings.isPaymentMethodVisible(CashierPaymentMethodConstants.PAYPAL)).toBe(true);
    expect(settings.isPaymentMethodVisible(CashierPaymentMethodConstants.CREDIT_CARD)).toBe(true);
    expect(settings.isPaymentMethodVisible(CashierPaymentMethodConstants.OFFLINE)).toBe(true);
  });
});
