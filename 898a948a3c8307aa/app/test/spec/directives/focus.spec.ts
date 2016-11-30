'use strict';

describe('Directive: focus', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;

  beforeEach(function () {
    module('paymentAppInternal');
  });

  beforeEach(inject(($rootScope: ng.IRootScopeService) => {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(($compile: ng.ICompileService, $timeout: ng.ITimeoutService) => {
    element = angular.element('<input type="text" focus></input>');
    element = $compile(element)(scope);
    spyOn(element[0], 'focus');
    $timeout.flush();
    expect(element[0].focus).toHaveBeenCalled();
  }));
});
