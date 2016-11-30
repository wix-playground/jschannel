namespace builders {
    class SquareFormStylesBuilder implements ISquareFormStyles {
        inputClass: string;
        inputStyles: any[];

        constructor() {
            this.inputClass = 'some-class';
            this.inputStyles = [{
                fontSize: '14px'
            }];
        }
    }

    class SquareFormElementsBuilder implements ISquareFormElements {
        cardNumber: ISquareFormElement;
        cvv: ISquareFormElement;
        expirationDate: ISquareFormElement;
        postalCode: ISquareFormElement;

        constructor() {
            this.cardNumber = <ISquareFormElement> {
                elementId: 'card-element'
            };
            this.cvv = <ISquareFormElement> {
                elementId: 'card-element'
            };
            this.expirationDate = <ISquareFormElement> {
                elementId: 'card-element'
            };
            this.postalCode = <ISquareFormElement> {
                elementId: 'card-element'
            };
        }
    }

    class SquareFormCallbacksBuilder implements ISquareFormCallbacks {
        cardNonceResponseReceived: (errors: ISquareFormError[], nonce: string, cardData: ISquareFormCardData) => void;
        unsupportedBrowserDetected: () => void;

        constructor() {
            this.cardNonceResponseReceived = jasmine.createSpy('cardNonceResponseReceived');
            this.unsupportedBrowserDetected = jasmine.createSpy('unsupportedBrowserDetected');
        }
    }

    export function aSquareFormCallbacksBuilder(): ISquareFormCallbacks {
        return new SquareFormCallbacksBuilder();
    }

    export function aSquareFormStylesBuilder(): ISquareFormStyles {
        return new SquareFormStylesBuilder();
    }

    export function aSquareFormElementsBuilder(): ISquareFormElements {
        return new SquareFormElementsBuilder();
    }
}
