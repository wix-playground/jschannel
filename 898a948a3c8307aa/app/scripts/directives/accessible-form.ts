'use strict';

angular
  .module('paymentAppInternal')
  .directive('accessibleForm', () => {
    return {
      restrict: 'A',
      link: (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs) => {
        elem.on('submit', function() {

          // find the first invalid element
          var firstInvalid = elem[0].querySelector('.ng-invalid');
          // if we find one, set focus
          if (firstInvalid) {
            if (firstInvalid.getAttribute('name') === 'expirationDate') {
              firstInvalid = firstInvalid.querySelector('.focus-on-invalid-date');
            }
            firstInvalid['focus']();
          }
        });
      }
    };
  });
