namespace cashierTestDrivers {
    import ConfigurationsService = cashier.services.ConfigurationsService;
    export class WixPaymentSquareDriver extends TurnerComponentDriver {
        private sqPaymentForm;
        private sqPaymentFormInstance: servicesMock.SqPaymentFormMock;
        private configurations: ICashierPaymentsConfiguration;
        private componentData: any = {};
        private interceptorsData: any = {
            cashierShouldFail: false
        };

        constructor() {
            super();
            servicesMock.SqPaymentFormMock.reset();
        }

        public given = {
            onPaymentStart: (callback: jasmine.Spy): WixPaymentSquareDriver => {
                this.componentData.onPaymentStart = callback;
                return this;
            },
            onPaymentSuccess: (callback: jasmine.Spy): WixPaymentSquareDriver => {
                this.componentData.onPaymentSuccess = callback;
                return this;
            },
            onPaymentError: (callback: jasmine.Spy): WixPaymentSquareDriver => {
                this.componentData.onPaymentError = callback;
                return this;
            },
            configurations: (configurations: ICashierPaymentsConfiguration): WixPaymentSquareDriver => {
                this.configurations = configurations;
                return this;
            },
            unsupportedBrowser: (): WixPaymentSquareDriver => {
                servicesMock.SqPaymentFormMock.given.unsupportedBrowser();
                return this;
            },
            cardNonce: (cardNonce): WixPaymentSquareDriver => {
                servicesMock.SqPaymentFormMock.given.cardNonce(cardNonce);
                return this;
            },
            errors: (errors): WixPaymentSquareDriver => {
                servicesMock.SqPaymentFormMock.given.errors(errors);
                return this;
            },
            squarePaymentFailedInCashierServer: (): WixPaymentSquareDriver => {
                this.interceptorsData.cashierShouldFail = true;
                return this;
            }
        };

        private render() {
            this.renderFromTemplate(`
                <wix-payment-square 
                    on-payment-start="onPaymentStart()"
                    on-payment-success="onPaymentSuccess()"
                    on-payment-error="onPaymentError()" />`, this.componentData);
            this.connectToBody();
        }

        public when = {
            created: (): WixPaymentSquareDriver => {
                module('wixPayment');
                inject((configurationsService: ConfigurationsService, $httpBackend: angular.IHttpBackendService) => {
                    configurationsService.configurations = this.configurations;

                    interceptors.aPaymentServicesWebInterceptor($httpBackend)
                        .respondSquarePay(this.interceptorsData.cashierShouldFail);

                    $httpBackend.expectGET('images/svg-font-icons/question.svg').respond({});
                });

                this.sqPaymentForm = window['SqPaymentForm'] =
                    jasmine.createSpy('SqPaymentForm').and.callFake((config) =>
                        this.sqPaymentFormInstance = new servicesMock.SqPaymentFormMock(config));

                this.render();
                jasmine.clock().tick(0);
                return this;
            },
            submit: (shouldTick: boolean = true): WixPaymentSquareDriver => {
                this.get.submit().click();
                if (shouldTick) {
                    jasmine.clock().tick(0);
                }
                return this;
            },
            flush: (): WixPaymentSquareDriver => {
                inject(($httpBackend: angular.IHttpBackendService) => $httpBackend.flush());
                return this;
            }
        };

        public get = {
            submit: () => this.findByDataHook('submit'),
            errorMessage: () => this.findByDataHook('submit-error-message'),
            sqFormPaymentInstance: () => this.sqPaymentFormInstance
        };
    }
}
