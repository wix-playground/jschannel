namespace test {
    let driver: cashierTestDrivers.SquareAdapterDriver;

    beforeEach(() => driver = new cashierTestDrivers.SquareAdapterDriver());

    describe('Provider: SquareAdapter', () => {
        const applicationId = 'some-app-id';
        const squareFormStyles = builders.aSquareFormStylesBuilder();
        const squareFormElements = builders.aSquareFormElementsBuilder();
        const squareFormCallbacks = builders.aSquareFormCallbacksBuilder();

        it('should create a form instance with given applicationId, styles, elements and callbacks and call build on instance', () => {
            driver.given.applicationId(applicationId)
                .when.created()
                .when.useStyles(squareFormStyles)
                .when.useElements(squareFormElements)
                .when.useCallbacks(squareFormCallbacks)
                .when.build();

            const expectedSquareConfig = generateSquareConfig();
            expect(driver.get.sqPaymentFormMock()).toHaveBeenCalledWith(expectedSquareConfig);
            expect(driver.get.sqFormInstanceMock().build).toHaveBeenCalled();
        });

        describe('Throw when some data is missing', () => {
            it('should throw if application id is empty', () => {
                driver.given.applicationId('');
                expect(driver.when.created).toThrow();
            });

            it('should throw if elements were not provided', () => {
                expect(driver.given.applicationId(applicationId)
                    .when.created()
                    .when.useStyles(squareFormStyles)
                    .when.useCallbacks(squareFormCallbacks)
                    .when.build).toThrow();
            });

            it('should throw if callbacks were not provided', () => {
                expect(driver.given.applicationId(applicationId)
                    .when.created()
                    .when.useStyles(squareFormStyles)
                    .when.useElements(squareFormElements)
                    .when.build).toThrow();
            });
        });

        it('should call square\'s requestCardNonce method', () => {
            driver.given.applicationId(applicationId)
                .when.created()
                .when.useStyles(squareFormStyles)
                .when.useElements(squareFormElements)
                .when.useCallbacks(squareFormCallbacks)
                .when.build()
                .when.requestCardNonce();

            expect(driver.get.sqFormInstanceMock().requestCardNonce).toHaveBeenCalled();
        });

        function generateSquareConfig(): ISquareFormConfig {
            return <ISquareFormConfig> _.extend({ applicationId }, { callbacks: squareFormCallbacks },
                squareFormStyles, squareFormElements);
        }
    });
}
