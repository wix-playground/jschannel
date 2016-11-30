namespace interceptors {
    export class PaymentServicesWebInterceptor {
        constructor(private $httpBackend: ng.IHttpBackendService) {
        }

        public respondSquarePay(shouldFail = false) {
            const when = this.$httpBackend.whenPOST(/_api\/payment-services-web\/merchant\/square\/pay/);

            if (shouldFail) {
                when.respond(500);
            } else {
                when.respond({
                    paymentStatus: {enumClass: 'com.wixpress.payment.domain.PaymentStatus', value: 'Approved'},
                    transactionKey: 'cf891d48-856f-4b87-866a-5d434d594d48',
                    enc: 'kdsjahdakjdhasjkdhskajh_dsadhjksahdjksahdkas'
                });
            }

            return this;
        }
    }

    export function aPaymentServicesWebInterceptor($httpBackend): PaymentServicesWebInterceptor {
        return new PaymentServicesWebInterceptor($httpBackend);
    }
}
