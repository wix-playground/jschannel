namespace square.services {
    export class SquarePaymentFormInstance {
        /* @ngInject */
        constructor(private squareFormInstance) {
        }

        public requestCardNonce() {
            this.squareFormInstance.requestCardNonce();
        }

        public build() {
            this.squareFormInstance.build();
        }
    }

    export class SquarePaymentFormBuilder {
        private callbacks: ISquareFormCallbacks;
        private styles: ISquareFormStyles;
        private elements: ISquareFormElements;

        /* @ngInject */
        constructor(private SqPaymentForm, private applicationId: string) {
        }

        public useCallbacks(callbacks: ISquareFormCallbacks) {
            this.callbacks = callbacks;
        }

        public useElements(elements: ISquareFormElements) {
            this.elements = elements;
        }

        public useStyles(styles: ISquareFormStyles) {
            this.styles = styles;
        }

        public build(): SquarePaymentFormInstance {
            const config = this.createSquareConfig();
            const squareForm = new this.SqPaymentForm(config);
            const squareFormInstance = new SquarePaymentFormInstance(squareForm);
            squareFormInstance.build();
            return squareFormInstance;
        }

        private createSquareConfig() {
            if (_.isEmpty(this.callbacks) || _.isEmpty(this.elements)) {
                throw new Error('The SqPaymentForm could not initialize due to lack of callbacks or elements.');
            }

            return _.extend({ applicationId: this.applicationId }, { callbacks: this.callbacks }, this.styles, this.elements);
        }
    }

    export interface ISquarePaymentFormAdapter {
        squareFormBuilder(): SquarePaymentFormBuilder;
    }

    export class SquarePaymentFormAdapterProvider implements ng.IServiceProvider {
        private applicationId: string;

        public init(applicationId: string) {
            this.applicationId = applicationId;
        }

        /* @ngInject */
        public $get($window): ISquarePaymentFormAdapter {
            if (_.isEmpty(this.applicationId)) {
                throw new Error(`The SqPaymentForm 'applicationId' option is required.`);
            }

            return {
                squareFormBuilder: (): SquarePaymentFormBuilder =>
                    new SquarePaymentFormBuilder($window['SqPaymentForm'], this.applicationId)
            };
        }
    }

    angular.module('paymentAppInternal')
        .provider('squarePaymentFormAdapter', square.services.SquarePaymentFormAdapterProvider);
}
