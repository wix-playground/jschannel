interface ISquareFormElement {
    elementId: string;
    placeholder?: string;
}

interface ISquareFormCallbacks {
    cardNonceResponseReceived: (errors: ISquareFormError[], nonce: string, cardData: ISquareFormCardData) => void;
    unsupportedBrowserDetected: () => void;
}

interface ISquareFormError {
    type: string;
    message: string;
    field: string;
}

interface ISquareFormCardData {
    card_brand: string;
    last_4: string;
    exp_month: number;
    exp_year: number;
}

interface ISquareFormElements {
    cardNumber: ISquareFormElement;
    cvv: ISquareFormElement;
    expirationDate: ISquareFormElement;
    postalCode: ISquareFormElement;
}

interface ISquareFormStyles {
    inputClass: string;
    inputStyles?: any[];
}

interface ISquareFormConfig extends ISquareFormStyles, ISquareFormElements {
    applicationId: string;
    callbacks: ISquareFormCallbacks;
}

interface ISquareData {
    areTermsDefined: boolean;
}
