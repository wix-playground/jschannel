'use strict';

describe('Directive: wixPaymentExpirationDate', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;
  let freezedNow: () => Date;
  let freezedYear: () => number;
  let $compile: ng.ICompileService;
  let $timeout: ng.ITimeoutService;
  let monthSelectElement: any;
  let yearSelectElement: any;

  beforeEach(function () {
    module('paymentAppInternal');

    module(($provide) => {
      $provide.value('now', () => new Date(2015, 5, 5));
    });
  });

  beforeEach(inject(($rootScope: ng.IRootScopeService, now: () => Date, _$compile_: ng.ICompileService, _$timeout_: ng.ITimeoutService) => {
    scope = $rootScope.$new();
    freezedNow = now;
    freezedYear = () => {
      return now().getFullYear() - 2000;
    };

    $compile = _$compile_;
    $timeout = _$timeout_;

    element = angular.element('<form name="form"><div name="expirationDate" wix-payment-expiration-date ng-model="expirationDate"></div></form>');
    element = $compile(element)(scope);
    scope.$digest();
    monthSelectElement = angular.element(element.find('input')[0]);
    yearSelectElement = angular.element(element.find('input')[1]);

  }));

  it('should update model according to ui changes', () => {
    let year: number = freezedYear() + 1;

    monthSelectElement.val('3');
    monthSelectElement.change();

    yearSelectElement.val(year + '');
    yearSelectElement.change();

    expect(scope['wixPaymentCreditCardForm']['expirationDate']['month']).toBe(3);
    expect(scope['wixPaymentCreditCardForm']['expirationDate']['year']).toBe(year + 2000);
  });

  it('should fail invalid expiration date - this year + older month', () => {
    let currentYear: number = freezedYear();

    monthSelectElement.val('1');
    monthSelectElement.change();

    yearSelectElement.val('' + currentYear);
    yearSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({'future_expiration_date': true});
  });

  it('should fail invalid expiration date - past year', () => {
    let currentYear: number = freezedYear();

    monthSelectElement.val('1');
    monthSelectElement.change();

    yearSelectElement.val('' + (currentYear - 1));
    yearSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({'future_expiration_date': true, has_future_potential: true});
  });

  it('should fail empty expiration month', () => {
    let currentYear: number = freezedYear();

    yearSelectElement.val('' + currentYear);
    yearSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({'future_expiration_date': true});
  });

  it('should fail invalid expiration month', () => {
    let currentYear: number = freezedYear();

    monthSelectElement.val('13');
    monthSelectElement.change();

    yearSelectElement.val(currentYear + 1 + '');
    yearSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({'future_expiration_date': true, has_future_potential: true});

  });

  it('should fail empty expiration year', () => {
    monthSelectElement.val('1');
    monthSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({'future_expiration_date': true});
  });

  it('should pass for every valid change', () => {
    let currentYear: number = freezedYear();

    monthSelectElement.val('1');
    monthSelectElement.change();
    yearSelectElement.val(currentYear + '');
    yearSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];

    expect(form.expirationDate.$error).toEqual({'future_expiration_date': true});

    monthSelectElement.val('6');
    monthSelectElement.change();
    monthSelectElement.triggerHandler('keyup');

    expect(form.expirationDate.$error).toEqual({});
  });

  it('should pass future expiration date', () => {
    let currentYear: number = freezedYear();

    monthSelectElement.val('' + (freezedNow().getMonth() + 1));
    monthSelectElement.change();

    yearSelectElement.val(currentYear + 1 + '');
    yearSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({});
  });

  it('should pass current month+year expiration date', () => {
    let currentYear: number = freezedYear();

    monthSelectElement.val('' + (freezedNow().getMonth() + 1));
    monthSelectElement.change();

    yearSelectElement.val('' + currentYear);
    yearSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({});
  });

  it('should update view according to model value', () => {
    scope['wixPaymentCreditCardForm'] = {expirationDate: {'month': 10, 'year': 22}};
    scope.$apply();
    scope.$digest();
    let monthSelectVal = angular.element(element.find('input')[0]).val();
    let yearSelectVal = angular.element(element.find('input')[1]).val();

    expect(monthSelectVal).toEqual('10');
    expect(yearSelectVal).toEqual('22');
  });

  it('should update view according to model value', () => {
    scope['wixPaymentCreditCardForm'] = {expirationDate: {'month': 10, 'year': 2022}};
    scope.$apply();
    scope.$digest();
    let monthSelectVal = angular.element(element.find('input')[0]).val();
    let yearSelectVal = angular.element(element.find('input')[1]).val();

    expect(monthSelectVal).toEqual('10');
    expect(yearSelectVal).toEqual('22');
  });

  it('should add 0 prefix to a month field if 2-9 was entered', () => {
    monthSelectElement.val('6');
    monthSelectElement.change();

    let displayedMonthString = angular.element(element.find('input')[0]).val();
    expect(displayedMonthString).toEqual('06');
  });

  it('should not fail if month has valid potential', () => {
    monthSelectElement.val('0');
    monthSelectElement.change();
    monthSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({future_expiration_date: true});
  });

  it('should fail if month has no valid potential', () => {
    monthSelectElement.val('X');
    monthSelectElement.change();
    yearSelectElement.triggerHandler('keyup');

    let form = scope['form'];
    expect(form.expirationDate.$error).toEqual({'future_expiration_date': true, has_future_potential: true});
  });
});
