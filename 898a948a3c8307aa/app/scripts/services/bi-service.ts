'use strict';

class BiService {

  public isOnlyPaymentPageMode: boolean;
  public biPageType: string;
  public biPaymentPageSource: string;
  public biPaymentCategory: string;
  public biPaymentProvider: string;

  constructor(private BiConstants: BiConstants) { }

  init(configurations: ICashierPaymentsConfiguration, settingsResponse: ISettingsDTO) {

    this.isOnlyPaymentPageMode = !!configurations.payWith || settingsResponse.paymentMethods.length === 1;
    if (this.isOnlyPaymentPageMode) {

      this.biPageType = this.BiConstants.PageType.PAYMENT_PAGE;
      this.biPaymentPageSource = configurations.payWith ? this.BiConstants.Source.PAY_WITH : this.BiConstants.Source.ONE_PAYMENT_METHOD;

      let serverPM = configurations.payWith ? settingsResponse.paymentMethods.filter(pm => pm.paymentMethod === configurations.payWith)[0] : settingsResponse.paymentMethods[0];
      this.biPaymentCategory = configurations.payWith ? configurations.payWith : serverPM.paymentMethod;
      this.biPaymentProvider = serverPM.gatewayId;
    } else {
      this.biPageType = this.BiConstants.PageType.CHOOSE_PAYMENT_METHOD_PAGE;
    }
  }
}

angular
  .module('paymentAppBi')
  .service('biService', BiService);
