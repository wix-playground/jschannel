'use strict';

describe('Directive: expirationDate', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;
  let freezedNow: Function;

  beforeEach(function () {
    module('paymentAppInternal');

    module(($provide) => {
      $provide.value('now', () => new Date(2015, 5, 5));
    });

  });

  beforeEach(inject(($rootScope: ng.IRootScopeService, now: Function) => {
    scope = $rootScope.$new();
    freezedNow = now;
  }));

  it('should update model according to ui changes', inject(($compile: ng.ICompileService) => {
    //scope['expirationDate'] = {};
    element = angular.element('<div name="expirationDate" expiration-date ng-model="expirationDate"></div>');
    element = $compile(element)(scope);
    scope.$digest();

    let monthSelectElement = angular.element(element.find('select')[0]);
    let yearSelectElement = angular.element(element.find('select')[1]);
    let year: number = freezedNow().getFullYear() + 1;

    monthSelectElement.val('number:3');
    monthSelectElement.change();

    yearSelectElement.val('number:' + year);
    yearSelectElement.change();
    //scope.$apply();

    expect(scope['expirationDate']['month']).toBe(3);
    expect(scope['expirationDate']['year']).toBe(year);
  }));

  it('should fail invalid expiration date', inject(($compile: ng.ICompileService) => {
    element = angular.element('<form name="form"><div name="expirationDate" expiration-date ng-model="expirationDate"></div></form>');
    element = $compile(element)(scope);
    scope.$digest();

    let monthSelectElement = angular.element(element.find('select')[0]);
    let yearSelectElement = angular.element(element.find('select')[1]);
    let currentYear: number = freezedNow().getFullYear();

    monthSelectElement.val('number:1');
    monthSelectElement.change();

    yearSelectElement.val('number:' + currentYear);
    yearSelectElement.change();

    let form = scope['form'];

    expect(form.expirationDate.$error).toEqual({ 'future_expiration_date': true });
  }));

  it('should pass current month/year expiration date', inject(($compile: ng.ICompileService) => {
    element = angular.element('<form name="form"><div name="expirationDate" expiration-date ng-model="expirationDate"></div></form>');
    element = $compile(element)(scope);
    scope.$digest();

    let monthSelectElement = angular.element(element.find('select')[0]);
    let yearSelectElement = angular.element(element.find('select')[1]);
    let currentYear: number = freezedNow().getFullYear();

    monthSelectElement.val('number:' + (freezedNow().getMonth() + 1));
    monthSelectElement.change();

    yearSelectElement.val('number:' + currentYear);
    yearSelectElement.change();

    let form = scope['form'];

    expect(form.expirationDate.$error).toEqual({ });
  }));

  it('should pass valid expiration date', inject(($compile: ng.ICompileService) => {
    element = angular.element('<form name="form"><div name="expirationDate" expiration-date ng-model="expirationDate"></div></form>');
    element = $compile(element)(scope);
    scope.$digest();

    let monthSelectElement = angular.element(element.find('select')[0]);
    let yearSelectElement = angular.element(element.find('select')[1]);
    let nextYear: number = freezedNow().getFullYear() + 1;

    monthSelectElement.val('number:1');
    monthSelectElement.change();

    yearSelectElement.val('number:' + nextYear);
    yearSelectElement.change();

    let form = scope['form'];

    expect(form.expirationDate.$error).toEqual({ });
  }));

  it('should update view according to model value', inject(($compile: ng.ICompileService) => {
    element = angular.element('<form name="form"><div name="expirationDate" expiration-date ng-model="expirationDate"></div></form>');

    element = $compile(element)(scope);
    scope.$digest();
    scope['expirationDate'] = { 'month': 10, 'year': 2022 };
    scope.$apply();

    let monthSelectElement = angular.element(element.find('select')[0]).find('option:selected');
    let yearSelectElement = angular.element(element.find('select')[1]).find('option:selected');

    expect(monthSelectElement.text()).toEqual('10');
    expect(yearSelectElement.text()).toEqual('2022');
  }));
});
