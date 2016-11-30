'use strict';

describe('Directive: creditCardValidator', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;

  beforeEach(function () {
    module('paymentAppInternal');
  });

  beforeEach(inject(($rootScope: ng.IRootScopeService) => {
    scope = $rootScope.$new();
  }));

  it('should pass valid credit card number', inject(($compile: ng.ICompileService) => {
    let validCreditCardNumber = '4222222222222';
    element = angular.element(
      '<form name="form"><input type="text" name="credit_card" ng-model="creditCard" credit-card-validator></form>'
    );
    scope['creditCard'] = validCreditCardNumber;
    element = $compile(element)(scope);
    scope.$digest();
    let form = scope['form'];

    expect(form.credit_card.$error).toEqual({});
  }));

  it('should not pass invalid credit card number', inject(($compile: ng.ICompileService) => {
    let invalidCreditCardNumber = '4222222222223';
    element = angular.element(
      '<form name="form"><input type="text" name="credit_card" ng-model="creditCard" credit-card-validator></form>'
      );
    //scope['creditCard'] = invalidCreditCardNumber;
    element = $compile(element)(scope);
    scope.$digest();
    let form = scope['form'];
    form.credit_card.$setViewValue(invalidCreditCardNumber);
    expect(form.credit_card.$error).toEqual({'luhn_check': true});
  }));

  it('should not pass invalid (short) credit card number', inject(($compile: ng.ICompileService) => {
    let invalidCreditCardNumber = '422';
    element = angular.element(
      '<form name="form"><input type="text" name="credit_card" ng-model="creditCard" credit-card-validator></form>'
      );
    //scope['creditCard'] = invalidCreditCardNumber;
    element = $compile(element)(scope);
    scope.$digest();
    let form = scope['form'];
    form.credit_card.$setViewValue(invalidCreditCardNumber);
    expect(form.credit_card.$error).toEqual({'luhn_check': true});
  }));

  it('should trigger "card-error" event when invalid credit card', inject(($compile: ng.ICompileService) => {
    let inValidCreditCardNumber = '4222222222223';
    element = angular.element(
      '<form name="form"><input type="text" name="credit_card" ng-model="creditCard" credit-card-validator card-error="cardError()"></form>'
      );
    element = $compile(element)(scope);
    scope.$digest();
    scope['cardError'] = () => {
      return;
    };
    spyOn(scope, 'cardError');
    let form = scope['form'];
    form.credit_card.$setViewValue(inValidCreditCardNumber);
    expect(scope['cardError']).toHaveBeenCalled();
  }));

  it('should not trigger "card-error" event when valid credit card', inject(($compile: ng.ICompileService) => {
    let validCreditCardNumber = '4222222222222';
    element = angular.element(
      '<form name="form"><input type="text" name="credit_card" ng-model="creditCard" credit-card-validator card-error="cardError()"></form>'
      );
    element = $compile(element)(scope);
    scope.$digest();
    scope['cardError'] = () => {
      return;
    };
    spyOn(scope, 'cardError');
    let form = scope['form'];
    form.credit_card.$setViewValue(validCreditCardNumber);
    expect(scope['cardError']).not.toHaveBeenCalled();
  }));

  it('should trigger "card-success" event when valid credit card', inject(($compile: ng.ICompileService) => {
    let validCreditCardNumber = '4222222222222';
    element = angular.element(
      '<form name="form"><input type="text" name="credit_card" ng-model="creditCard" credit-card-validator card-success="cardSuccess()"></form>'
    );
    element = $compile(element)(scope);
    scope.$digest();
    let spy = jasmine['createSpy']('cardSuccess');
    scope['cardSuccess'] = spy;
    let form = scope['form'];
    form.credit_card.$setViewValue(validCreditCardNumber);
    expect(scope['cardSuccess']).toHaveBeenCalled();
  }));
});
