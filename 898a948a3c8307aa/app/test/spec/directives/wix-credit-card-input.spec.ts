'use strict';

describe('Directive: wixCreditCardInput', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;

  beforeEach(function () {
    module('paymentAppInternal');
  });

  beforeEach(inject(($rootScope: ng.IRootScopeService) => {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(($compile: ng.ICompileService) => {
    element = angular.element('<wix-credit-card-input ng-model="ccNumber"></wix-credit-card-input>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.find('input').length).toBe(1);
  }));

  // it('should update model according to ui changes', inject(($compile: ng.ICompileService) => {
  //   let ccNumber = '422222222222';
  //   element = angular.element('<wix-credit-card-input ng-model="ccNumber"></wix-credit-card-input>');
  //   element = $compile(element)(scope);
  //   scope.$digest();
  //   let ccInput = angular.element(element.find('input')[0]);
  //   ccInput.val(ccNumber);
  //   ccInput.change();
  //   expect(scope['ccNumber']).toBe(ccNumber);
  // }));

  it('should update view according to model value', inject(($compile: ng.ICompileService) => {
    let ccNumber = '4222222222222';
    let ccNumberDashed = '4222-2222-2222-2';
    element = angular.element('<form name="form"><wix-credit-card-input ng-model="ccNumber"></wix-credit-card-input></form>');
    element = $compile(element)(scope);
    scope.$digest();
    scope['ccNumber'] = ccNumber;
    scope.$apply();
    let ccInput = angular.element(element.find('input')[0]);
    expect(ccInput.val()).toEqual(ccNumberDashed);
  }));

  it('should remove trailing "-"', inject(($compile: ng.ICompileService) => {
    let ccNumber = '422222222222';
    let ccNumberDashed = '4222-2222-2222';
    element = angular.element('<form name="form"><wix-credit-card-input ng-model="ccNumber"></wix-credit-card-input></form>');
    element = $compile(element)(scope);
    scope.$digest();
    scope['ccNumber'] = ccNumber;
    scope.$apply();
    let ccInput = angular.element(element.find('input')[0]);
    expect(ccInput.val()).toEqual(ccNumberDashed);
  }));

  // it('should add credit-card type class', inject(($compile: ng.ICompileService) => {
  //   let ccNumber = '4111111111111111';
  //   element = angular.element('<wix-credit-card-input ng-model="ccNumber"></wix-credit-card-input>');
  //   element = $compile(element)(scope);
  //   scope.$digest();
  //   let ccInput = $(element.find('input')[0]);
  //   ccInput.val(ccNumber);
  //   //ccInput.change();
  //   $(element[0][0]).blur();
  //   console.log(element[0].innerHTML);
  //   expect(element.hasClass('visa')).toBe(true);
  // }));

  // it('should trigger card error event', inject(($compile: ng.ICompileService) => {
  //   let wrongCcNumber = '4222222';
  //   //let spy = jasmine['createSpy']('onCardError');
  //   scope['onCardError'] = function() {
  //     console.log('error!!');
  //   };//spy;
  //   spyOn(scope, 'onCardError');
  //   element = angular.element('<wix-credit-card-input ng-model="ccNumber" card-error="onCardError()"></wix-credit-card-input>');
  //   element = $compile(element)(scope);
  //   scope.$digest();
  //   element.val(wrongCcNumber);
  //   let ccInput = angular.element(element.find('input')[0]);
  //   ccInput.val(wrongCcNumber);
  //   ccInput.change();
  //   expect(scope['onCardError']).toHaveBeenCalled();
  // }));

  // it('should focus', inject(($compile: ng.ICompileService, $timeout: ng.ITimeoutService) => {
  //   element = angular.element('<wix-credit-card-input focus="true"></wix-credit-card-input>');
  //   element = $compile(element)(scope);
  //   spyOn(element[0],'focus');

  //   scope.$digest();
  //   $timeout.flush();

  //   expect(element[0].focus).toHaveBeenCalled();
  // }));
});
