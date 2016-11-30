'use strict';

class SettingsApi {

  /* @ngInject */
  constructor(private $http: ng.IHttpService, private $interpolate: ng.IInterpolateService, private settingsApiUrl: string, private offlineApiUrl: string) {
    //
  }

  getSettings(appDefId: string, appInstanceId: string): ng.IPromise<ISettingsDTO> {
    let settingsUrl = this.$interpolate(this.settingsApiUrl)({ appDefId: appDefId, appInstanceId: appInstanceId });
    return this.$http.get(settingsUrl).then(result => result.data);
  }
}

angular
  .module('wixPaymentSettingsApi', [])
  .service('paymentSettingsApi', SettingsApi)
  .constant('settingsApiUrl', '/_api/payment-services-web/buyer/settings?appDefId={{appDefId}}&appInstanceId={{appInstanceId}}')
  .constant('offlineApiUrl', '/_api/payment-services-web/buyer/offlinetext?appDefId={{appDefId}}&appInstanceId={{appInstanceId}}');
