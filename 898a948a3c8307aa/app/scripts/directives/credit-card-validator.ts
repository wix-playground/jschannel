'use strict';

class CreditCardValidator {
  /* @ngInject */
  constructor(private creditCard: CreditCard) {
    //
  }
}

angular
  .module('paymentAppInternal')
  .directive('creditCardValidator', ($parse) => {
    return {
      restrict: 'A',
      require: 'ngModel',
      controller: CreditCardValidator,
      controllerAs: 'creditCardValidator',
      link: (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs, ctrl: ng.INgModelController) => {
        function triggerSuccessEvent() {
          if (attrs.cardSuccess) {
            scope.$eval(attrs.cardSuccess);
          }
        }

        function triggerErrorEvent() {
          if (attrs.cardError) {
            scope.$eval(attrs.cardError);
          }
        }

        ctrl.$validators['luhn_check'] = function (modelValue, viewValue) {
          modelValue = modelValue ? modelValue.replace(/-/g, '') : modelValue; //TODO: move this to wix-credit-card-input
          if (ctrl.$pristine) {
            return true;
          }
          if (ctrl.$isEmpty(modelValue) || modelValue.toString().length < 8) { //TODO: should this 8 digit limit be here??
            triggerErrorEvent();
            return false;
          } else {
            if (!scope['creditCardValidator']['creditCard']['checkLuhn'](modelValue)) {
              triggerErrorEvent();
              return false;
            }
            triggerSuccessEvent();
            return true;
          }
        };

        ctrl.$validators['potential'] = (modelValue) => {

          if (!modelValue) {
            return true;
          }

          let regex = new RegExp('[^0-9,-]');
          return !regex.test(modelValue);
        };
      }
    };
  });
