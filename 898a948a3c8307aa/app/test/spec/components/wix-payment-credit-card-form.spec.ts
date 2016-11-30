'use strict';

describe('Directive: wixPaymentCreditCardForm', () => {

  let driver: WixPaymentCreditCardFormDriver;
  let $httpBackend: ng.IHttpBackendService;
  let orderAPIUrl: string;
  let $translate;
  let cashierBiLoggerService: CashierBiLoggerService;
  let paymentConstants;
  let CashierPaymentMethodConstants: CashierPaymentMethodConstants;
  let $location: ng.ILocationService;
  let ServerPaymentStatusConstants: ServerPaymentStatusConstants;
  let BiConstants: BiConstants;

  const wixTouchBridgeSave: string = 'wixTouchBridge_saveSecuredInfo';
  const wixTouchBridgeLoad: string = 'wixTouchBridge_loadSecuredInfo';

  const config: ICashierPaymentsConfiguration = {
    appInstanceId: 'abc-1234-afd',
    appDefId: 'abcde',
    orderId: '12344',
    visitorId: '34jk334',
    useExternalPayButton: false
  };

  function mobileBridgeLoadWillReturn(card) {
    driver.setSaveCreditCardFeatureToggle(true);
    spyOn(window, wixTouchBridgeLoad).and.callFake((z, a, b, c, cb) => {
      cb(card);
    });
  }

  function aMobileBridgeSaveCreditCardSpy() {
    let spy = jasmine.createSpy('saveCard');
    window[wixTouchBridgeSave] = spy;
  }

  function mobileBridgeSaveWasNeverCalled() {
    expect(window[wixTouchBridgeSave]).not.toHaveBeenCalled();
  }

  beforeEach(module('paymentAppInternal'));

  beforeEach(inject((_$httpBackend_, _orderAPIUrl_, _$translate_, _paymentConstants_, _CashierPaymentMethodConstants_, _cashierBiLoggerService_, _$location_, _ServerPaymentStatusConstants_, _BiConstants_) => {
    $httpBackend = _$httpBackend_;
    orderAPIUrl = _orderAPIUrl_;
    $translate = _$translate_;
    paymentConstants = _paymentConstants_;
    CashierPaymentMethodConstants = _CashierPaymentMethodConstants_;
    cashierBiLoggerService = _cashierBiLoggerService_;
    $location = _$location_;
    ServerPaymentStatusConstants = _ServerPaymentStatusConstants_;
    BiConstants = _BiConstants_;
  }));

  beforeEach(() => {
    driver = new WixPaymentCreditCardFormDriver();
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('normal flow', () => {

    beforeEach(() => {

      spyOn($location, 'search').and.returnValue(config);
      $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});

      driver.render();
      driver.connectToBody();
    });

    afterEach(() => {
      driver.disconnectFromBody();
    });

    describe('Save card to mobile device', () => {

      it('should call saveCard with encrypted data after submit successfully', () => {
        driver.setSaveCreditCardFeatureToggle(true);

        aMobileBridgeSaveCreditCardSpy();

        $httpBackend.expectPOST(orderAPIUrl).respond(driver.getSuccessResponseMock());
        driver.fillValidForm();
        driver.getSubmitButton().click();
        $httpBackend.flush();
        expect(window[wixTouchBridgeSave]).toHaveBeenCalledWith('CashierCCInfo', driver.getSavedCreditCardDataWithFourDigitYear(), $translate('payment.saveCreditCardOnMobileTitle'), $translate('payment.saveCreditCardOnMobileQuestion'), driver.maskCreditCard(driver.getValidForm().creditCard), 'pay-form');
      });

      it('should not call saveCard with when no encrypted data (support old server api)', () => {
        driver.setSaveCreditCardFeatureToggle(true);

        aMobileBridgeSaveCreditCardSpy();

        $httpBackend.expectPOST(orderAPIUrl).respond(driver.getSuccessResponseNoEncApi());
        driver.fillValidForm();
        driver.getSubmitButton().click();
        $httpBackend.flush();
        mobileBridgeSaveWasNeverCalled();
      });

      it('should not call saveCard if not configured', () => {
        driver.setSaveCreditCardFeatureToggle(false);

        aMobileBridgeSaveCreditCardSpy();

        $httpBackend.expectPOST(orderAPIUrl).respond(driver.getSuccessResponseMock());
        driver.fillValidForm();
        driver.getSubmitButton().click();
        $httpBackend.flush();
        mobileBridgeSaveWasNeverCalled();
      });

      it('should send the transaction key after successful transaction', inject((siteApi: SiteApi) => {

        let spy = jasmine.createSpy('sendTransactionKey');
        siteApi.paymentComplete = spy;

        $httpBackend.expectPOST(orderAPIUrl).respond(driver.getSuccessResponseNoEncApi());
        driver.fillValidForm();
        driver.getSubmitButton().click();
        $httpBackend.flush();

        let expectedResponse = driver.getSuccessResponseNoEncApi();
        expect(siteApi.paymentComplete).toHaveBeenCalledWith(expectedResponse);
      }));
    });
  });

  describe('BI Events', () => {

    describe('With default configuration', () => {

      let submitOrderRequest;

      beforeEach(() => {

        spyOn($location, 'search').and.returnValue(config);
        $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});

        driver.render();
        driver.connectToBody();
      });

      afterEach(() => {
        driver.disconnectFromBody();
      });

      describe('Submit order response BI events', () => {

        beforeEach(() => {
          submitOrderRequest = $httpBackend.expectPOST(orderAPIUrl);
          driver.fillValidForm();
        });

        it('should trigger "SubmitOrder" bi event when submitting to server', () => {

          submitOrderRequest.respond(driver.getSuccessResponseMock());
          driver.submitForm();

          let expectedBiEvent = new BiComponentTestDTO(config);
          expectedBiEvent.evid = paymentConstants.bi.biEvents.SUBMIT_ORDER.evid;
          expectedBiEvent.status = true;
          expectedBiEvent.paymentProvider = CashierPaymentMethodConstants.CREDIT_CARD;
          expectedBiEvent.paymentMethodType = paymentConstants.bi.paymentMethodType.visa;
          expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);

          $httpBackend.flush();
        });

        it('should trigger "Approved" BI event for successful submit order', () => {

          submitOrderRequest.respond(driver.getSuccessResponseMock());
          driver.submitForm();
          $httpBackend.flush();

          let expectedBiEvent = new BiComponentTestDTO(config);
          expectedBiEvent.evid = paymentConstants.bi.biEvents.SUBMIT_ORDER_END.evid;
          expectedBiEvent.transactionStatus = ServerPaymentStatusConstants.APPROVED;
          expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
        });

        it('should trigger "Decline" BI Event for declined submit order', () => {

          submitOrderRequest.respond(driver.getDeclinedResponseMock());

          driver.submitForm();
          $httpBackend.flush();

          let expectedBiEvent = new BiComponentTestDTO(config);
          expectedBiEvent.evid = paymentConstants.bi.biEvents.SUBMIT_ORDER_END.evid;
          expectedBiEvent.transactionStatus = ServerPaymentStatusConstants.DECLINED;
          expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
        });

        it('should trigger "Failure" BI Event for declined submit order', () => {

          submitOrderRequest.respond(driver.getFailureResponseMock());

          driver.submitForm();
          $httpBackend.flush();

          let expectedBiEvent = new BiComponentTestDTO(config);
          expectedBiEvent.evid = paymentConstants.bi.biEvents.SUBMIT_ORDER_END.evid;
          expectedBiEvent.transactionStatus = ServerPaymentStatusConstants.FAILURE;
          expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
        });

        it('should trigger "Gateway Failure" BI Event for declined submit order', () => {

          submitOrderRequest.respond(driver.getGatewayFailureResponseMock());

          driver.submitForm();
          $httpBackend.flush();

          let expectedBiEvent = new BiComponentTestDTO(config);
          expectedBiEvent.evid = paymentConstants.bi.biEvents.SUBMIT_ORDER_END.evid;
          expectedBiEvent.transactionStatus = ServerPaymentStatusConstants.GATEWAY_FAILURE;
          expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
        });
      });

      describe('Invalid Card Number BI events', () => {

        it('should send Invalid Card Number BI event when invalid cc number was entered in the cc number input', () => {

          $httpBackend.flush();
          const invalidCardNumber = 'xxx';
          driver.fillCardNumber(invalidCardNumber);
          driver.getCreditCardField().blur();

          let expectedBiEvent = new BiComponentTestDTO(config);
          expectedBiEvent.evid = paymentConstants.bi.biEvents.INVALID_CARD.evid;
          expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
          cashierBiLoggerService.getLastBiUrl().clear();
        });
      });

      describe('security code tooltip', () => {

        it('should display tooltip message when security code question mark is hovered', () => {
          driver.hoverOnSecurityCodeQuestionMark();

          expect(driver.getSecurityCodeTooltipMessage()).toBePresent();

          $httpBackend.flush();
        });

        it('should trigger "VIEW_TOOLTIP" bi event when security code question mark is hovered', () => {
          driver.hoverOnSecurityCodeQuestionMark();

          let expectedBiEvent = new BiComponentTestDTO(config);
          expectedBiEvent.evid = paymentConstants.bi.biEvents.VIEW_TOOLTIP.evid;
          expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);

          $httpBackend.flush();
        });

      });

    });

    describe('Payment Page Loaded', () => {

      let paymentPageLoadedConfig;

      beforeEach(() => {

        paymentPageLoadedConfig = {
          appInstanceId: 'abc-1234-afd',
          appDefId: 'abcde',
          orderId: '12344',
          visitorId: '34jk334',
          biPaymentPageSource: BiConstants.Source.BUYER_CHOOSE
        };

        spyOn($location, 'search').and.returnValue(paymentPageLoadedConfig);
        $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});

        driver.render();
        driver.connectToBody();
        $httpBackend.flush();
      });

      afterEach(() => {
        driver.disconnectFromBody();
      });

      it('should send Invalid Card Number BI event when invalid cc number was entered in the cc number input', () => {

        let expectedBiEvent = new BiComponentTestDTO(config);
        expectedBiEvent.evid = 100;
        expectedBiEvent.source = BiConstants.Source.BUYER_CHOOSE;
        expectedBiEvent.paymentCategory = CashierPaymentMethodConstants.CREDIT_CARD;

        expect(cashierBiLoggerService.getLastBiUrl()).toMatchBiUrl(expectedBiEvent);
        cashierBiLoggerService.getLastBiUrl().clear();
      });
    });
  });

  describe('test without interaction with the ui', () => {

    afterEach(() => {
      window[wixTouchBridgeLoad] = null;
    });

    it('should call loadSavedCard when loaded', () => {
      $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});
      driver.setSaveCreditCardFeatureToggle(true);

      window[wixTouchBridgeLoad] = jasmine.createSpy('loadCard');
      driver.render();
      expect(window[wixTouchBridgeLoad]).toHaveBeenCalledWith('CashierCCInfo', $translate('payment.loadCreditCardOnMobileTitle'), $translate('payment.loadCreditCardOnMobileQuestion'), $translate('payment.loadCreditCardApproveButtonText'), jasmine.any(Function), 'pay-form');
      $httpBackend.flush();
    });

    it('should not call loadSavedCard if not configured', () => {
      $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});
      driver.setSaveCreditCardFeatureToggle(false);

      window[wixTouchBridgeLoad] = jasmine.createSpy('loadCard');
      driver.render();
      expect(window[wixTouchBridgeLoad]).not.toHaveBeenCalled();
      $httpBackend.flush();
    });

    it('should submit order after loading saved credit card', () => {
      let paymentDtoMock = new PaymentDTO(driver.getValidFormPaymentDto().orderId, driver.getSaveCreditCardDataObject().encriptedCardNumber, driver.getValidFormPaymentDto().month, driver.getValidFormPaymentDto().year, null, driver.getValidFormPaymentDto().nameOnCard);
      spyOn($location, 'search').and.returnValue({orderId: driver.getValidFormPaymentDto().orderId});

      mobileBridgeLoadWillReturn(driver.getSaveCreditCardDataObject());

      let expectedOrderAPIUrl = orderAPIUrl + '?enc=true';
      $httpBackend.expectPOST(expectedOrderAPIUrl, paymentDtoMock).respond(driver.getSuccessResponseMock());
      $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});
      driver.render();
      $httpBackend.flush();
    });

    it('should not submit order after loading saved credit card with null encryptedCardNumber', () => {
      $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});
      mobileBridgeLoadWillReturn(driver.getSavedCreditCardDataWithNullEncryptedValueObject());

      driver.render();
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should not submit order after loading saved credit card with empty encryptedCardNumber', () => {
      $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});
      mobileBridgeLoadWillReturn(driver.getSavedCreditCardDataWithEmptyEncryptedValueObject());

      driver.render();
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should not submit order after loading saved credit card with undefined encryptedCardNumber', () => {
      $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});
      mobileBridgeLoadWillReturn(driver.getSavedCreditCardDataWithUndefinedCcNumberObject());

      driver.render();
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should hide submit button when "externalSubmitButton" parameter is set to true', () => {
      $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});

      spyOn($location, 'search').and.returnValue({externalSubmitButton: 'true'});
      driver.render();
      expect(driver.getSubmitButton().length).toBe(0);
      $httpBackend.flush();
    });

    describe('load credit card and submit and get an error response - ui behavior', () => {

      let siteApi: SiteApi;

      beforeEach(inject((_siteApi_: SiteApi) => {

        siteApi = _siteApi_;

        let paymentDtoMock = new PaymentDTO(driver.getValidFormPaymentDto().orderId, driver.getSaveCreditCardDataObject().encriptedCardNumber, driver.getValidFormPaymentDto().month, driver.getValidFormPaymentDto().year, null, driver.getValidFormPaymentDto().nameOnCard);

        spyOn($location, 'search').and.returnValue({orderId: driver.getValidFormPaymentDto().orderId});
        mobileBridgeLoadWillReturn(driver.getSaveCreditCardDataObject());
        spyOn(siteApi, 'paymentComplete').and.callThrough();

        let expectedOrderAPIUrl = orderAPIUrl + '?enc=true';
        $httpBackend.expectPOST(expectedOrderAPIUrl, paymentDtoMock).respond(driver.getGatewayFailureResponseMock());
        $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});
        driver.render();
        $httpBackend.flush();
      }));

      it('should enable the submit button', () => {
        expect(driver.getSubmitButton().attr('disabled')).not.toBeDefined();
      });

      it('should show the error message', () => {
        expect(driver.getSubmitErrorMessage().hasClass('ng-hide')).toBeFalsy();
      });

      it('should notify site of payment error', () => {
        expect(siteApi.paymentComplete).toHaveBeenCalledWith(driver.getGatewayFailureResponseMock());
      });
    });

    describe('load credit card and submit and get an error response - bi events', () => {

      let biLoggerApi: BiLoggerApi;

      beforeEach(inject((_biLoggerApi_: BiLoggerApi) => {

        biLoggerApi = _biLoggerApi_;

        let paymentDtoMock = new PaymentDTO(config.orderId, driver.getSaveCreditCardDataObject().encriptedCardNumber, driver.getValidFormPaymentDto().month, driver.getValidFormPaymentDto().year, null, driver.getValidFormPaymentDto().nameOnCard);

        spyOn($location, 'search').and.returnValue(config);
        mobileBridgeLoadWillReturn(driver.getSaveCreditCardDataObject());
        spyOn(biLoggerApi, 'submitOrderResponse').and.callThrough();

        let expectedOrderAPIUrl = orderAPIUrl + '?enc=true';
        $httpBackend.expectPOST(expectedOrderAPIUrl, paymentDtoMock).respond(driver.getGatewayFailureResponseMock());
        $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});

        driver.render();
        $httpBackend.flush();
      }));

      it('should notify bi of payment error', () => {
        let biDTO = new BiDTO(config);
        biDTO.evid = 103;
        biDTO.transactionStatus = 'GatewayFailure';
        expect(biLoggerApi.submitOrderResponse).toHaveBeenCalledWith(biDTO);
      });
    });
  });
});
