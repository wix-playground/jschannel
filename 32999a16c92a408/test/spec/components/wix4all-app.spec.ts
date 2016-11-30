/// <reference path="../../../reference.ts" />
'use strict';

describe('Component: wix4allApp', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;

  beforeEach(function () {
    module('wix4allAppInternal');
  });

  beforeEach(inject(($rootScope: ng.IRootScopeService) => {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(($compile: ng.ICompileService) => {
    element = angular.element('<wix4all-app name="\'kukuchumuku\'"></wix4all-app>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.text()).toContain('This is kukuchumuku (0)');
  }));
});
