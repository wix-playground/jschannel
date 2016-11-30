'use strict';

class MonthViewParserModelFormatterCtrl {

  zeroPadding(n: number): string {
    return '0' + n;
  }

  /* @ngInject */
  constructor(private $element) {
    let ngModelCtrl = <ng.INgModelController> $element.controller('ngModel');

    ngModelCtrl.$parsers.push((viewValue: string) => {
      if ((viewValue.length === 1) && Number(viewValue) >= 2 && Number(viewValue) <= 9) {
        ngModelCtrl.$setViewValue(this.zeroPadding(Number(viewValue)));
        ngModelCtrl.$render();
      }
      return Number(viewValue);
    });

    ngModelCtrl.$formatters.push((modelValue: number) => {
      if (modelValue === undefined) {
        return '';
      }
      if (modelValue >= 1 && modelValue <= 9) {
        return this.zeroPadding(modelValue);
      }
      return '' + modelValue;
    });
  }
}

angular
  .module('paymentAppInternal')
  .directive('monthViewParserModelFormatter', () => {
    return {
      controller: MonthViewParserModelFormatterCtrl,
      restrict: 'A'
    };
  });
