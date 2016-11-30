'use strict';

describe('Service: paymentsApi', () => {
  let paymentsApi: PaymentsApi;
  let ServerPaymentStatusConstants: ServerPaymentStatusConstants;

  let successResponseMock;
  let declineResponseMock;
  let failedResponseMock;

  function mockValidPaymentDTO(): PaymentDTO {
    let creditCardNumber = '4111111111111110';
    let expDateMonth = 15;
    let expDateYear = 2017;
    let securityNumber = '900';
    let holderName = 'John Doe';
    let orderId = '1234';
    return new PaymentDTO(orderId, creditCardNumber, expDateMonth, expDateYear, securityNumber, holderName);
  }

  beforeEach(() => {
    module('paymentAppInternal');
  });

  beforeEach(inject((_paymentsApi_: PaymentsApi, _ServerPaymentStatusConstants_) => {
    paymentsApi = _paymentsApi_;
    ServerPaymentStatusConstants = _ServerPaymentStatusConstants_;
  }));

  beforeEach(() => {

    successResponseMock = {paymentStatus: {value: `${ServerPaymentStatusConstants.APPROVED}`}};
    declineResponseMock = {paymentStatus: {value: `${ServerPaymentStatusConstants.DECLINED}`}};
    failedResponseMock = {paymentStatus: {value: `${ServerPaymentStatusConstants.FAILURE}`}};
  });

  it('should make a post request to submit_order', inject(($httpBackend: ng.IHttpBackendService, submitOrderAPIUrl: string) => {
    let paymentDTO = mockValidPaymentDTO();
    $httpBackend.expectPOST(submitOrderAPIUrl, paymentDTO).respond(successResponseMock);
    paymentsApi.submitOrder(paymentDTO);
    $httpBackend.flush();
  }));

  it('should resolve promise for success response', inject(($httpBackend: ng.IHttpBackendService, submitOrderAPIUrl: string) => {
    let paymentDTO = mockValidPaymentDTO();
    $httpBackend.expectPOST(submitOrderAPIUrl, paymentDTO).respond(successResponseMock);
    paymentsApi.submitOrder(paymentDTO).then((response) => {
      expect(response).toEqual(successResponseMock);
    });
    $httpBackend.flush();
  }));

  it('should reject promise for declined response', inject(($httpBackend: ng.IHttpBackendService, submitOrderAPIUrl: string) => {
    let paymentDTO = mockValidPaymentDTO();
    $httpBackend.expectPOST(submitOrderAPIUrl, paymentDTO).respond(declineResponseMock);
    paymentsApi.submitOrder(paymentDTO).catch((response: PaymentResponseDTO) => {
      expect(response).toEqual(declineResponseMock);
    });
    $httpBackend.flush();
  }));

  it('should reject promise for failed response', inject(($httpBackend: ng.IHttpBackendService, submitOrderAPIUrl: string) => {
    let paymentDTO = mockValidPaymentDTO();
    $httpBackend.expectPOST(submitOrderAPIUrl, paymentDTO).respond(failedResponseMock);
    paymentsApi.submitOrder(paymentDTO).catch((response: PaymentResponseDTO) => {
      expect(response).toEqual(failedResponseMock);
    });
    $httpBackend.flush();
  }));

  it('should reject promise for server failure', inject(($httpBackend: ng.IHttpBackendService, submitOrderAPIUrl: string) => {
    let paymentDTO = mockValidPaymentDTO();
    $httpBackend.expectPOST(submitOrderAPIUrl, paymentDTO).respond(500, '');
    paymentsApi.submitOrder(paymentDTO).catch((response: PaymentResponseDTO) => {
      expect(response.paymentStatus.value).toEqual(ServerPaymentStatusConstants.GATEWAY_FAILURE);
    });
    $httpBackend.flush();
  }));

});
