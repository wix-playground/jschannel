'use strict';

describe('Directive: watchElementResize', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;

  let document = [{
    body: {
      offsetHeight: 1000
    },
    documentElement: {
      offsetHeight: 900
    }
  }];
  document['find'] = false;

  beforeEach(function () {
    module('paymentAppInternal');

    module(function($provide) {
      $provide.service('$document', function() {
        return document;
      });
    });
  });

  beforeEach(inject(($rootScope: ng.IRootScopeService) => {
    scope = $rootScope.$new();
  }));

  it('should report size change', inject(($compile: ng.ICompileService, $timeout) => {
    scope['sizeChanged'] = () => {
      return;
    };
    spyOn(scope, 'sizeChanged').and.callThrough();
    element = angular.element('<div watch-element-resize on-size-change="sizeChanged(height)"></div>');
    element = $compile(element)(scope);
    scope.$digest();
    $timeout.flush(1);
    expect(scope['sizeChanged']).toHaveBeenCalledWith(1000);
  }));

  it('should report size change only when size changed', inject(($compile: ng.ICompileService, $timeout) => {
    scope['sizeChanged'] = () => {
      return;
    };
    spyOn(scope, 'sizeChanged').and.callThrough();
    element = angular.element('<div watch-element-resize on-size-change="sizeChanged(height)"></div>');
    element = $compile(element)(scope);
    scope.$digest();
    $timeout.flush(1);
    expect(scope['sizeChanged']).toHaveBeenCalledWith(1000);
    scope.$digest();
    $timeout.flush(1);
    expect(scope['sizeChanged'].calls.count()).toBe(1);
    document[0].body.offsetHeight = 1200;
    scope.$digest();
    $timeout.flush(1);
    expect(scope['sizeChanged']).toHaveBeenCalledWith(1200);
    expect(scope['sizeChanged'].calls.count()).toBe(2);
  }));
});
