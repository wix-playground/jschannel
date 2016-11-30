'use strict';

class WixSecurityCodeTooltip {

    onShowTooltip: () => void;
    isTooltipShowed: boolean;

    /* @ngInject */
    constructor() {
        this.isTooltipShowed = false;
    }

    showTooltip() {
        this.isTooltipShowed = true;
        this.onShowTooltip();
    }

    hideTooltip() {
        this.isTooltipShowed = false;
    }
}

angular
    .module('wixSecurityCodeTooltip', [])
    .component('wixSecurityCodeTooltip', {

        template: `<div data-hook="wcsh-security-tooltip-wrapper" class="wcsh-security-tooltip-wrapper" ng-mouseenter="$ctrl.showTooltip()" ng-mouseleave="$ctrl.hideTooltip()">
                    <span ng-include="'/images/svg-font-icons/question.svg'" class="wcsh-security-tooltip-question-mark"></span>
                    <div ng-if="$ctrl.isTooltipShowed" class='security-code-tooltip' id='securityNumberHelpIconTooltip' data-hook="wcsh-security-tooltip-message">
                        <h4 class='security-tooltip-header'>{{'payment.creditCardWhatIsSecurityCode' | translate}}</h4>
                        <div class='security-tooltip-subtitle-wrapper security-three-digits'>
                            <div class='cvv-cc'></div>
                            <p class='security-tooltip-subtitle'>{{"payment.creditCardThreeDigitsSecurityCode" | translate}}</p>
                        </div>
                        <div class='security-tooltip-subtitle-wrapper security-four-digits'>
                            <div class='cvv-amex'></div>
                            <p class='security-tooltip-subtitle'>{{"payment.creditCardFourDigitsSecurityCode" | translate}}</p>
                        </div>
                    </div>
                   </div>`,
        controller: WixSecurityCodeTooltip,
        bindings: {
            onShowTooltip: '&'
        }

    });
