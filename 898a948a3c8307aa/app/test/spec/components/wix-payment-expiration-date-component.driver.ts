'use strict';

class WixPaymentExpirationDateDriver extends WixBaseViewUnitDriver {

  private keyCodes: KeyCodes;

  constructor() {
    super();

    inject((_keyCodes_: KeyCodes) => {
      this.keyCodes = _keyCodes_;
    });
  }

  render(): void {
    this.renderFromTemplate('<form name="form"><div name="expirationDate" wix-payment-expiration-date ng-model="expirationDate"></div></form>');
  }

  findInputByDataHookAsJQuery(dataHookValue): JQuery {
    return $(`input[data-hook='${dataHookValue}']`);
  }

  findElementByDataHookAsJQuery(dataHookValue): JQuery {
    return $(`[data-hook='${dataHookValue}']`);
  }

  getExpirationDateDefaultStateComponent(): HTMLElement {
    return this.findInputByDataHookAsJQuery('expiration-date-default')[0];
  }

  getExpirationDateActiveStateComponent(): HTMLElement {
    return this.findElementByDataHookAsJQuery('expiration-date-active')[0];
  }

  getExpirationMonth(): JQuery {
    return this.findInputByDataHookAsJQuery('expiration-month');
  }

  getExpirationYear(): JQuery {
    return this.findInputByDataHookAsJQuery('expiration-year');
  }

  fillExpirationMonth(value: string): void {
    this.getExpirationDateDefaultStateComponent().focus();
    this.fillInput(this.getExpirationMonth(), value);
  }

  fillExpirationYear(value: string): void {
    this.getExpirationDateDefaultStateComponent().focus();
    this.fillInput(this.getExpirationYear(), value);
  }

  fillInput(input: JQuery, value: string): void {
    input.val(value).change();
  }

  setFocusOnExpirationMonth(): void {
    $('#creditCardMonth').focus();
  }

  setFocusOnExpirationYear(): void {
    $('#creditCardYear').focus();
  }

  triggerRightArrowKeydownEventOnExpirationMonth(): void {
    this.triggerKeydownEvent(this.getExpirationMonth(), this.keyCodes.rightArrow);
  }

  triggerDeleteKeydownEventOnExpirationMonth(): void {
    this.triggerKeydownEvent(this.getExpirationMonth(), this.keyCodes.delete);
  }

  triggerSpaceKeydownEventOnExpirationMonth(): void {
    this.triggerKeydownEvent(this.getExpirationMonth(), this.keyCodes.space);
  }

  triggerLeftArrowKeydownEventOnExpirationYear(): void {
    this.triggerKeydownEvent(this.getExpirationYear(), this.keyCodes.leftArrow);
  }

  triggerBackspaceKeydownEventOnExpirationYear(): void {
    this.triggerKeydownEvent(this.getExpirationYear(), this.keyCodes.backspace);
  }

  triggerNineDigitKeypressEventOnExpirationMonth(): void {
    const digitNineKeyCode = 57;
    this.triggerKeypressEvent(this.getExpirationMonth(), digitNineKeyCode);
  }

  triggerEnterKeypressEventOnExpirationMonth() {
    const enterKeyCode = 13;
    this.triggerKeypressEvent(this.getExpirationMonth(), enterKeyCode);
  }

  triggerKeydownEvent(input: JQuery, keyCode: number): void {
    const keydownEventName = 'keydown';
    this.triggerEvent(input, keyCode, keydownEventName);
  }

  triggerKeypressEvent(input: JQuery, keyCode: number): void {
    const keypressEventName = 'keypress';
    this.triggerEvent(input, keyCode, keypressEventName);
  }

  triggerEvent(input: JQuery, keyCode: number, eventName: string): void {
    let event = jQuery.Event(eventName);
    event.keyCode = keyCode;
    input.trigger(event);
  }

  setCaretAtStartPositionOfExpirationYear(): void {
    this.getExpirationYear()[0]['selectionStart'] = 0;
  }
}
