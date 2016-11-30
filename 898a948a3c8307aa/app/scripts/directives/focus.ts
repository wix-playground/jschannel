'use strict';

angular
  .module('paymentAppInternal')
  .directive('focus', ($timeout) => {
    return {
      restrict: 'A',
      link: (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs) => {
        $timeout(function() {
          elem[0].focus();
        });
      }
    };
  });
