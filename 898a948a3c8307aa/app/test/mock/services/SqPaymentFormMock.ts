namespace servicesMock {
    export class SqPaymentFormMock {
        private static fakeData: {
            cardNonce: string,
            errors: any[],
            isUnsupportedBrowser: boolean
        };

        constructor(public config: ISquareFormConfig) {
            // Register spies
            if (typeof (spyOn) === 'function') {
                for (let key in this.constructor.prototype) {
                    if (this.constructor.prototype.hasOwnProperty(key)) {
                        spyOn(this, key).and.callThrough();
                    }
                }
            }
        }

        public static reset() {
            SqPaymentFormMock.fakeData = {
                cardNonce: 'some-card-nonce',
                errors: [],
                isUnsupportedBrowser: false
            };
        }

        public static given = {
            cardNonce: (cardNonce) => {
                SqPaymentFormMock.fakeData.cardNonce = cardNonce;
            },
            errors: (errors) => {
                SqPaymentFormMock.fakeData.errors = errors;
            },
            unsupportedBrowser: () => {
                SqPaymentFormMock.fakeData.isUnsupportedBrowser = true;
            }
        };

        public requestCardNonce(): void {
            setTimeout(() =>
                this.config.callbacks.cardNonceResponseReceived(
                    SqPaymentFormMock.fakeData.errors,
                    SqPaymentFormMock.fakeData.cardNonce,
                    undefined));
            return;
        }

        public build(): void {
            if (SqPaymentFormMock.fakeData.isUnsupportedBrowser) {
                setTimeout(() => this.config.callbacks.unsupportedBrowserDetected());
            }

            return;
        }
    }
}
