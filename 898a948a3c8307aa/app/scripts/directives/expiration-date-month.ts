'use strict';

class ExpirationDateMonthCtrl {

  validateFullDate: () => void;
  onMonthBlur: () => void;
  expirationMonth: number;
  isFocused: boolean;
  onRightArrowKeydown: () => void;
  onDeleteKeydown: () => void;
  onSpaceKeydown: () => void;
  onKeypressAtInputEnd: (data: { event: JQueryKeyEventObject }) => void;
  isActive: boolean;

  componentOperations: {
    focus: () => void;
    focusAtEndPosition: () => void;
  };

  /* @ngInject */
  constructor(private $element: ng.IAugmentedJQuery, private $timeout: ng.ITimeoutService, private keyCodes: KeyCodes, private domEventHelper: DomEventHelper) {
    this.isFocused = false;
    this.initComponentOperations();
  }

  initComponentOperations() {
    let thisHtmlMonthInput = this.$element.find('input');
    this.componentOperations.focus = () => {
      thisHtmlMonthInput.focus();
    };
    this.componentOperations.focusAtEndPosition = () => {
      thisHtmlMonthInput.focus();
      thisHtmlMonthInput[0].selectionStart = 2;
    };
  }

  onBlur() {
    this.isFocused = false;
    this.$timeout(() => {
      this.onMonthBlur();
    }, 0);
  }

  onKeyup() {
    this.validateFullDate();
  }

  onKeypress($event: JQueryKeyEventObject) {
    if ($event.target.selectionStart === 2) {
      this.onKeypressAtInputEnd({event: $event});
    }
  }

  onFocus() {
    this.isFocused = true;
  }

  onKeydown(event: JQueryKeyEventObject) {

    if (event.target.selectionStart === 2) {

      let needToCancelEvent = false;

      switch (event.keyCode) {
        case this.keyCodes.rightArrow:
          this.onRightArrowKeydown();
          needToCancelEvent = true;
          break;
        case this.keyCodes.delete:
          this.onDeleteKeydown();
          needToCancelEvent = true;
          break;
        case this.keyCodes.space:
          this.onSpaceKeydown();
          needToCancelEvent = true;
          break;
      }

      if (needToCancelEvent) {
        return this.domEventHelper.cancelEvent(event);
      }
    }
  }
}

angular
  .module('paymentAppInternal')
  .directive('expirationDateMonth', () => {
    return {
      template: `<input type="text"
                        pattern="[0-9]*"
                        name="creditCardMonth"
                        id="creditCardMonth"
                        maxlength="2"
                        class="expiration-month"
                        autocomplete="off"
                        placeholder="MM"
                        size="2"
                        ng-model="expirationDateMonthCtrl.expirationMonth"
                        ng-model-options="{allowInvalid: true}"
                        month-view-parser-model-formatter
                        month-potential-validator
                        month-value-validator
                        on-month-input-set="expirationDateMonthCtrl.onMonthSet()"
                        ng-blur="expirationDateMonthCtrl.onBlur()"
                        ng-keyup="expirationDateMonthCtrl.onKeyup()"
                        ng-keydown="expirationDateMonthCtrl.onKeydown($event)"
                        ng-keypress="expirationDateMonthCtrl.onKeypress($event)"
                        ng-focus="expirationDateMonthCtrl.onFocus()"
                        ng-class="{'focus-on-invalid-date': expirationDateMonthCtrl.isActive}"
                        data-hook="expiration-month" />`,
      scope: {
        expirationMonth: '=ccExpirationMonth',
        onMonthBlur: '&',
        validateFullDate: '&',
        onMonthSet: '&onMonthSet',
        isFocused: '=',
        onRightArrowKeydown: '&',
        onDeleteKeydown: '&',
        onSpaceKeydown: '&',
        onKeypressAtInputEnd: '&',
        componentOperations: '=',
        isActive: '='
      },
      controller: ExpirationDateMonthCtrl,
      controllerAs: 'expirationDateMonthCtrl',
      bindToController: true,
      restrict: 'E'
    };
  });
