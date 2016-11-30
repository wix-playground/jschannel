'use strict';

describe('Component: wixPayment (New tests using the new wix-driver stack)', () => {

  let driver: WixPaymentDriver;
  let cashierBiLoggerService: CashierBiLoggerService;
  let paymentConstants;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;
  let $httpBackend: ng.IHttpBackendService;

  let onPaymentStartSpy;
  let onPaymentSuccessSpy;
  let onPaymentErrorSpy;

  const config: ICashierPaymentsConfiguration = {
    appInstanceId: 'abc-1234-afd',
    appDefId: 'abcde',
    orderId: '12344',
    visitorId: '34jk334',
    useExternalPayButton: false
  };

  beforeEach(module('wixPayment'));

  beforeEach(module(($provide) => {
    $provide.value('iframeUrlConstant', './credit-card-page.html');
  }));

  beforeEach(inject((_cashierBiLoggerService_, _paymentConstants_, _CashierPaymentMethodConstants_, _$httpBackend_) => {
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
    cashierBiLoggerService = _cashierBiLoggerService_;
    paymentConstants = _paymentConstants_;
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(() => {
    driver = new WixPaymentDriver();
    driver.setRenderAllPaymentMethods();

    onPaymentStartSpy = jasmine.createSpy('onPaymentStartSpy');
    onPaymentSuccessSpy = jasmine.createSpy('onPaymentSuccessSpy');
    onPaymentErrorSpy = jasmine.createSpy('onPaymentErrorSpy');
    driver.render(config, onPaymentStartSpy, onPaymentSuccessSpy, onPaymentErrorSpy);
    driver.connectToBody();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should show paypal, yandex, cc and MercadoPago tabs if settings set to true for all', () => {
    expect(driver.getPaypalTab().length).toBe(1);
    expect(driver.getYandexTab().length).toBe(1);
    expect(driver.getCreditCardTab().length).toBe(1);
    expect(driver.getMercadoPagoTab().length).toBe(1);
  });

  describe('Submit Order BI Event', () => {

    afterEach(() => {
      cashierBiLoggerService.getLastBiUrl().clear();
    });

    it('should send Submit Order BI event when clicking on "Pay with Paypal"', inject((wixPaymentPaypalService) => {

      // override the redirect behavior (to do nothing instead..)
      spyOn(wixPaymentPaypalService, 'navigateToPaypalExpressCheckout').and.callFake(() => null);

      driver.getPaypalTab().click();
      cashierBiLoggerService.getLastBiUrl().clear();
      driver.getPaypalPayButton().click();

      let expectedBiEvent = new BiComponentTestDTO(config);
      expectedBiEvent.evid = 104;
      expectedBiEvent.paymentProvider = CashierPaymentMethodConstants.PAYPAL;
      expectedBiEvent.status = true;
      expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
    }));

    it('should send Submit Order BI event when clicking on "Pay with Yandex"', inject((wixPaymentYandexService) => {

      // override the redirect behavior (to do nothing instead..)
      spyOn(wixPaymentYandexService, 'navigateToYandexExpressCheckout').and.callFake(() => null);

      driver.getYandexTab().click();
      cashierBiLoggerService.getLastBiUrl().clear();
      driver.getYandexPayButton().click();

      let expectedBiEvent = new BiComponentTestDTO(config);
      expectedBiEvent.evid = 104;
      expectedBiEvent.paymentProvider = CashierPaymentMethodConstants.YANDEX;
      expectedBiEvent.status = true;

      expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
    }));

    it('should send Submit Order BI event when clicking on "Pay offline"', () => {
      $httpBackend.expectPOST('/_api/payment-services-web/transactions/offline', {orderSnapshotId: '12344'}).respond({});
      driver.getOfflineTab().click();
      cashierBiLoggerService.getLastBiUrl().clear();
      driver.getOfflinePayButton().click();

      let expectedBiEvent = new BiComponentTestDTO(config);
      expectedBiEvent.evid = 104;
      expectedBiEvent.paymentProvider = CashierPaymentMethodConstants.OFFLINE;
      expectedBiEvent.status = true;
      expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
    });

    it('should send Submit Order BI event when clicking on "Pay with Mercadopago"', inject((wixPaymentMercadopagoService) => {

      // override the redirect behavior (to do nothing instead..)
      spyOn(wixPaymentMercadopagoService, 'navigateToMercadopagoCheckout').and.callFake(() => null);

      driver.getMercadoPagoTab().click();
      cashierBiLoggerService.getLastBiUrl().clear();
      driver.getMercadopagoPayButton().click();

      let expectedBiEvent = new BiComponentTestDTO(config);
      expectedBiEvent.evid = 104;
      expectedBiEvent.paymentProvider = CashierPaymentMethodConstants.MERCADO_PAGO;
      expectedBiEvent.status = true;
      expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
    }));
  });

  describe('Offline tab', () => {

    it(`should set the tab's title according to the titleId (which came from the server)`, () => {
      const offlineTitleText = 'Offline Payment';
      expect(driver.offlineTabHeader).toHaveExactText(offlineTitleText);
    });
  });

  describe('Offline payment page', () => {

    beforeEach(() => {
      driver.getOfflineTab().click();
    });

    it(`should set the offline page title according to the titleId (which came from the server)`, () => {
      const offlinePageTitleText = 'Offline Payment';
      expect(driver.paymentPageTitle).toHaveExactText(offlinePageTitleText);
    });

    it('should present the offline instructions text according to the merchant settings', inject(($sce: ng.ISCEService, $compile: ng.ICompileService, $rootScope: ng.IRootScopeService) => {
      let trustedInstructionsText = $sce.trustAsHtml(driver.getOfflineSettings().text);

      let scope = <any>$rootScope.$new();
      scope.trustedInstructionsText = trustedInstructionsText;
      let element = $compile(angular.element(`<div ng-bind-html="trustedInstructionsText"></div>`))(scope);
      scope.$digest();

      expect(driver.offlineInstructionsText).toHaveExactText(element.text());
    }));

    it('should invoke server call when offline pay button is clicked', () => {
      $httpBackend.expectPOST('/_api/payment-services-web/transactions/offline', {orderSnapshotId: '12344'}).respond({});
      driver.getOfflinePayButton().click();
      $httpBackend.flush();
    });

    it('should disable offline pay button once it is clicked', () => {
      $httpBackend.expectPOST('/_api/payment-services-web/transactions/offline', {orderSnapshotId: '12344'}).respond({});
      driver.getOfflinePayButton().click();
      expect(driver.getOfflinePayButton()).toBeDisabled();
    });

    it('should trigger "onPaymentStart" when offline pay button clicked', () => {
      $httpBackend.expectPOST('/_api/payment-services-web/transactions/offline', {orderSnapshotId: '12344'}).respond({});
      driver.getOfflinePayButton().click();
      $httpBackend.flush();
      expect(onPaymentStartSpy).toHaveBeenCalled();
    });

    it('should trigger "onPaymentSuccess" when offline pay button clicked', () => {
      $httpBackend.expectPOST('/_api/payment-services-web/transactions/offline', {orderSnapshotId: '12344'}).respond({});
      driver.getOfflinePayButton().click();
      $httpBackend.flush();
      expect(onPaymentSuccessSpy).toHaveBeenCalled();
    });

    it('should trigger "onPaymentError" when offline pay button clicked', () => {
      $httpBackend.expectPOST('/_api/payment-services-web/transactions/offline', {orderSnapshotId: '12344'}).respond(500, {});
      driver.getOfflinePayButton().click();
      $httpBackend.flush();
      expect(onPaymentErrorSpy).toHaveBeenCalled();
    });

  });

  describe('paypal payment page', () => {

    beforeEach(() => {
      driver.getPaypalTab().click();
    });

    it('should disable paypal pay button once it is clicked', inject((wixPaymentPaypalService: WixPaymentPaypalService) => {
      spyOn(wixPaymentPaypalService, 'payWithPaypal').and.callFake(() => {
        //
      });
      driver.getPaypalPayButton().click();
      expect(driver.getPaypalPayButton()).toBeDisabled();
    }));

  });

  describe('yandex payment page', () => {

    beforeEach(() => {
      driver.getYandexTab().click();
    });

    it('should disable yandex pay button once it is clicked', inject((wixPaymentYandexService: WixPaymentYandexService) => {
      spyOn(wixPaymentYandexService, 'payWithYandex').and.callFake(() => {
        //
      });
      driver.getYandexPayButton().click();
      expect(driver.getYandexPayButton()).toBeDisabled();
    }));

  });

  describe('mercadopago payment page', () => {

    beforeEach(() => {
      driver.getMercadoPagoTab().click();
    });

    it('should disable mercadopago pay button once it is clicked', inject((wixPaymentMercadopagoService: WixPaymentMercadopagoService) => {
      spyOn(wixPaymentMercadopagoService, 'payWithMercadopago').and.callFake(() => {
        //
      });
      driver.getMercadopagoPayButton().click();
      expect(driver.getMercadopagoPayButton()).toBeDisabled();
    }));

  });

});

describe('Component: wixPayment - default offline instruction text', () => {

  let driver: WixPaymentDriver;

  const config: ICashierPaymentsConfiguration = {
    appInstanceId: 'abc-1234-afd',
    appDefId: 'abcde',
    orderId: '12344',
    visitorId: '34jk334',
    useExternalPayButton: false
  };

  beforeEach(module('wixPayment'));

  beforeEach(() => {
    driver = new WixPaymentDriver();
    driver.setEmptyOfflineInstructionTextResponse();
    driver.render(config);
    driver.connectToBody();
  });

  beforeEach(() => {
    driver.getOfflineTab().click();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should present a default offline instruction text if the merchant did not set any', () => {
    const defaultInstructionText = 'Contact the business owner for payment instructions';
    expect(driver.offlineInstructionsText).toHaveExactText(defaultInstructionText);
  });

});

describe('Component: wixPayment - configured to pay directly with payPal', () => {
  let driver: WixPaymentDriver;
  let cashierBiLoggerService: CashierBiLoggerService;
  let paymentConstants;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;
  let config: ICashierPaymentsConfiguration;

  beforeEach(module('wixPayment'));

  beforeEach(inject((_cashierBiLoggerService_, _paymentConstants_, _CashierPaymentMethodConstants_: CashierPaymentMethodConstants) => {
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
    cashierBiLoggerService = _cashierBiLoggerService_;
    paymentConstants = _paymentConstants_;
  }));

  beforeEach(() => {
    config = {
      appInstanceId: 'abc-1234-afd',
      appDefId: 'abcde',
      orderId: '12344',
      visitorId: '34jk334',
      useExternalPayButton: false,
      payWith: CashierPaymentMethodConstants.PAYPAL
    };
    driver = new WixPaymentDriver();
    driver.setRenderAllPaymentMethods();
    driver.render(config);
    driver.connectToBody();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should pay with paypal when configured to', () => {
    expect(driver.getOfflineTab().length).toBe(0);
    expect(driver.getPaypalTab().length).toBe(0);
    expect(driver.getYandexTab().length).toBe(0);
    expect(driver.getMercadoPagoTab().length).toBe(0);
    expect(driver.getCreditCardTab().length).toBe(0);
    expect(driver.getPayPalPaymentPage().length).toBe(1);
  });

});

describe('Component: wixPayment - configured to pay directly with yandex', () => {
  let driver: WixPaymentDriver;
  let cashierBiLoggerService: CashierBiLoggerService;
  let paymentConstants;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;
  let config: ICashierPaymentsConfiguration;

  beforeEach(module('wixPayment'));

  beforeEach(inject((_cashierBiLoggerService_, _paymentConstants_, _CashierPaymentMethodConstants_: CashierPaymentMethodConstants) => {
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
    cashierBiLoggerService = _cashierBiLoggerService_;
    paymentConstants = _paymentConstants_;
  }));

  beforeEach(() => {
    config = {
      appInstanceId: 'abc-1234-afd',
      appDefId: 'abcde',
      orderId: '12344',
      visitorId: '34jk334',
      useExternalPayButton: false,
      payWith: CashierPaymentMethodConstants.YANDEX
    };
    driver = new WixPaymentDriver();
    driver.setRenderAllPaymentMethods();
    driver.render(config);
    driver.connectToBody();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should pay with yandex when configured to', () => {
    expect(driver.getOfflineTab().length).toBe(0);
    expect(driver.getPaypalTab().length).toBe(0);
    expect(driver.getYandexTab().length).toBe(0);
    expect(driver.getMercadoPagoTab().length).toBe(0);
    expect(driver.getCreditCardTab().length).toBe(0);
    expect(driver.getYandexPaymentPage().length).toBe(1);
  });

});

describe('Component: wixPayment - Load events', () => {

  let driver: WixPaymentDriver;
  let cashierBiLoggerService: CashierBiLoggerService;
  let paymentConstants;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;
  let BiConstants: BiConstants;
  let PaymentGatewayidConstants: PaymentGatewayidConstants;
  let $httpBackend: ng.IHttpBackendService;

  beforeEach(module('wixPayment'));

  beforeEach(module('ng', function ($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

  beforeEach(module(($provide) => {
    $provide.value('iframeUrlConstant', './credit-card-page.html');
  }));

  beforeEach(inject((_cashierBiLoggerService_, _paymentConstants_, _CashierPaymentMethodConstants_, _BiConstants_, _PaymentGatewayidConstants_, _$httpBackend_) => {
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
    cashierBiLoggerService = _cashierBiLoggerService_;
    paymentConstants = _paymentConstants_;
    BiConstants = _BiConstants_;
    PaymentGatewayidConstants = _PaymentGatewayidConstants_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(() => {
    cashierBiLoggerService.getLastBiUrl().clear();
    driver.disconnectFromBody();
  });

  describe('Component load start event', () => {

    const componentLoadStartConfig: ICashierPaymentsConfiguration = {
      appInstanceId: 'abc-1234-afd',
      appDefId: 'abcde',
      orderId: '12344',
      visitorId: '34jk334',
      useExternalPayButton: false
    };

    beforeEach(() => {
      driver = new WixPaymentDriver();
      $httpBackend.whenGET(/.*/).respond([]);
      driver.render(componentLoadStartConfig);
      driver.connectToBody();
    });

    it('should notify PaymentsComponentLoadStart on component initialization', () => {

      let expectedBiEvent = new BiComponentTestDTO(componentLoadStartConfig);
      expectedBiEvent.evid = 125;
      expectedBiEvent.payWith = componentLoadStartConfig.payWith;
      expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
    });
  });

  describe('Component load complete event', () => {

    function getEvent(componentLoadCompleteConfig: ICashierPaymentsConfiguration) {

      let expectedLoadCompleteBiEvent = new BiComponentTestDTO(componentLoadCompleteConfig);
      expectedLoadCompleteBiEvent.evid = 126;
      expectedLoadCompleteBiEvent.payWith = componentLoadCompleteConfig.payWith;
      return expectedLoadCompleteBiEvent;
    }

    describe('success with all-payment-methods configuration', () => {

      const componentLoadCompleteConfig: ICashierPaymentsConfiguration = {
        appInstanceId: 'abc-1234-afd',
        appDefId: 'abcde',
        orderId: '12344',
        visitorId: '34jk334'
      };

      beforeEach(() => {
        driver = new WixPaymentDriver();
        driver.setRenderAllPaymentMethods();
        driver.render(componentLoadCompleteConfig);
        driver.connectToBody();
      });

      it('should notify PaymentsComponentLoadComplete with all-payment-methods', () => {
        let expectedLoadCompleteBiEvent = getEvent(componentLoadCompleteConfig);
        expectedLoadCompleteBiEvent.status = BiConstants.Status.SUCCESS;
        expectedLoadCompleteBiEvent.pageType = BiConstants.PageType.CHOOSE_PAYMENT_METHOD_PAGE;
        expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedLoadCompleteBiEvent);
      });
    });

    describe('success with one-payment-method configuration', () => {
      const componentLoadCompleteConfig: ICashierPaymentsConfiguration = {
        appInstanceId: 'abc-1234-afd',
        appDefId: 'abcde',
        orderId: '12344',
        visitorId: '34jk334'
      };

      beforeEach(() => {
        driver = new WixPaymentDriver();
        driver.setRenderOnlyPaypal();
        driver.render(componentLoadCompleteConfig);
        driver.connectToBody();
      });

      it('should notify PaymentsComponentLoadComplete with one-payment-method', () => {
        let expectedLoadCompleteBiEvent = getEvent(componentLoadCompleteConfig);
        expectedLoadCompleteBiEvent.status = BiConstants.Status.SUCCESS;
        expectedLoadCompleteBiEvent.pageType = BiConstants.PageType.PAYMENT_PAGE;
        expectedLoadCompleteBiEvent.source = BiConstants.Source.ONE_PAYMENT_METHOD;
        expectedLoadCompleteBiEvent.paymentProvider = PaymentGatewayidConstants.PAYPAL;
        expectedLoadCompleteBiEvent.paymentCategory = CashierPaymentMethodConstants.PAYPAL;
        expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedLoadCompleteBiEvent);
      });
    });

    describe('success with pay-with configuration', () => {
      let componentLoadCompleteConfig: ICashierPaymentsConfiguration = {
        appInstanceId: 'abc-1234-afd',
        appDefId: 'abcde',
        orderId: '12344',
        visitorId: '34jk334'
      };

      beforeEach(() => {
        componentLoadCompleteConfig.payWith = PaymentGatewayidConstants.PAYPAL;

        driver = new WixPaymentDriver();
        driver.setRenderAllPaymentMethods();
        driver.render(componentLoadCompleteConfig);
        driver.connectToBody();
      });

      it('should notify PaymentsComponentLoadComplete with pay-with', () => {
        let expectedLoadCompleteBiEvent = getEvent(componentLoadCompleteConfig);
        expectedLoadCompleteBiEvent.status = BiConstants.Status.SUCCESS;
        expectedLoadCompleteBiEvent.pageType = BiConstants.PageType.PAYMENT_PAGE;
        expectedLoadCompleteBiEvent.source = BiConstants.Source.PAY_WITH;
        expectedLoadCompleteBiEvent.paymentProvider = PaymentGatewayidConstants.PAYPAL;
        expectedLoadCompleteBiEvent.paymentCategory = CashierPaymentMethodConstants.PAYPAL;
        expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedLoadCompleteBiEvent);
      });
    });

    describe('failed with server error', () => {

      const serverErrorObj = {
        errorCode: -28000,
        errorDescription: 'Internal Server Error [request-id: 1472136050.3783894673531131934]'
      };
      const componentLoadCompleteConfig: ICashierPaymentsConfiguration = {
        appInstanceId: 'abc-1234-afd',
        appDefId: 'abcde',
        orderId: '12344',
        visitorId: '34jk334'
      };

      beforeEach(() => {
        driver = new WixPaymentDriver();
        $httpBackend.expectGET(/.*/).respond(500, serverErrorObj);
        driver.render(componentLoadCompleteConfig);
        driver.connectToBody();
      });

      it('should notify PaymentsComponentLoadComplete with all-payment-methods', () => {
        $httpBackend.flush();
        let expectedLoadCompleteBiEvent = getEvent(componentLoadCompleteConfig);
        expectedLoadCompleteBiEvent.status = BiConstants.Status.FAILURE;
        expectedLoadCompleteBiEvent.errorDesc = serverErrorObj.errorDescription;
        expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedLoadCompleteBiEvent);
      });
    });

    describe('failed with client error', () => {

      const componentLoadCompleteConfig: ICashierPaymentsConfiguration = {
        appInstanceId: 'abc-1234-afd',
        appDefId: 'abcde',
        orderId: '12344',
        visitorId: '34jk334'
      };

      beforeEach(() => {
        driver = new WixPaymentDriver();
        $httpBackend.expectGET(/.*/).respond({});
        driver.render(componentLoadCompleteConfig);
        driver.connectToBody();
      });

      it('should notify PaymentsComponentLoadComplete with all-payment-methods', () => {
        $httpBackend.flush();
        let expectedLoadCompleteBiEvent = getEvent(componentLoadCompleteConfig);
        expectedLoadCompleteBiEvent.status = BiConstants.Status.FAILURE;
        expectedLoadCompleteBiEvent.errorDesc = `undefined is not an object (evaluating 'settingsResponse.paymentMethods.length')`;
        expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedLoadCompleteBiEvent);
      });
    });
  });
});

describe('Component: wixPayment - Use terms and conditions', () => {
  let driver: WixPaymentDriver;

  let termsAndCondConfig: ICashierPaymentsConfiguration = {
    appInstanceId: 'abc-1234-afd',
    appDefId: 'abcde',
    orderId: '12344',
    visitorId: '34jk334',
    useTermsAndConditions: true,
    useExternalPayButton: false
  };

  beforeEach(module('wixPayment'));

  beforeEach(() => {
    driver = new WixPaymentDriver();
    driver.setRenderAllPaymentMethods();
    driver.render(termsAndCondConfig);
    driver.connectToBody();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  describe('offline', () => {

    beforeEach(() => {
      driver.getOfflineTab().click();
    });

    it('should display the terms and conds checkbox', () => {
      expect(driver.getOfflineTermAndCondition()).toBePresent();
    });

    it('should disable the payment button if checkbox is unchecked', () => {
      driver.uncheckedCheckbox(driver.getOfflineTermsAndConditionsCheckbox());
      expect(driver.getOfflinePayButton()).toBeDisabled();
    });

  });

  describe('paypal', () => {

    beforeEach(() => {
      driver.getPaypalTab().click();
    });

    it('should display the terms and conds checkbox', () => {
      expect(driver.getPaypalTermAndCondition()).toBePresent();
    });

    it('should disable the payment button if checkbox is unchecked', () => {
      driver.uncheckedCheckbox(driver.getPaypalTermsAndConditionsCheckbox());
      expect(driver.getPaypalPayButton()).toBeDisabled();
    });

  });

  describe('yandex', () => {

    beforeEach(() => {
      driver.getYandexTab().click();
    });

    it('should display the terms and conds checkbox', () => {
      expect(driver.getYandexTermAndCondition()).toBePresent();
    });

    it('should disable the payment button if checkbox is unchecked', () => {
      driver.uncheckedCheckbox(driver.getYandexTermsAndConditionsCheckbox());
      expect(driver.getYandexPayButton()).toBeDisabled();
    });

  });

  describe('mercadopago', () => {

    beforeEach(() => {
      driver.getMercadoPagoTab().click();
    });

    it('should display the terms and conds checkbox', () => {
      expect(driver.getMercadoPagoTermAndCondition()).toBePresent();
    });

    it('should disable the payment button if checkbox is unchecked', () => {
      driver.uncheckedCheckbox(driver.getMercadoPagoTermsAndConditionsCheckbox());
      expect(driver.getMercadopagoPayButton()).toBeDisabled();
    });

  });

});
//
// describe('Component: wixPayment - Credit card iframe tests', () => {
//
//   let driver: WixPaymentDriver;
//   let cashierBiLoggerService: CashierBiLoggerService;
//   let paymentConstants;
//   let CashierPaymentMethodConstants: CashierPaymentMethodConstants;
//   let $httpBackend: ng.IHttpBackendService;
//   let BiConstants: BiConstants;
//   let PaymentGatewayidConstants: PaymentGatewayidConstants;
//
//   let onPaymentStartSpy;
//   let onPaymentSuccessSpy;
//   let onPaymentErrorSpy;
//
//   const config: ICashierPaymentsConfiguration = {
//     appInstanceId: 'abc-1234-afd',
//     appDefId: 'abcde',
//     orderId: '12344',
//     visitorId: '34jk334'
//   };
//
//   beforeEach(module('wixPayment'));
//
//   beforeEach(module(($provide) => {
//     $provide.value('iframeUrlConstant', './base/.tmp/credit-card-page.html');
//   }));
//
//   beforeEach(inject((_cashierBiLoggerService_, _paymentConstants_, _CashierPaymentMethodConstants_, _$httpBackend_, _BiConstants_, _PaymentGatewayidConstants_) => {
//     CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
//     cashierBiLoggerService = _cashierBiLoggerService_;
//     paymentConstants = _paymentConstants_;
//     $httpBackend = _$httpBackend_;
//     BiConstants = _BiConstants_;
//     PaymentGatewayidConstants = _PaymentGatewayidConstants_;
//   }));
//
//   beforeEach(() => {
//     driver = new WixPaymentDriver();
//     driver.setRenderAllPaymentMethods();
//
//     onPaymentStartSpy = jasmine.createSpy('onPaymentStartSpy');
//     onPaymentSuccessSpy = jasmine.createSpy('onPaymentSuccessSpy');
//     onPaymentErrorSpy = jasmine.createSpy('onPaymentErrorSpy');
//     driver.render(config, onPaymentStartSpy, onPaymentSuccessSpy, onPaymentErrorSpy);
//     driver.connectToBody();
//     driver.getCreditCardTab().click();
//   });
//
//   afterEach(() => {
//     cashierBiLoggerService.getLastBiUrl().clear();
//     driver.disconnectFromBody();
//   });
//
//   it('should fire "Payment Page Loaded" BI event', (done) => {
//     $('#pay-form').load(() => {
//       // debugger;
//       let expectedBiEvent = new BiComponentTestDTO(config);
//       expectedBiEvent.evid = 100;
//       expectedBiEvent.source = BiConstants.Source.BUYER_CHOOSE;
//       expectedBiEvent.paymentProvider = PaymentGatewayidConstants.STRIPE;
//       expectedBiEvent.paymentCategory = CashierPaymentMethodConstants.CREDIT_CARD;
//       expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
//       done();
//     });
//   });
// });

describe('disable offline pay button', () => {
  let driver: WixPaymentDriver;

  let disableOfflinePaymentButtonConfig: ICashierPaymentsConfiguration = {
    appInstanceId: 'abc-1234-afd',
    appDefId: 'abcde',
    orderId: '12344',
    visitorId: '34jk334',
    hideOfflinePaymentButton: true,
    useExternalPayButton: false
  };

  beforeEach(module('wixPayment'));

  beforeEach(() => {
    driver = new WixPaymentDriver();
    driver.setRenderAllPaymentMethods();
    driver.render(disableOfflinePaymentButtonConfig);
    driver.connectToBody();
    driver.getOfflineTab().click();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should not diaply offline pay button', () => {
    expect(driver.getOfflinePayButton()).not.toBePresent();
  });

});
