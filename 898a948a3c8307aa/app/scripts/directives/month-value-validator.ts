'use strict';

class MonthValueValidatorCtrl {
  /* @ngInject */
  constructor(private $element) {
    let ngModelCtrl = <ng.INgModelController> $element.controller('ngModel');
    ngModelCtrl.$validators['month-value-validator'] = (modelValue, viewValue) => {
      return (Number(modelValue) >= 1 && Number(modelValue) <= 12);
    };
  }
}

angular
  .module('paymentAppInternal')
  .directive('monthValueValidator', () => {
    return {
      controller: MonthValueValidatorCtrl,
      restrict: 'A'
    };
  });
