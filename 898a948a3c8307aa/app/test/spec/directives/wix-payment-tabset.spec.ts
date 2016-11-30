'use strict';

describe('Directive: wixPaymentTabset', () => {
  let element: ng.IAugmentedJQuery;
  let scope: ng.IScope;
  let compile: ng.ICompileService;

  function getHeaders() {
    return element.find('.tab-header');
  }

  function getTabAtIndex(index): ng.IAugmentedJQuery {
    return angular.element(element.find('.tab')[index]);
  }

  function getContent() {
    return element.find('wix-payment-tab');
  }

  function clickHeaderAtIndex(index) {
    angular.element(getHeaders()[index]).click();
  }

  function getContentTextAtIndex(index): string {
    return getContent()[index].innerText;
  }

  function createTwoTabsElement() {
    element = angular.element(`<wix-payment-tabset>
                                <wix-payment-tab custom-class="tab1-class" header="tab1-header">tab 1</wix-payment-tab>
                                <wix-payment-tab custom-class="tab2-class" header="tab2-header">tab 2</wix-payment-tab>
                               </wix-payment-tabset>`);
    compileAndDigest();
  }

  function createOneTabElement() {
    element = angular.element(`<wix-payment-tabset>
                                <wix-payment-tab custom-class="tab1-class" header="tab1-header">tab 1</wix-payment-tab>
                               </wix-payment-tabset>`);
    compileAndDigest();
  }

  function createTwoTabsWithSecondSelected() {
    element = angular.element(`<wix-payment-tabset>
                                <wix-payment-tab custom-class="tab1-class" header="tab1-header">tab 1</wix-payment-tab>
                                <wix-payment-tab custom-class="tab2-class" use-this-payment-method="true" header="tab2-header">tab 2</wix-payment-tab>
                               </wix-payment-tabset>`);
    compileAndDigest();
  }

  function compileAndDigest() {
    element = compile(element)(scope);
    scope.$digest();
  }

  function getBackButton() {
    return element.find('.wix-payment-tabset-back');
  }

  function clickBackButton() {
    getBackButton().click();
  }

  beforeEach(function () {
    module('wixPayment');
  });

  beforeEach(inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  it('should create titles', () => {
    createTwoTabsElement();
    expect(getHeaders().length).toBe(2);
  });

  it('should show correct headers', () => {
    createTwoTabsElement();
    expect(getHeaders()[0].innerText).toBe('tab1-header');
    expect(getHeaders()[1].innerText).toBe('tab2-header');
  });

  it('should show only selected tab\'s content - tab2', () => {
    createTwoTabsElement();
    clickHeaderAtIndex(1);
    expect(getContentTextAtIndex(0)).toBe('');
    expect(getContentTextAtIndex(1)).toBe('tab 2');
  });

  it('should show only selected tab\'s content - tab1', () => {
    createTwoTabsElement();
    clickHeaderAtIndex(0);
    expect(getContentTextAtIndex(0)).toBe('tab 1');
    expect(getContentTextAtIndex(1)).toBe('');
  });

  it('should select active tab', () => {
    createTwoTabsWithSecondSelected();
    expect(getContentTextAtIndex(0)).toBe('');
    expect(getContentTextAtIndex(1)).toBe('tab 2');
  });

  it('should pass custom-class as css classes from wix-payment-tab directive to rendered li element', () => {
    createTwoTabsElement();
    expect(getTabAtIndex(0).hasClass('tab1-class')).toBe(true);
    expect(getTabAtIndex(1).hasClass('tab2-class')).toBe(true);
  });

  it('should not show header if only one tab', () => {
    createOneTabElement();
    expect(getHeaders().length).toBe(0);
  });

  it('should show tabs and hide content when first loaded', () => {
    createTwoTabsElement();
    expect(getContentTextAtIndex(0)).toBe('');
    expect(getContentTextAtIndex(1)).toBe('');
    expect(getHeaders().length).toBe(2);
  });

  it('should hide tabs and show content when pressing a tab', () => {
    createTwoTabsElement();
    clickHeaderAtIndex(0);
    expect(getContentTextAtIndex(0)).toBe('tab 1');
    expect(getHeaders().length).toBe(0);
  });

  it('should show tabs and hide content when pressing "back" button', () => {
    createTwoTabsElement();
    clickHeaderAtIndex(1);
    clickBackButton();
    expect(getContentTextAtIndex(0)).toBe('');
    expect(getContentTextAtIndex(1)).toBe('');
    expect(getHeaders().length).toBe(2);
  });
});
