'use strict';

class BiLoggerApi {

  /* @ngInject */
  constructor(private cashierBiLoggerService: CashierBiLoggerService,
              private biService: BiService,
              private BiConstants: BiConstants) {
  }

  paymentPageLoaded(biDTO: BiDTO) {
    biDTO.evid = 100;
    this.cashierBiLoggerService.log(biDTO);
  }

  securityHover(biDTO: BiDTO) {
    biDTO.evid = 101;
    this.cashierBiLoggerService.log(biDTO);
  }

  cardError(biDTO: BiDTO) {
    biDTO.evid = 102;
    this.cashierBiLoggerService.log(biDTO);
  }

  submitOrderResponse(biDTO: BiDTO) {
    biDTO.evid = 103;
    this.cashierBiLoggerService.log(biDTO);
  }

  submitOrderRequest(biDTO: BiDTO) {
    biDTO.evid = 104;
    this.cashierBiLoggerService.log(biDTO);
  }

  buyerChoosePaymentMethod(biDTO: BiDTO) {
    biDTO.evid = 105;
    this.cashierBiLoggerService.log(biDTO);
  }

  buyerBackFromChosenPaymentMethod(biDTO: BiDTO) {
    biDTO.evid = 106;
    this.cashierBiLoggerService.log(biDTO);
  }

  paymentsComponentLoadStart(configurations: ICashierPaymentsConfiguration) {
    let biDTO = new BiDTO(configurations);
    biDTO.payWith = configurations.payWith;
    biDTO.evid = 125;
    this.cashierBiLoggerService.log(biDTO);
  }

  paymentsComponentLoadCompleteSuccessfully(configurations: ICashierPaymentsConfiguration) {

    let biDTO = new BiDTO(configurations);
    biDTO.payWith = configurations.payWith;
    biDTO.status = this.BiConstants.Status.SUCCESS;
    biDTO.evid = 126;
    biDTO.pageType = this.biService.biPageType;
    if (this.biService.isOnlyPaymentPageMode) {
      biDTO.source = this.biService.biPaymentPageSource;
      biDTO.paymentCategory = this.biService.biPaymentCategory;
      biDTO.paymentProvider = this.biService.biPaymentProvider;
    }

    this.cashierBiLoggerService.log(biDTO);
  }

  paymentsComponentLoadFailed(configurations: ICashierPaymentsConfiguration, errorDescription: string) {
    let biDTO = new BiDTO(configurations);
    biDTO.payWith = configurations.payWith;
    biDTO.status = this.BiConstants.Status.FAILURE;
    biDTO.errorDesc = errorDescription;
    biDTO.evid = 126;
    this.cashierBiLoggerService.log(biDTO);
  }
}

angular
  .module('paymentAppBi', ['paymentAppConstants'])
  .service('biLoggerApi', BiLoggerApi);
