'use strict';

class YearValueValidatorCtrl {
  /* @ngInject */
  constructor(private $element) {
    let ngModelCtrl = <ng.INgModelController> $element.controller('ngModel');
    ngModelCtrl.$validators['year-value-validator'] = (modelValue, viewValue) => {
      return /^[0-9][0-9]$/.test(viewValue);
    };
  }
}

angular
  .module('paymentAppInternal')
  .directive('yearValueValidator', () => {
    return {
      controller: YearValueValidatorCtrl,
      restrict: 'A'
    };
  });
