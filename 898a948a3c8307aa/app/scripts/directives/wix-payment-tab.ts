'use strict';

class WixPaymentTab {

  /* @ngInject */
  constructor() {
    //
  }
}

angular
  .module('wixPaymentTab', [])
  .directive('wixPaymentTab', () => {
    return {
      template: '<div ng-transclude ng-if="wixPaymentTab.active"></div>',
      controller: WixPaymentTab,
      controllerAs: 'wixPaymentTab',
      scope: {
        header: '@',
        customClass: '@',
        paymentMethod: '@',
        useThisPaymentMethod: '='
      },
      bindToController: true,
      restrict: 'E',
      transclude: true,
      require: '^wixPaymentTabset',
      link: (scope: any, elem: ng.IAugmentedJQuery, attrs, tabsetCtrl) => {
        tabsetCtrl.addTab(scope);

        let unwatch = scope.$watch('wixPaymentTab.useThisPaymentMethod', (newVal) => {
          if (newVal !== undefined) {
            scope['wixPaymentTab'].active = newVal;
            if (newVal) {
              tabsetCtrl.useThisPaymentMethod(scope);
            }
            unwatch();
          }
        });
      }
    };
  });
