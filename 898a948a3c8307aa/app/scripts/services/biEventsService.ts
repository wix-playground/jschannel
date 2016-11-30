namespace cashier.services {
    export class BiEventsService {
        /* @ngInject */
        constructor(private siteApi: SiteApi,
                    private biLoggerApi: BiLoggerApi,
                    private CashierPaymentMethodConstants: CashierPaymentMethodConstants,
                    private configurationsService: cashier.services.ConfigurationsService) {}

        public sendPaymentStarted() {
            const biDTO: BiDTO = this.createBiDTO();
            biDTO.status = true;
            biDTO.paymentProvider = this.CashierPaymentMethodConstants.CREDIT_CARD;
            biDTO.paymentMethodType = 'none';
            this.biLoggerApi.submitOrderRequest(biDTO);
        }

        public sendPaymentCompleted(response: PaymentResponseDTO) {
            this.siteApi.paymentComplete(response);
            const biDTO: BiDTO = this.createBiDTO();
            biDTO.transactionStatus = response.paymentStatus.value;
            this.biLoggerApi.submitOrderResponse(biDTO);
        }

        private createBiDTO() {
            const config: ICashierPaymentsConfiguration = {
                appDefId: this.configurationsService.appDefId,
                appInstanceId: this.configurationsService.appInstanceId,
                visitorId: this.configurationsService.visitorId,
                orderId: this.configurationsService.orderId
            };

            return new BiDTO(config);
        }
    }

    angular
        .module('paymentAppInternal')
        .service('biEventsService', BiEventsService);
}
