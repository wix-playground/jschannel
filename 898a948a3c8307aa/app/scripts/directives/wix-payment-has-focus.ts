'use strict';

class WixPaymentHasFocus {

  /* @ngInject */
  constructor(private $element: ng.IAugmentedJQuery) {

    const focusedClassName = 'has-focus';

    let childInput = $element.find('input');

    childInput.focus(() => {
      $element.addClass(focusedClassName);
    });

    childInput.blur(() => {
      $element.removeClass(focusedClassName);
    });
  }
}

angular
  .module('paymentAppInternal')
  .directive('wixPaymentHasFocus', () => ({
    controller: WixPaymentHasFocus,
    controllerAs: 'wixPaymentHasFocus',
    bindToController: true,
    restrict: 'A'
  }));
