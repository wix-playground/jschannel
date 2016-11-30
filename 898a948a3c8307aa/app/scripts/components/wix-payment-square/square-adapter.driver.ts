namespace cashierTestDrivers {
    export class SquareAdapterDriver {
        private sqPaymentFormMock;
        private sqPaymentInstanceFormMock: servicesMock.SqPaymentFormMock;
        public squareFormBuilder: square.services.SquarePaymentFormBuilder;
        public squareFormInstance: square.services.SquarePaymentFormInstance;

        constructor() {
            this.sqPaymentFormMock = window['SqPaymentForm'] =
                jasmine.createSpy('SqPaymentForm').and.callFake((config) =>
                    this.sqPaymentInstanceFormMock = new servicesMock.SqPaymentFormMock(config));

            servicesMock.SqPaymentFormMock.reset();
            module('paymentAppInternal');
        }

        public given = {
            applicationId: (applicationId: string): SquareAdapterDriver => {
                module(squarePaymentFormAdapterProvider => squarePaymentFormAdapterProvider.init(applicationId));
                return this;
            }
        };

        public when = {
            created: (): SquareAdapterDriver => {
                inject(squarePaymentFormAdapter => this.squareFormBuilder = squarePaymentFormAdapter.squareFormBuilder());
                return this;
            },
            useElements: (elements: ISquareFormElements): SquareAdapterDriver => {
                this.squareFormBuilder.useElements(elements);
                return this;
            },
            useStyles: (styles: ISquareFormStyles): SquareAdapterDriver => {
                this.squareFormBuilder.useStyles(styles);
                return this;
            },
            useCallbacks: (callbacks: ISquareFormCallbacks): SquareAdapterDriver => {
                this.squareFormBuilder.useCallbacks(callbacks);
                return this;
            },
            build: (): SquareAdapterDriver => {
                this.squareFormInstance = this.squareFormBuilder.build();
                return this;
            },
            requestCardNonce: (): SquareAdapterDriver => {
                this.squareFormInstance.requestCardNonce();
                return this;
            }
        };

        public get = {
            sqPaymentFormMock: () => this.sqPaymentFormMock,
            sqFormInstanceMock: () => this.sqPaymentInstanceFormMock
        };
    }
}
