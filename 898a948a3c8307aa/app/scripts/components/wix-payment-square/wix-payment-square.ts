namespace square {
    class WixPaymentSquare {
        private sqFormInstance: square.services.SquarePaymentFormInstance;
        private onPaymentStart: () => void;
        private onPaymentSuccess: () => void;
        private onPaymentError: () => void;
        private shouldDisplayErrorMsg: boolean;

        public useTermsAndConditions: boolean;
        public inPaymentProcess = false;
        public termsAndConditionsChecked = true;

        /* @ngInject */
        constructor(private squarePaymentFormAdapter: services.ISquarePaymentFormAdapter,
                    private paymentsService: cashier.services.PaymentsService,
                    private configurationsService: cashier.services.ConfigurationsService,
                    private $scope: angular.IScope) {
            this.onPaymentStart = this.onPaymentStart || angular.noop;
            this.onPaymentSuccess = this.onPaymentSuccess || angular.noop;
            this.onPaymentError = this.onPaymentError || angular.noop;

            this.useTermsAndConditions = !!this.configurationsService.useTermsAndConditions;
            this.termsAndConditionsChecked = true;
            this.shouldDisplayErrorMsg = false;
        }

        public get submitButtonDisabled(): boolean {
            return this.inPaymentProcess || (this.useTermsAndConditions && !this.termsAndConditionsChecked);
        }

        //securityHover() {
        //    this.biLoggerApi.securityHover(this._createBiDTO());
        //}

        public $postLink() {
            const squarePaymentFormBuilder = this.squarePaymentFormAdapter.squareFormBuilder();

            squarePaymentFormBuilder.useElements({
                cardNumber: {elementId: 'wix-payment-sq-card-number'},
                cvv: {elementId: 'wix-payment-sq-cvv', placeholder: '123'},
                expirationDate: {elementId: 'wix-payment-sq-expiration-date', placeholder: 'MM/YY'},
                postalCode: {elementId: 'wix-payment-sq-postal-code'}
            });

            squarePaymentFormBuilder.useStyles({
                inputClass: 'sq-input',
                inputStyles: [{
                    fontSize: '14px',
                    padding: '6px 10px'
                }]
            });

            squarePaymentFormBuilder.useCallbacks({
                cardNonceResponseReceived: (errors: ISquareFormError[], nonce: string) => {
                    this.shouldDisplayErrorMsg = (angular.isArray(errors) && !!errors.length);
                    if (angular.isArray(errors) && errors.length) {
                        this.$scope.$apply(() => this.inPaymentProcess = false);
                    } else {
                        this.onPaymentStart();
                        this.paymentsService.payWithSquare(nonce).then(
                            () => {
                                this.onPaymentSuccess();
                            },
                            () => {
                                this.shouldDisplayErrorMsg = true;
                                this.onPaymentError();
                                this.inPaymentProcess = false;
                            }
                        );
                    }
                },
                unsupportedBrowserDetected: () => {
                    //
                }
            });

            this.sqFormInstance = squarePaymentFormBuilder.build();
        }

        public submit() {
            this.inPaymentProcess = true;
            this.sqFormInstance.requestCardNonce();
        }
    }

    angular
        .module('paymentAppInternal')
        .component('wixPaymentSquare', {
            templateUrl: 'views/square.html',
            controller: WixPaymentSquare,
            bindings: {
                onPaymentStart: '&',
                onPaymentSuccess: '&',
                onPaymentError: '&'
            }
        });
}
