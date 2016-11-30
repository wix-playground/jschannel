'use strict';

class WatchElementResize {
  onSizeChange: Function;
  /* @ngInject */
  constructor($scope: ng.IScope, $element: ng.IAugmentedJQuery, $document, $timeout) {
    let lastCheckHeight = 0;
    // get the right body height - http://stackoverflow.com/a/1147768/4088617
    let setHeight = () => {
      let body = $document[0].body;
      let html = $document[0].documentElement;

      let height = Math.max(body.offsetHeight, html.offsetHeight);
      if (lastCheckHeight !== height) {
        lastCheckHeight = height;
        this.onSizeChange({ height: height });
      }
      return height;
    };

    $scope.$watch(function() {
      $timeout(setHeight, 0, false);
    });
  }
}

angular
  .module('paymentAppInternal')
  .directive('watchElementResize', ($document, $window) => {
    return {
      controller: WatchElementResize,
      controllerAs: 'watchElementResize',
      bindToController: true,
      scope: {
        onSizeChange: '&'
      },
      restrict: 'A'
    };
  });
