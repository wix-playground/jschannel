'use strict';

describe('Controller: PaymentController', () => {

  let payment: PaymentController;

  function mockValidPaymentDTO(): PaymentDTO {
    let creditCardNumber = '4222222222222';
    let expDateMonth = 15;
    let expDateYear = 2017;
    let securityNumber = '900';
    let holderName = 'John Doe';
    let orderId = '1234';
    return new PaymentDTO(orderId, creditCardNumber, expDateMonth, expDateYear, securityNumber, holderName);
  }

  function mockInValidPaymentDTO(): PaymentDTO {
    let creditCardNumber = '4222222222223';
    let expDateMonth = 15;
    let expDateYear = 2017;
    let securityNumber = '900';
    let holderName = 'John Doe';
    let orderId = '1234';
    return new PaymentDTO(orderId, creditCardNumber, expDateMonth, expDateYear, securityNumber, holderName);
  }

  function fillPayment(paymentDTO, $location) {
    payment.creditCardNumber = paymentDTO.ccnumber;
    payment.expirationDate = {
      year: paymentDTO.year, month: paymentDTO.month
    };
    payment.securityNumber = paymentDTO.csc;
    payment.holderName = paymentDTO.nameOnCard;
    spyOn($location, 'search').and.returnValue({orderId: paymentDTO.orderId});
  }

  beforeEach(module('paymentAppInternal'));

  beforeEach(module(($provide) => {

    //Mock wixBiLogger - I do not test it here (tested on e2e). It was causing an extra $digest, which causing tests to randomally fail.
    //TODO: Find a better solution (cannot test bi here. If bi test needed here, do it in a different describe, for now)
    $provide.provider('wixBiLogger', function () {
      this.$get = function () {
        return {
          log: () => {
            return;
          }
        };
      };
    });
  }));

  describe('normal flow', () => {

    let ServerPaymentStatusConstants: ServerPaymentStatusConstants;

    let successResponseMock;
    let successResponseNoEncApiMock;
    let declineResponseMock;

    beforeEach(inject(($controller: ng.IControllerService, _$location_: ng.ILocationService, _wixAngularTopology_, _ServerPaymentStatusConstants_) => {

      payment = $controller('PaymentController', {
        $location: _$location_,
        wixAngularTopology: _wixAngularTopology_
      });
      ServerPaymentStatusConstants = _ServerPaymentStatusConstants_;
    }));

    beforeEach(() => {
      successResponseMock = {
        'paymentStatus': {
          'enumClass': 'com.wixpress.payment.domain.PaymentStatus',
          'value': ServerPaymentStatusConstants.APPROVED
        }, enc: 'this is encripted credit card response!!'
      };
      successResponseNoEncApiMock = {
        'paymentStatus': {
          'enumClass': 'com.wixpress.payment.domain.PaymentStatus',
          'value': ServerPaymentStatusConstants.APPROVED
        }
      };
      declineResponseMock = {
        'paymentStatus': {
          'enumClass': 'com.wixpress.payment.domain.PaymentStatus',
          'value': ServerPaymentStatusConstants.DECLINED
        }
      };
    });

    it('should make post request to submit a form', inject(($httpBackend: ng.IHttpBackendService, $location: ng.ILocationService) => {

      let paymentDTO = mockValidPaymentDTO();
      $httpBackend.expectPOST('/_api/payment-gateway-web/submit_order', paymentDTO).respond(successResponseMock); //TODO: use const for api url
      fillPayment(paymentDTO, $location);
      payment.submitForm();
      $httpBackend.flush();
    }));

    it('should call site-api while submitting with "startPaymentProcessing" event', inject(($location: ng.ILocationService, siteApi: SiteApi) => {
      spyOn(siteApi, 'sendMessage'); //TODO: should I seperate this to a different describe using spy + inject controller?
      let paymentDTO = mockValidPaymentDTO();
      fillPayment(paymentDTO, $location);
      payment.submitForm();
      expect(siteApi.sendMessage).toHaveBeenCalledWith(new SiteMessageDTO('startPaymentProcessing'));
    }));

    it('should submit an order', inject((paymentsApi: PaymentsApi, $location: ng.ILocationService, $q: any) => {
      //given
      let paymentDTO = mockValidPaymentDTO();
      spyOn(paymentsApi, 'submitOrder').and.returnValue($q.when({}));
      //when
      fillPayment(paymentDTO, $location);
      payment.submitForm();
      //then
      expect(paymentsApi.submitOrder).toHaveBeenCalledWith(paymentDTO);
    }));

    // it('should not submit an order if form is invalid', inject((paymentsApi: PaymentsApi, $location: ng.ILocationService, $q: any) => {
    //   //given
    //   let paymentDTO = mockInValidPaymentDTO();
    //   spyOn(paymentsApi, 'submitOrder').andReturn($q.when({}));
    //   //when
    //   fillPayment(paymentDTO, $location);
    //   payment.submitForm();
    //   //then
    //   expect(paymentsApi.submitOrder).not.toHaveBeenCalled();
    // }));

    it('should call site-api after finishes submit_order', inject(($httpBackend: ng.IHttpBackendService, $location: ng.ILocationService, siteApi: SiteApi) => {

      //given
      spyOn(siteApi, 'startPaymentProcessing');
      spyOn(siteApi, 'paymentComplete');
      let paymentDTO = mockValidPaymentDTO();
      $httpBackend.expectPOST('/_api/payment-gateway-web/submit_order', paymentDTO).respond(successResponseMock);
      //when
      fillPayment(paymentDTO, $location);
      payment.submitForm();

      //then
      $httpBackend.flush();
      expect(siteApi.startPaymentProcessing).toHaveBeenCalled();
      expect(siteApi.paymentComplete).toHaveBeenCalledWith(successResponseMock);
    }));

    it('should call site-api after finishes submit_order (using no enc old api)', inject(($httpBackend: ng.IHttpBackendService, $location: ng.ILocationService, siteApi: SiteApi) => {

      //given
      spyOn(siteApi, 'startPaymentProcessing');
      spyOn(siteApi, 'paymentComplete');
      let paymentDTO = mockValidPaymentDTO();
      $httpBackend.expectPOST('/_api/payment-gateway-web/submit_order', paymentDTO).respond(successResponseNoEncApiMock);
      //when
      fillPayment(paymentDTO, $location);
      payment.submitForm();

      //then
      $httpBackend.flush();
      expect(siteApi.startPaymentProcessing).toHaveBeenCalled();
      expect(siteApi.paymentComplete).toHaveBeenCalledWith(successResponseNoEncApiMock);
    }));

    it('should update "submittingForm" to be true and "submitError" to be false after submitting successfully', inject(($httpBackend: ng.IHttpBackendService, $location: ng.ILocationService, siteApi: SiteApi) => {

      //given
      let paymentDTO = mockValidPaymentDTO();
      $httpBackend.expectPOST('/_api/payment-gateway-web/submit_order', paymentDTO).respond(successResponseMock); //TODO: use constant
      //when
      fillPayment(paymentDTO, $location);
      payment.submitForm();
      //then
      $httpBackend.flush();
      expect(payment.submittingForm).toBeTruthy();
      expect(payment.submitError).toBeFalsy();
    }));

    it('should update "submittingForm" to be false and "submitError" to be true after submitting fails', inject(($httpBackend: ng.IHttpBackendService, $location: ng.ILocationService, siteApi: SiteApi) => {

      //given
      let invalidPaymentDTO = mockInValidPaymentDTO();
      $httpBackend.expectPOST('/_api/payment-gateway-web/submit_order', invalidPaymentDTO).respond(declineResponseMock); //TODO: use constant
      //when
      fillPayment(invalidPaymentDTO, $location);
      payment.submitForm();
      //then
      $httpBackend.flush();
      expect(payment.submittingForm).toBeFalsy();
      expect(payment.submitError).toBeTruthy();
    }));
  });

  describe('Spys', () => {

    beforeEach(inject((siteApi: SiteApi) => {
      spyOn(siteApi, 'isAlive');
    }));

    beforeEach(inject(($controller: ng.IControllerService, _$location_: ng.ILocationService, _wixAngularTopology_) => {
      payment = $controller('PaymentController', {
        $location: _$location_,
        wixAngularTopology: _wixAngularTopology_
      });
    }));

    it('should call site-api with "isAlive" and "setHeight" when loaded', inject((siteApi: SiteApi, $location) => {
      expect(siteApi.isAlive).toHaveBeenCalled();
    }));

    it('should call site-api "setHeight" when "sizeChanged" received', inject((siteApi: SiteApi, $location) => {
      spyOn(siteApi, 'setHeight');
      payment.sizeChanged(200);
      expect(siteApi.setHeight).toHaveBeenCalledWith(200);
    }));
  });

  describe('Topology', () => {
    let wixAngularTopologyProviderMovk;
    let someUrl = 'someUrl';
    beforeEach(() => {
      module(($provide) => {
        $provide.provider('wixAngularTopology', function () {
          let _staticsUrl: string;
          this.setStaticsUrl = (url) => {
            _staticsUrl = url;
          };

          this.$get = function () {
            var staticsUrl = _staticsUrl;

            return {
              staticsUrl: staticsUrl
            };
          };
        });
      });
    });

    beforeEach(() => {
      module(function (wixAngularTopologyProvider) {
        wixAngularTopologyProviderMovk = wixAngularTopologyProvider;
        wixAngularTopologyProviderMovk.setStaticsUrl(someUrl);
      });
    });

    beforeEach(inject(($controller: ng.IControllerService, _$location_: ng.ILocationService, _wixAngularTopology_) => {
      payment = $controller('PaymentController', {
        $location: _$location_,
        wixAngularTopology: _wixAngularTopology_
      });
    }));

    it('should apply controller\'s "staticsBaseUrl" correctly', inject((wixAngularTopology) => {
      expect(payment.staticsBaseUrl).toEqual(someUrl);
    }));
  });

  describe('Form', () => {
    let form;
    beforeEach(inject(($controller: ng.IControllerService, _$location_: ng.ILocationService, _wixAngularTopology_, $rootScope: ng.IRootScopeService, $templateCache: ng.ITemplateCacheService, $compile: ng.ICompileService) => {

      let scope = $rootScope.$new();
      let templateHtml = $templateCache.get('views/main.html');
      let formElem = angular.element('<div>' + templateHtml + '</div>').find('form');
      $compile(formElem)(scope);
      form = scope['payment']['paymentForm'];
      scope.$apply();
    }));

    it('should set securityNumber starting with "0" correctly', () => {
      form.securityNumber.$setViewValue('012');
      expect(form.securityNumber.$modelValue).toEqual('012');
    });
  });
});
