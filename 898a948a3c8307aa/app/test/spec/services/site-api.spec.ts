'use strict';

describe('Service: siteApi', () => {
  let siteApi: SiteApi;
  let $window;
  let paymentConstants;
  let ServerPaymentStatusConstants: ServerPaymentStatusConstants;

  beforeEach(() => {
    module('paymentAppInternal');
  });

  beforeEach(inject((_siteApi_: SiteApi, _$window_, _paymentConstants_, _ServerPaymentStatusConstants_) => {
    siteApi = _siteApi_;
    $window = _$window_;
    paymentConstants = _paymentConstants_;
    ServerPaymentStatusConstants = _ServerPaymentStatusConstants_;
  }));

  it('should send "paymentComplete" message', () => {
    spyOn(siteApi, 'sendMessage');
    let paymentResponseDTO = <PaymentResponseDTO> {
      paymentStatus: {
        enumClass: 'com.wixpress.payment.domain.PaymentStatus',
        value: ServerPaymentStatusConstants.APPROVED
      }
    };
    siteApi.paymentComplete(paymentResponseDTO);

    let siteMessageDTO = new SiteMessageDTO(paymentConstants.paymentStatusMapping.Approved);
    siteMessageDTO.transactionKey = paymentResponseDTO.transactionKey;
    expect(siteApi.sendMessage).toHaveBeenCalledWith(siteMessageDTO);
  });

  it('should send "isAlive" message', () => {
    spyOn(siteApi, 'sendMessage');
    let siteMessageDTO = new SiteMessageDTO('isAlive'); //TODO: change to constants
    siteApi.isAlive();
    expect(siteApi.sendMessage).toHaveBeenCalledWith(siteMessageDTO);
  });

  it('should send "setHeight" message', inject(($document: ng.IDocumentService) => {
    spyOn(siteApi, 'sendMessage');
    let siteMessageDTO = new SiteMessageDTO('setHeight', 200); //TODO: change to constants + add height
    siteApi.setHeight(200);
    expect(siteApi.sendMessage).toHaveBeenCalledWith(siteMessageDTO);
  }));

  it('should send "startPaymentProcessing" message', inject(($document: ng.IDocumentService) => {
    spyOn(siteApi, 'sendMessage');
    siteApi.startPaymentProcessing();
    expect(siteApi.sendMessage).toHaveBeenCalled();
  }));
});
