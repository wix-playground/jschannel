describe('Component: WixPaymentSquare', () => {
    let driver: cashierTestDrivers.WixPaymentSquareDriver;
    let configurations: ICashierPaymentsConfiguration;

    beforeEach(() => {
        driver = new cashierTestDrivers.WixPaymentSquareDriver();
        jasmine.clock().install();
    });

    beforeEach(() => configurations = {
        appDefId: '',
        appInstanceId: '',
        orderId: '',
        visitorId: ''
    });

    afterEach(() => {
        jasmine.clock().uninstall();
        driver.disconnectFromBody();
    });

    describe('On submit', () => {
        it('should request nonce', () => {
            driver.given.configurations(configurations)
                .when.created()
                .when.submit();

            expect(driver.get.sqFormPaymentInstance().requestCardNonce).toHaveBeenCalled();
        });

        describe('Lifecycle hooks', () => {
            it('should call onPaymentStart when use clicks on submit button', () => {
                const spy = jasmine.createSpy('onPaymentStart');

                driver.given.configurations(configurations)
                    .given.onPaymentStart(spy)
                    .when.created()
                    .when.submit();

                expect(spy).toHaveBeenCalled();
            });

            it('should call onPaymentSuccess when payment completed successfully', () => {
                const spy = jasmine.createSpy('onPaymentSuccess');

                driver.given.configurations(configurations)
                    .given.onPaymentSuccess(spy)
                    .when.created()
                    .when.submit()
                    .when.flush();

                expect(spy).toHaveBeenCalled();
            });

            it('should call onPaymentError when payment failed on cashier server', () => {
                const spy = jasmine.createSpy('onPaymentError');

                driver.given.configurations(configurations)
                    .given.squarePaymentFailedInCashierServer()
                    .given.onPaymentError(spy)
                    .when.created()
                    .when.submit()
                    .when.flush();

                expect(spy).toHaveBeenCalled();
            });

            it('should display generic error message when error returned from server', () => {
                driver.given.configurations(configurations)
                    .given.squarePaymentFailedInCashierServer()
                    .when.created()
                    .when.submit()
                    .when.flush();

                expect(driver.get.errorMessage()).toBePresent();
            });

        });
    });
});
