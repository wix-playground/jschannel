'use strict';

class PreconfigurePayments {

  responses: any = {
    'successResponse': {'paymentStatus': {'enumClass': 'com.wixpress.payment.domain.PaymentStatus', 'value': 'Approved'}},
    'declinedResponse': {'paymentStatus': { 'enumClass': 'com.wixpress.payment.domain.PaymentStatus', 'value': 'Declined'}},
    'failedResponse': {'paymentStatus': {'enumClass': 'com.wixpress.payment.domain.PaymentStatus', 'value': 'Failed'}}
  };
  responseType: string;

  /* @ngInject */
  constructor(provider: PreconfigurePaymentsProvider) {
    this.responseType = provider.responseType;
  }

  submitOrder() {
    return this.responses[this.responseType];
  }
}

class PreconfigurePaymentsProvider {
  responseType: string;

  setResponse(type) {
    this.responseType = type;
  }

  /* @ngInject */
  $get($injector: ng.auto.IInjectorService): PreconfigurePayments {
    return $injector.instantiate(PreconfigurePayments, { provider: this });
  };
}

class PreConfigureSettingsProvider {
  settings: any = {};

  mockSettings(settings) {
    this.settings = settings;
  }

  $get() {
    return this.settings;
  }
}

class PreConfigureOfflineTextProvider {
  settings: any = {};

  mockOfflineSettings(settings) {
    this.settings = settings;
  }

  $get() {
    return this.settings;
  }
}

angular.module('paymentAppMocks', ['ngMockE2E'])
  .provider('preConfigureSettings', PreConfigureSettingsProvider)
  .provider('preConfigureOfflineText', PreConfigureOfflineTextProvider)
  .run(function($httpBackend, preConfigureSettings, preConfigureOfflineText) {
    // if (preconfigurePayments.responseType) {
    //   $httpBackend.whenPOST(/.*/).respond(
    //     preconfigurePayments.submitOrder());
    // }
    $httpBackend.whenGET(/_api\/payment-services-web\/buyer\/settings\?.*/).respond(preConfigureSettings);
    $httpBackend.whenGET(/_api\/buyer\/offlinetext\?.*/).respond(preConfigureOfflineText);
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
