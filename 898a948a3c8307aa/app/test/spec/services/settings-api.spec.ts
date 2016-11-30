'use strict';

describe('Service: paymentSettingsApi', () => {
  let paymentSettingsApi: SettingsApi;

  beforeEach(() => {
    module('wixPaymentSettingsApi');
  });

  beforeEach(inject((_paymentSettingsApi_: SettingsApi) => {
    paymentSettingsApi = _paymentSettingsApi_;
  }));

  // it('should get ', () => {
  //   expect(paymentSettingsApi.someMethod()).toBe(42);
  // });

  it('should get settings api', inject(($httpBackend: ng.IHttpBackendService, $interpolate: ng.IInterpolateService, settingsApiUrl: string) => {
    $httpBackend.expectGET($interpolate(settingsApiUrl)({ appDefId: 'abcAppDefId', appInstanceId: 'abcAppInstanceId' })).respond({});
    paymentSettingsApi.getSettings('abcAppDefId', 'abcAppInstanceId');
    $httpBackend.flush();
  }));

  // it('should get offline settings', inject(($httpBackend: ng.IHttpBackendService, $interpolate: ng.IInterpolateService, offlineApiUrl: string) => {
  //   $httpBackend.expectGET($interpolate(offlineApiUrl)({ appDefId: 'abcAppDefId', appInstanceId: 'abcAppInstanceId' })).respond({});
  //   paymentSettingsApi.getOfflinePayment('abcAppDefId', 'abcAppInstanceId');
  //   $httpBackend.flush();
  // }));

});
