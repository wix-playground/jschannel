'use strict';

class ExpirationDateYearCtrl {

  validateFullDate: () => void;
  onYearBlur: () => void;
  expirationYear: number;
  isFocused: boolean;
  onLeftArrowKeydown: () => void;
  onBackspaceKeydown: () => void;

  componentOperations: {
    focus: () => void
    focusAtStartPosition: () => void;
    focusAtFirstPosition: () => void;
  };

  /* @ngInject */
  constructor(private $element: ng.IAugmentedJQuery, private $timeout: ng.ITimeoutService, private keyCodes: KeyCodes, private domEventHelper: DomEventHelper) {
    this.isFocused = false;
    this.initComponentOperations();
  }

  initComponentOperations() {
    let thisHtmlYearInput = this.$element.find('input');

    this.componentOperations.focus = () => {
      thisHtmlYearInput.focus();
    };

    this.componentOperations.focusAtStartPosition = () => {
      thisHtmlYearInput.focus();
      thisHtmlYearInput[0].selectionStart = 0;
      thisHtmlYearInput[0].selectionEnd = 0;
    };

    this.componentOperations.focusAtFirstPosition = () => {
      thisHtmlYearInput.focus();
      thisHtmlYearInput[0].selectionStart = 1;
      thisHtmlYearInput[0].selectionEnd = 1;
    };
  }

  onBlur() {
    this.isFocused = false;
    this.$timeout(() => {
      this.onYearBlur();
    }, 0);
  }

  onKeyup() {
    this.validateFullDate();
  }

  onKeydown(event: JQueryKeyEventObject) {

    if (event.target.selectionStart === 0) {

      let needToCancelEvent = false;

      switch (event.keyCode) {
        case this.keyCodes.leftArrow:
          this.onLeftArrowKeydown();
          needToCancelEvent = true;
          break;
        case this.keyCodes.backspace:
          this.onBackspaceKeydown();
          needToCancelEvent = true;
          break;
      }

      if (needToCancelEvent) {
        return this.domEventHelper.cancelEvent(event);
      }
    }
  }

  onFocus() {
    this.isFocused = true;
  }

}

angular
  .module('paymentAppInternal')
  .directive('expirationDateYear', () => {
    return {
      template: `<input type="text"
                        pattern="[0-9]*"
                            name="creditCardYear"
                            id="creditCardYear"
                            maxlength="2"
                            class="expiration-year"
                            autocomplete="off"
                            placeholder="YY"
                            size="2"
                            ng-model="expirationDateYearCtrl.expirationYear"
                            ng-model-options="{allowInvalid: true}"
                            expiration-date-year-model
                            year-potential-validator
                            year-value-validator
                            ng-blur="expirationDateYearCtrl.onBlur()"
                            ng-keyup="expirationDateYearCtrl.onKeyup()"
                            ng-keydown="expirationDateYearCtrl.onKeydown($event)"
                            ng-focus="expirationDateYearCtrl.onFocus()"
                            data-hook="expiration-year" />`,
      scope: {
        expirationYear: '=ccExpirationYear',
        validateFullDate: '&',
        onYearBlur: '&',
        componentOperations: '=',
        isFocused: '=',
        onLeftArrowKeydown: '&',
        onBackspaceKeydown: '&'
      },
      controller: ExpirationDateYearCtrl,
      controllerAs: 'expirationDateYearCtrl',
      bindToController: true,
      restrict: 'E'
    };
  });
