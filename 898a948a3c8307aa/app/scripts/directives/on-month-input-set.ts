'use strict';

class OnMonthInputSetCtrl {
  onMonthInputSet: () => void;
  /* @ngInject */
  constructor(private $element: ng.IAugmentedJQuery, private $attrs: any) {
    let ngModelCtrl = <ng.INgModelController> $element.controller('ngModel');
    ngModelCtrl.$viewChangeListeners.push(() => {
      if (ngModelCtrl.$viewValue.length === Number($attrs.maxlength)) {
        this.onMonthInputSet();
      }
    });
  }
}

angular
  .module('paymentAppInternal')
  .directive('onMonthInputSet', () => {
    return {
      scope: {
        onMonthInputSet: '&'
      },
      controller: OnMonthInputSetCtrl,
      controllerAs: 'onMonthInputSetCtrl',
      bindToController: true,
      restrict: 'A'
    };
  });
