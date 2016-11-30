'use strict';

class WixPaymentCreditCard {

  iframeError: any;
  configurations: ICashierPaymentsConfiguration;
  gatewayId: string;

  /* @ngInject */
  constructor($element: ng.IAugmentedJQuery,
              $window: ng.IWindowService,
              private $scope: ng.IScope,
              private $sce: ng.ISCEService,
              private $timeout: ng.ITimeoutService,
              private iframeUrlConstant: string,
              private ccMessageMappingConstant: any,
              private $locale: ng.ILocaleService,
              private PaymentGatewayidConstants: PaymentGatewayidConstants,
              private biService: BiService) {

    if (this['onStartLoadingAsync']) {
      this['onStartLoadingAsync']();
    }

    this.iframeError = $timeout(() => {
      this['onError']();
    }, 10000);

    $scope.$on('$destroy', () => {
      $timeout.cancel(this.iframeError);
      $window.removeEventListener('message', this.handleCCMessages);
    });

    //TODO: should I cancel subscription? + change '*'
    $scope.$on('wixPaymentSubmit', (event: any, args: any) => {
      $element.find('iframe')[0]['contentWindow'].postMessage({eventType: 'submitPayment', orderId: args.orderId}, '*');
    });

    $window.addEventListener('message', this.handleCCMessages.bind(this));
  }

  handleCCMessages(event) {
    if (event.data && event.data.eventType) {
      //TODO: refactor when iframe has beter postmessage methods
      if (event.data.eventType === 'isAlive') {
        this.$timeout.cancel(this.iframeError);
      }
      if (event.data.eventType === 'setHeight') {
        this.$scope.$apply(() => {
          this['height'] = event.data.height;
        });
      }
      if (this.ccMessageMappingConstant[event.data.eventType]) {
        this.$scope.$apply(() => {
          this.$scope['wixPaymentCreditCard'][this.ccMessageMappingConstant[event.data.eventType]]();
        });
      }
    }
  }

  getIframeUrl(): string {

    if (!angular.isDefined(this['configurations'])) {
      return; //TODO: What should happen here??
    }

    let customCssParam = angular.isDefined(this.configurations.customCss) ? `&customCss=${this.configurations.customCss}` : '';

    let externalSubmitButton = angular.isDefined(this.configurations.externalSubmitButton) ? `&externalSubmitButton=${this.configurations.externalSubmitButton}` : '';

    let termsAndConditions = angular.isDefined(this.configurations.useTermsAndConditions) ? `&isTermsDefined=${this.configurations.useTermsAndConditions}` : '';

    let localeId = angular.isDefined(this.$locale.id) ? `?uoulang=${this.$locale.id}` : '';

    let biPaymentPageSource = `&biPaymentPageSource=${this.biService.biPaymentPageSource}`;

    //let iframeUrl = this.iframeUrlConstant + `#?orderId=${this.configurations.orderId}&visitorId=${this.configurations.visitorId}&appInstanceId=${this.configurations.appInstanceId}&appDefId=${this.configurations.appDefId}${externalSubmitButton}${customCssParam}${termsAndConditions}${localeId}${biPaymentPageSource}`;
    let iframeUrl = this.iframeUrlConstant + `${localeId}#?orderId=${this.configurations.orderId}&visitorId=${this.configurations.visitorId}&appInstanceId=${this.configurations.appInstanceId}&appDefId=${this.configurations.appDefId}${externalSubmitButton}${customCssParam}${termsAndConditions}${biPaymentPageSource}`;

    return this.$sce.trustAsResourceUrl(iframeUrl);
  }
}

angular
  .module('wixPaymentCreditCard', ['paymentTranslations', 'paymentAppBi'])
  .directive('wixPaymentCreditCard', () => {
    return {
      template: `
      <div>
        <div class="wallet-wrap wallet-wrap-creditcard" ng-if="wixPaymentCreditCard.gatewayId !== wixPaymentCreditCard.PaymentGatewayidConstants.SQUARE">
          <iframe id="pay-form" name="payment" class="payment" frameBorder="0" ng-src="{{::wixPaymentCreditCard.getIframeUrl()}}" ng-style="{'width':'100%', 'height': wixPaymentCreditCard.height}" class="ccIframe" data-hook="wcsh-credit-card-iframe" />
        </div>
        <wix-payment-square
          data-hook="wix-payment-square-component"
          ng-if="wixPaymentCreditCard.gatewayId === wixPaymentCreditCard.PaymentGatewayidConstants.SQUARE"
          on-payment-start="wixPayment.onPaymentStart()"
          on-payment-success="wixPayment.onPaymentSuccess()"
          on-payment-error="wixPayment.onPaymentError()"
          class="wix-payment-square-component"></wix-payment-square>
      </div>
        `,
      controller: WixPaymentCreditCard,
      controllerAs: 'wixPaymentCreditCard',
      bindToController: true,
      scope: {
        onStartLoadingAsync: '&',
        onLoad: '&',
        onError: '&',
        onPaymentStart: '&',
        onPaymentSuccess: '&',
        onPaymentError: '&',
        gatewayId: '=',
        configurations: '='
      },
      restrict: 'E'
    };
  })
  //.value('iframeUrlConstant', './bower_components/wix-payment-statics/dist/credit-card-page.html')
  //.value('iframeUrlConstant', './credit-card-page.html')
  .value('iframeUrlConstant', 'https://cashier.wix.com/render/cashier_payment_iframe')
  .constant('ccMessageMappingConstant', {
    'isAlive': 'onLoad',
    'startPaymentProcessing': 'onPaymentStart',
    'paymentComplete': 'onPaymentSuccess',
    'paymentError': 'onPaymentError'
  });
