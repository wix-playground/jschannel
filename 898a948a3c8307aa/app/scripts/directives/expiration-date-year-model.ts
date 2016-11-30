'use strict';

class ExpirationDateYearModelCtrl {
  /* @ngInject */
  constructor(private $element: ng.IAugmentedJQuery) {
    let ngModelCtrl = <ng.INgModelController> $element.controller('ngModel');

    ngModelCtrl.$parsers.push((viewValue: string) => {
      let intViewValue = parseInt(viewValue, 10);
      if (isNaN(intViewValue)) {
        return viewValue;
      }
      return 2000 + intViewValue;
    });

    ngModelCtrl.$formatters.push((modelValue: number) => {
      if (modelValue === undefined) {
        return '';
      }

      if (isNaN(modelValue)) {
        return modelValue;
      }

      return (modelValue % 100);
    });
  }
}

angular
  .module('paymentAppInternal')
  .directive('expirationDateYearModel', () => {
    return {
      controller: ExpirationDateYearModelCtrl,
      require: 'ngModel',
      restrict: 'A'
    };
  });
