'use strict';

class PlaceholderWhenOutOfFocus {

  /* @ngInject */
  constructor() {
    //
  }
}

angular
  .module('paymentAppInternal')
  .directive('placeholderWhenOutOfFocus', () => ({
    controller: PlaceholderWhenOutOfFocus,
    controllerAs: 'placeholderWhenOutOfFocus',
    bindToController: true,
    restrict: 'A',
    link: (scope, element: ng.IAugmentedJQuery, attr: any) => {
      let placeholder = attr.placeholderWhenOutOfFocus;
      element.attr('placeholder', placeholder);

      element.focus(() => {
        element.attr('placeholder', '');
      });

      element.blur(() => {
        element.attr('placeholder', placeholder);
      });
    }
  }));
