'use strict';

class YearPotentialValidatorCtrl {
  /* @ngInject */
  constructor(private $element) {
    let ngModelCtrl = <ng.INgModelController> $element.controller('ngModel');
    ngModelCtrl.$validators['year-potential-validator'] = (modelValue, viewValue) => {
      return /^$|^[0-9]$|^[0-9][0-9]$/.test(viewValue);
    };
  }
}

angular
  .module('paymentAppInternal')
  .directive('yearPotentialValidator', () => {
    return {
      controller: YearPotentialValidatorCtrl,
      restrict: 'A'
    };
  });
