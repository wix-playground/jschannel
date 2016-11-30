'use strict';

class WixPaymentTabset {
  tabs: Array<ng.IScope>;
  onSelect: Function;
  onUnSelect: Function;
  activePaymentMethodTitle: string;

  isOnlyOnePaymentMethodExists: boolean;

  /* @ngInject */
  constructor($window: ng.IWindowService, $scope: ng.IScope, private CashierPaymentMethodConstants: CashierPaymentMethodConstants) {
    this.tabs = [];

    $window.onpopstate = (event) => {
      $scope.$evalAsync(() => {
        this.unSelect();
      });
    };
  }

  useThisPaymentMethod(tab) {
    this.isOnlyOnePaymentMethodExists = true;
    this.setPaymentMethodTitle(tab['wixPaymentTab']);
  }

  setPaymentMethodTitle(selectedTab) {
    switch (selectedTab.paymentMethod) {
      case this.CashierPaymentMethodConstants.CREDIT_CARD:
        this.activePaymentMethodTitle = 'payment.payWithCreditCard';
        break;
      case this.CashierPaymentMethodConstants.PAYPAL:
        this.activePaymentMethodTitle = 'payment.payWithPaypal';
        break;
      case this.CashierPaymentMethodConstants.YANDEX:
        this.activePaymentMethodTitle = 'payment.payWithYandex';
        break;
      case this.CashierPaymentMethodConstants.MERCADO_PAGO:
        this.activePaymentMethodTitle = 'payment.payWithMercadoPago';
        break;
      case this.CashierPaymentMethodConstants.OFFLINE:
        this.activePaymentMethodTitle = selectedTab.header;
        break;
    }
  }

  resetPaymentMethodTitle() {
    this.activePaymentMethodTitle = '';
  }

  addTab(tab: ng.IScope): void {
    this.tabs.push(tab);
  }

  isSelected() {
    return this.tabs.filter((tab) => tab['wixPaymentTab'].active).length > 0;
  }

  unSelect() {
    if (this.onUnSelect) {
      this.onUnSelect();
    }
    angular.forEach(this.tabs, function (tab) {
      tab['wixPaymentTab'].active = false;
    });
    this.resetPaymentMethodTitle();
  }

  select(selectedTab: ng.IScope): void {

    try {
      history.pushState({}, '');
    } catch (e) {
      // Safari bug fix:
      // history.push() throws exception with no reason
      // Temp fix: do nothing..
    }

    if (this.onSelect) {
      this.onSelect();
    }

    angular.forEach(this.tabs, function (tab: ng.IScope) {
      if (tab['wixPaymentTab'].active && tab !== selectedTab) {
        tab['wixPaymentTab'].active = false;
      }
    });

    selectedTab['wixPaymentTab'].active = true;
    this.setPaymentMethodTitle(selectedTab['wixPaymentTab']);
  }
}

angular
  .module('wixPaymentTabs', ['wixPaymentTab'])
  .directive('wixPaymentTabset', () => {
    return {
      template: `
          <div class="tabs">
            <h2 ng-if="wixPaymentTabset.isSelected()" class="choose-payment-header wallet-header"><a class="wix-payment-tabset-back payment-svg-font-icons-back-arrow" ng-if="!wixPaymentTabset.isOnlyOnePaymentMethodExists" href ng-click="wixPaymentTabset.unSelect()"></a><span ng-if="!wixPaymentTabset.isOnlyOnePaymentMethodExists" class="payment-header-vertical-separator"></span><span data-hook="payment-page-title">{{wixPaymentTabset.activePaymentMethodTitle | translate}}</span></h2>
            <div class="tabs-scroll-wrap">
              <div class="tabs-wrapper" ng-if="!wixPaymentTabset.isSelected()">
                <a class="tab-header tab tab-title" ng-repeat="tab in wixPaymentTabset.tabs" ng-if="wixPaymentTabset.tabs.length > 1" ng-class="[tab.wixPaymentTab.customClass, tab.wixPaymentTab.active ? 'active' : '']" href ng-click="wixPaymentTabset.select(tab)" data-hook="wcsh-payment-method-tab-row-{{::tab.wixPaymentTab.paymentMethod}}"><span class="tab-header-inner" data-hook="{{tab.wixPaymentTab.paymentMethod}}-tab-header">{{tab.wixPaymentTab.header}}</span></a>
              </div>
            </div>
            <div class="container wp-active-tab-content" ng-transclude></div>
          </div>`,
      controller: WixPaymentTabset,
      controllerAs: 'wixPaymentTabset',
      bindToController: true,
      restrict: 'E',
      scope: {
        onSelect: '&',
        onUnSelect: '&'
      },
      transclude: true
    };
  });
