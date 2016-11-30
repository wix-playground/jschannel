'use strict';

interface IWixPaymentExpirationDateForm extends ng.IFormController {
  creditCardMonth: ng.INgModelController;
  creditCardYear: ng.INgModelController;
}

class WixPaymentExpirationDateCtrl {

  private ngModelCtrl: ng.INgModelController;
  private expirationDateForm: IWixPaymentExpirationDateForm;
  private isMonthFocused: boolean;
  private isYearFocused: boolean;
  private yearComponentOperations: any;
  private monthComponentOperations: any;
  private isActive: boolean;

  /* @ngInject */
  constructor(private $scope: IWixPaymentCreditCardFormScope, private $element: ng.IAugmentedJQuery, public now: Function, private $timeout: ng.ITimeoutService, private domEventHelper: DomEventHelper) {
    this.ngModelCtrl = <ng.INgModelController> $element.controller('ngModel');
    this.ngModelCtrl.$setValidity('required', false);
    this.yearComponentOperations = {};
    this.monthComponentOperations = {};
    this.isActive = false;
  }

  validate(): void {
    if (
      (this.expirationDateForm.creditCardMonth.$touched && this.expirationDateForm.creditCardYear.$touched)
      || ((this.expirationDateForm.creditCardMonth.$touched || this.expirationDateForm.creditCardYear.$touched) && !this.isMonthFocused && !this.isYearFocused)
    ) {
      (<any> this.ngModelCtrl).$setDirty();
    }

    this.ngModelCtrl.$setValidity('required',
      !(this.expirationDateForm.creditCardMonth.$viewValue === '' && this.expirationDateForm.creditCardYear.$viewValue === '')
    );

    this.ngModelCtrl.$setValidity('has_future_potential', this.hasFutureDatePotential());

    this.ngModelCtrl.$setValidity('future_expiration_date',
      this.expirationDateForm.$valid && this.isFutureDate(this.$scope.wixPaymentCreditCardForm.expirationDate.month, this.$scope.wixPaymentCreditCardForm.expirationDate.year)
    );
  }

  hasFutureDatePotential() {
    if ((this.expirationDateForm.creditCardMonth.$error['month-potential-validator'])
      || (this.expirationDateForm.creditCardYear.$error['year-potential-validator'])) {
      return false;
    }
    let monthLatestPotential: number;
    let monthView = this.expirationDateForm.creditCardMonth.$viewValue;
    if (monthView === '0') {
      monthLatestPotential = 9;
    } else if (monthView === '1' || monthView === '') {
      monthLatestPotential = 12;
    } else {
      monthLatestPotential = Number(monthView);
    }

    let yearLatestPotential: number;
    let yearView = this.expirationDateForm.creditCardYear.$viewValue;
    if (yearView.length === 0) {
      yearLatestPotential = 2099;
    } else if (yearView.length === 1) {
      yearLatestPotential = (Number(yearView) * 10) + 2009;
    } else {
      yearLatestPotential = Number(yearView) + 2000;
    }

    return this.isFutureDate(monthLatestPotential, yearLatestPotential);
  }

  isFutureDate(month, year) {
    let now = this.now();
    let testedDate = new Date(year, month - 1);
    return (testedDate.getFullYear() > now.getFullYear())
      || ((testedDate.getFullYear() === now.getFullYear()) && (testedDate.getMonth() >= now.getMonth()));
  }

  onDefaultFocus() {
    this.isActive = true;
    this.$timeout(() => {
      this.monthComponentOperations.focus();
    }, 0);
  }

  onDefaultBlur() {
    if (!this.isMonthFocused && !this.isYearFocused &&
      (!this.$scope.wixPaymentCreditCardForm.expirationDate ||
      (this.expirationDateForm.creditCardMonth.$viewValue === '' && this.expirationDateForm.creditCardYear.$viewValue === ''))) {
      this.isActive = false;
    }
    this.validate();
  }

  onMonthKeypressAtEndPosition(data: { event: JQueryKeyEventObject }) {

    if (!this.isYearEmpty()) {
      return;
    }

    if (this.domEventHelper.isSpecialKeypress(data.event)) {
      return;
    }

    (<any>this.$scope.wixPaymentCreditCardForm.expirationDate).year = String.fromCharCode(data.event.keyCode);
    this.yearComponentOperations.focusAtFirstPosition();
    this.domEventHelper.cancelEvent(data.event);
  }

  private isYearEmpty() {
    return this.$scope.wixPaymentCreditCardForm.expirationDate.year === undefined
      || this.$scope.wixPaymentCreditCardForm.expirationDate.year === null
      || (<any>this.$scope.wixPaymentCreditCardForm.expirationDate.year) === '';
  };
}

angular
  .module('paymentAppInternal')
  .directive('wixPaymentExpirationDate', () => {
    return {
      template: `<div class="ignore-white-spaces">
                        <ng-form name="wixPaymentExpirationDateCtrl.expirationDateForm"
                                 data-hook="expiration-date-active"
                                 ng-show="wixPaymentExpirationDateCtrl.isActive">
                            <expiration-date-month cc-expiration-month="wixPaymentCreditCardForm.expirationDate.month"
                                                   validate-full-date="wixPaymentExpirationDateCtrl.validate()"
                                                   on-month-set="wixPaymentExpirationDateCtrl.yearComponentOperations.focus()"
                                                   component-operations="wixPaymentExpirationDateCtrl.monthComponentOperations"
                                                   on-right-arrow-keydown="wixPaymentExpirationDateCtrl.yearComponentOperations.focusAtStartPosition()"
                                                   on-delete-keydown="wixPaymentExpirationDateCtrl.yearComponentOperations.focusAtStartPosition()"
                                                   on-space-keydown="wixPaymentExpirationDateCtrl.yearComponentOperations.focusAtStartPosition()"
                                                   on-keypress-at-input-end="wixPaymentExpirationDateCtrl.onMonthKeypressAtEndPosition({ event: event })"
                                                   on-month-blur="wixPaymentExpirationDateCtrl.onDefaultBlur()"
                                                   is-focused="wixPaymentExpirationDateCtrl.isMonthFocused"
                                                   is-active="wixPaymentExpirationDateCtrl.isActive">
                            </expiration-date-month>
                            <span class="seperator">/</span>
                            <expiration-date-year cc-expiration-year="wixPaymentCreditCardForm.expirationDate.year"
                                                  validate-full-date="wixPaymentExpirationDateCtrl.validate()"
                                                  component-operations="wixPaymentExpirationDateCtrl.yearComponentOperations"
                                                  on-year-blur="wixPaymentExpirationDateCtrl.onDefaultBlur()"
                                                  is-focused="wixPaymentExpirationDateCtrl.isYearFocused"
                                                  on-left-arrow-keydown="wixPaymentExpirationDateCtrl.monthComponentOperations.focusAtEndPosition()"
                                                  on-backspace-keydown="wixPaymentExpirationDateCtrl.monthComponentOperations.focusAtEndPosition()">
                            </expiration-date-year>
                        </ng-form>
                        <input type="text"
                          placeholder="{{'payment.expirationDateLabel' | translate}}"
                          data-hook="expiration-date-default"
                          ng-show="!wixPaymentExpirationDateCtrl.isActive"
                          ng-focus="wixPaymentExpirationDateCtrl.onDefaultFocus()"
                          ng-class="{'focus-on-invalid-date': !wixPaymentExpirationDateCtrl.isActive}"
                          size="20"/>
                       </div>`,
      controller: WixPaymentExpirationDateCtrl,
      controllerAs: 'wixPaymentExpirationDateCtrl',
      bindToController: true,
      restrict: 'A',
      require: 'ngModel'
    };
  });
