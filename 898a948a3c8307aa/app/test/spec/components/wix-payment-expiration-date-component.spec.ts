describe('Directive: wixPaymentExpirationDate with new driver', () => {

  let driver: WixPaymentExpirationDateDriver;
  let $timeout: ng.ITimeoutService;

  beforeEach(function () {
    module('paymentAppInternal');
  });

  beforeEach(inject((_$timeout_: ng.ITimeoutService) => {
    $timeout = _$timeout_;
  }));

  beforeEach(() => {
    driver = new WixPaymentExpirationDateDriver();
    driver.render();
    driver.connectToBody();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });

  it('should jump to year input when month input has two chars set', () => {
    const invalidMonth = 'xx';
    driver.fillExpirationMonth(invalidMonth);

    expect(document.activeElement).toEqual(driver.getExpirationYear()[0]);
  });

  it('should have Expiry Date placeholder for expiration date as default state', () => {
    let placeholder = driver.getExpirationDateDefaultStateComponent().getAttribute('placeholder');
    expect(placeholder).toEqual('Expiry date');
  });

  it('should not get the expiry date active component on default state', () => {
    let expiryDateComponent = driver.getExpirationDateActiveStateComponent();
    expect(expiryDateComponent.classList.contains('ng-hide')).toBeTruthy();
  });

  it('should focus on the expiry date active component on active state', () => {
    driver.getExpirationDateDefaultStateComponent().focus();
    $timeout.flush();
    expect(document.activeElement).toEqual(driver.getExpirationMonth()[0]);
  });

  describe('expiration date special key presses behavior', () => {

    it('should move the caret to the start position of the year input when "right arrow" key was pressed at the end position of the month input', () => {

      // given
      const year = '23';
      driver.fillExpirationYear(year);

      const invalidMonth = '23';
      driver.fillExpirationMonth(invalidMonth);

      // when
      driver.triggerRightArrowKeydownEventOnExpirationMonth();

      // then
      expect(document.activeElement).toEqual(driver.getExpirationYear()[0]);
      expect(document.activeElement.selectionStart).toEqual(0);
    });

    it('should move the caret to the end position of the month input when "left arrow" key was pressed at the start position of the year input', () => {

      // given
      const invalidMonth = '23';
      driver.fillExpirationMonth(invalidMonth);

      const year = '23';
      driver.fillExpirationYear(year);
      driver.setFocusOnExpirationYear();
      driver.setCaretAtStartPositionOfExpirationYear();

      // when
      driver.triggerLeftArrowKeydownEventOnExpirationYear();

      // then
      expect(document.activeElement).toEqual(driver.getExpirationMonth()[0]);
      expect(document.activeElement.selectionStart).toEqual(2);
    });

    it('should move the caret to the end position of the month input when "backspace" key was pressed at the start position of the year input', () => {

      // given
      const invalidMonth = '23';
      driver.fillExpirationMonth(invalidMonth);

      const year = '23';
      driver.fillExpirationYear(year);
      driver.setFocusOnExpirationYear();
      driver.setCaretAtStartPositionOfExpirationYear();

      // when
      driver.triggerBackspaceKeydownEventOnExpirationYear();

      // then
      expect(document.activeElement).toEqual(driver.getExpirationMonth()[0]);
      expect(document.activeElement.selectionStart).toEqual(2);
    });

    it('should move the caret to the start position of the year input when "delete" key was pressed at the end position of the month input', () => {

      // given
      const year = '23';
      driver.fillExpirationYear(year);

      const invalidMonth = '23';
      driver.fillExpirationMonth(invalidMonth);

      // when
      driver.triggerDeleteKeydownEventOnExpirationMonth();

      // then
      expect(document.activeElement).toEqual(driver.getExpirationYear()[0]);
      expect(document.activeElement.selectionStart).toEqual(0);
    });

    it('should move the caret to the start position of the year input when "space" key was pressed at the end position of the month input', () => {

      // given
      const year = '23';
      driver.fillExpirationYear(year);

      const invalidMonth = '23';
      driver.fillExpirationMonth(invalidMonth);

      // when
      driver.triggerSpaceKeydownEventOnExpirationMonth();

      // then
      expect(document.activeElement).toEqual(driver.getExpirationYear()[0]);
      expect(document.activeElement.selectionStart).toEqual(0);
    });

    describe('month input is filled, caret is at its end position, year is empty', () => {

      it('should fill the year input with the char pressed on month', () => {

        // given
        const invalidMonth = '23';
        driver.fillExpirationMonth(invalidMonth);
        driver.setFocusOnExpirationMonth();

        // when
        driver.triggerNineDigitKeypressEventOnExpirationMonth();

        // then
        expect(document.activeElement).toEqual(driver.getExpirationYear()[0]);
        expect(document.activeElement.selectionStart).toEqual(1);
        expect(document.activeElement.value).toEqual('9');
      });

      it('should NOT fill the year input with "0" when "enter" was pressed on month', () => {

        // given
        const invalidMonth = '23';
        driver.fillExpirationMonth(invalidMonth);
        driver.setFocusOnExpirationMonth();

        // when
        driver.triggerEnterKeypressEventOnExpirationMonth();

        // then
        expect(document.activeElement).toEqual(driver.getExpirationMonth()[0]);
        expect(driver.getExpirationMonth().val()).toEqual(invalidMonth);
        expect(driver.getExpirationYear().val()).toEqual('');
      });
    });

    describe('month input is filled, caret is at its end position, year is NOT empty', () => {

      it('should do nothing when char pressed on month', () => {

        // given
        const year = '23';
        driver.fillExpirationYear(year);

        const invalidMonth = '23';
        driver.fillExpirationMonth(invalidMonth);
        driver.setFocusOnExpirationMonth();

        // when
        driver.triggerNineDigitKeypressEventOnExpirationMonth();

        // then
        expect(document.activeElement).toEqual(driver.getExpirationMonth()[0]);
        expect(driver.getExpirationMonth().val()).toEqual(invalidMonth);
        expect(driver.getExpirationYear().val()).toEqual(year);
      });
    });
  });
});
