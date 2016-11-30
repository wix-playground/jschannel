'use strict';

describe('Component: siteGeneratorStaticsMetadataApp', () => {
  let scope: ng.IScope;
  let $q: ng.IQService;
  let BackendContentElement;
  let BackendLayoutPreset;
  let BackendTheme;
  let BackendVerticalDefaultValue;

  let staticContentElementArr: any[];

  beforeEach(function () {
    module('siteGeneratorStaticsMetadataAppInternal');
    module('siteGeneratorStaticsMetadataApp');
  });

  beforeEach(function () {
    inject(function ($injector) {
      BackendContentElement = $injector.get('BackendContentElement');
      BackendLayoutPreset = $injector.get('BackendLayoutPreset');
      BackendTheme = $injector.get('BackendTheme');
      BackendVerticalDefaultValue = $injector.get('BackendVerticalDefaultValue');
      $q = $injector.get('$q');
      staticContentElementArr = $injector.get('staticContentElementsArr');
    });
  });

  beforeEach(inject(($rootScope: ng.IRootScopeService) => {
    scope = $rootScope.$new();
  }));

  it('should load non-empty content element static data const', () => {
    expect(staticContentElementArr.length).toBeGreaterThan(0);
  });

  it('should load non-empty static data', (done: any) => {
    var all: any = [BackendContentElement, BackendLayoutPreset, BackendTheme, BackendVerticalDefaultValue].map(function (backendObj) {
      return backendObj.search().then((res) => {
        expect(res.length).toBeGreaterThan(0);
        expect(res[0].id.length).toBe(24);
      });
    });
    $q.all(all).then(done, done.fail);
    scope.$digest();
  });

});
