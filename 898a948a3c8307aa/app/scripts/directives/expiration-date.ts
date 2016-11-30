'use strict';

angular.module('paymentAppInternal').value('now', function() {
  return new Date();
});

class ExpirationDate {
  months: number[];

  /* @ngInject */
  constructor($scope: ng.IScope, $element: ng.IAugmentedJQuery, private $locale: ng.ILocaleService, public now: Function) {
  }

  getCurrentYear(): number {
    return this.now().getFullYear();
  }
}

angular
  .module('paymentAppInternal')
  .directive('expirationDate', (now: Function) => {
    return {
      templateUrl: 'views/expiration-date.preload.html',
      controller: ExpirationDate,
      controllerAs: 'expirationDate',
      bindToController: true,
      restrict: 'A',
      require: 'ngModel',
      link: (scope: ng.IScope, iElement: ng.IAugmentedJQuery, iAttrs: ng.IAttributes, ngModelCtrl) => {

        scope.$watchGroup(['expirationDate.month', 'expirationDate.year'], () => {
          if (angular.isDefined(scope['expirationDate']) && scope['expirationDate']['month'] > 0 && scope['expirationDate']['year'] > 0) {
            ngModelCtrl.$setViewValue({ year: scope['expirationDate']['year'], month: scope['expirationDate']['month']});
          }
        });

        ngModelCtrl.$render = () => {
          this.month = angular.isDefined(ngModelCtrl.$modelValue) ? ngModelCtrl.$modelValue.month : '';
          this.year = angular.isDefined(ngModelCtrl.$modelValue) ? ngModelCtrl.$modelValue.year : '';
        };

        ngModelCtrl.$validators.future_expiration_date = (modelValue, viewValue) => {
          if (!angular.isDefined(modelValue)) {
            return false;
          }
          if (!angular.isDefined(modelValue.month) || !angular.isDefined(modelValue.year) || modelValue.month === '' || modelValue.year === '') {
            return false;
          }
          if (modelValue.year > 0 && modelValue.month > 0 && now().getFullYear() === modelValue.year && now().getMonth() + 1 > modelValue.month) {
            return false;
          }
          return true;
        };
      }
    };
  });
