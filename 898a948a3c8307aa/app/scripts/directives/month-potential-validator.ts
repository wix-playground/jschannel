'use strict';

class MonthPotentialValidatorCtrl {
  /* @ngInject */
  constructor(private $element) {
    let ngModelCtrl = <ng.INgModelController> $element.controller('ngModel');
    ngModelCtrl.$validators['month-potential-validator'] = (modelValue, viewValue) => {
      return /^$|^[0-1]$|^0[1-9]$|^1[0-2]$/.test(viewValue);
    };
  }
}

angular
  .module('paymentAppInternal')
  .directive('monthPotentialValidator', () => {
    return {
      controller: MonthPotentialValidatorCtrl,
      restrict: 'A'
    };
  });
