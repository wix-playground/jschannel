namespace cashier.services {
    export class PaymentsService {
        /* @ngInject */
        constructor(private paymentsApi: PaymentsApi,
                    private $q: angular.IQService,
                    private configurationsService: cashier.services.ConfigurationsService,
                    private biEventsService: cashier.services.BiEventsService) {
        }

        public payWithSquare(nonce: string): angular.IPromise<void> {
            this.biEventsService.sendPaymentStarted();
            const paymentDto = new PaymentSquareDTO(this.configurationsService.orderId, nonce);

            return this.paymentsApi.payWithSquare(paymentDto).then(
                (response: PaymentResponseDTO) => this.biEventsService.sendPaymentCompleted(response),
                (response: PaymentResponseDTO) => {
                    this.biEventsService.sendPaymentCompleted(response);
                    return this.$q.reject();
                }
            );
        }
    }

    angular
        .module('paymentAppInternal')
        .service('paymentsService', PaymentsService);
}
