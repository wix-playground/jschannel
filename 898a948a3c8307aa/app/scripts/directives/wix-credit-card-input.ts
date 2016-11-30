'use strict';

class WixCreditCardInput {
  isCardError: boolean;
  networkTypeClass: string;
  creditCardNumber: string;

  /* @ngInject */
  constructor(private $filter: ng.IFilterService, private creditCard: CreditCard) {
    this.isCardError = true;
    this.networkTypeClass = 'none';
  }

  onCardError() {
    this.isCardError = true;
  }

  onCardSuccess() {
    this.isCardError = false;
  }

  onBlur() {
    if (this.isCardError && this['cardError']) {
      this['cardError']();
      this.networkTypeClass = 'none';
    } else {
      this.networkTypeClass = this.creditCard.getType(this.creditCardNumber.replace(/-/g, ''));
    }
  }
}

angular
  .module('paymentAppInternal')
  .directive('wixCreditCardInput', () => {
    return {
      template: `<span ng-class="wixCreditCardInput.networkTypeClass" class="credit-card-container">
                  <input type="text"
                    id="cardNumber"
                    pattern="[0-9,-]*"
                    ng-blur=wixCreditCardInput.onBlur()
                    autocomplete="off"
                    id="cardNumber"
                    ng-model="wixCreditCardInput.creditCardNumber"
                    placeholder-when-out-of-focus="{{'payment.enterCreditCardNumber' | translate}}"
                    card-error="wixCreditCardInput.onCardError()"
                    card-success="wixCreditCardInput.onCardSuccess()"
                    data-hook="payment-iframe-card-number"
                    name="cardNumber"
                    focus
                    ng-model-options='{ allowInvalid: true }'
                    credit-card-validator
                    required />
                </span>`,
      controller: WixCreditCardInput,
      controllerAs: 'wixCreditCardInput',
      bindToController: true,
      scope: {
        cardError: '&'
      },
      restrict: 'E',
      require: 'ngModel',
      link: (scope, element, attrs, ngModelController: ng.INgModelController) => {

        let that = scope['wixCreditCardInput'];

        let isViewValueChangedProgrammatically = false;
        scope.$watch('wixCreditCardInput.creditCardNumber', (newVal, oldVal) => {

          if (!newVal) {
            return;
          }

          if (isViewValueChangedProgrammatically) {
            isViewValueChangedProgrammatically = false;
            return;
          }

          if (angular.isDefined(scope['wixCreditCardInput']['creditCardNumber'])) {

            let noDashVal = newVal.replace(/[-]+/g, '');
            let maskedVal = that.$filter('creditCardMask')(noDashVal);
            if (maskedVal !== newVal) {
              isViewValueChangedProgrammatically = true;
            }
            scope['wixCreditCardInput']['creditCardNumber'] = maskedVal;
            scope['wixCreditCardInput']['networkTypeClass'] = that.creditCard.getType(maskedVal.replace(/-/g, ''));
            ngModelController.$setViewValue(maskedVal);
          }
        });

        ngModelController.$render = () => {
          scope['wixCreditCardInput']['creditCardNumber'] = angular.isDefined(ngModelController.$modelValue) ? ngModelController.$modelValue : '';
        };

        ngModelController.$parsers.unshift((data) => {
          return data.replace(/[^0-9]/g, '');
        });
      }
    };
  });
