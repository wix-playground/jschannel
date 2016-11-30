'use strict';

class WixConditionalPaymentButton {

    onPayClicked: () => void;
    paymentMethod: string;
    buttonLabelText: string;
    classes: string;
    useTermsAndConditions: boolean;

    isButtonClicked: boolean;
    isTermsAndConditionsChecked: boolean;

    /* @ngInject */
    constructor() {
        this.isButtonClicked = false;
    }

    onClick() {
        this.isButtonClicked = true;
        this.onPayClicked();
    }

    checkIfButtonShouldBeDisabled(): boolean {
        return (this.isButtonClicked || (this.useTermsAndConditions && !this.isTermsAndConditionsChecked));
    }

}

angular
    .module('wixConditionalPaymentButton', [])
    .component('wixConditionalPaymentButton', {

        template: `<div data-hook="wcsh-payment-button-container" class="wcsh-payment-button-container"> 
                    <button data-hook="{{::'wcsh-payment-button-' + $ctrl.paymentMethod}}" ng-class="::$ctrl.classes" ng-click="$ctrl.onClick()" ng-disabled="$ctrl.checkIfButtonShouldBeDisabled()">{{::$ctrl.buttonLabelText | translate}}</button> 
                    <div class="wix-payment-terms-and-conditions" data-hook="{{::'wcsh-payment-terms-and-conditions-' + $ctrl.paymentMethod}}" ng-if="::$ctrl.useTermsAndConditions">
                        <label>
                            <input data-hook="{{::'wcsh-payment-checkbox-' + $ctrl.paymentMethod}}" class="wix-payment-terms-and-conditions-cb" id="wix-payment-terms-and-conditions-cb" ng-init="$ctrl.isTermsAndConditionsChecked=true" ng-model="$ctrl.isTermsAndConditionsChecked" type="checkbox">
                            <i class="payment-svg-font-icons-check"></i>
                        </label>
                        <label class="wix-payment-terms-and-conditions-label" for="wix-payment-terms-and-conditions">{{::'payment.termsAndConditionsLabel' | translate}}</label>
                    </div>
                   </div>`,
        controller: WixConditionalPaymentButton,
        bindings: {
            onPayClicked: '&',
            paymentMethod: '=',
            buttonLabelText: '=',
            classes: '=',
            useTermsAndConditions: '='
        }
    });
