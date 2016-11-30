'use strict';

class WixPaymentMatchLabelHeights {

  static isLabelsAlreadySet: boolean = false;
  static shorterLabel: JQuery;
  static tallerLabel: JQuery;
  static labels: JQuery[] = [];

  /* @ngInject */
  constructor($element: JQuery, $interval: ng.IIntervalService, $window: ng.IWindowService) {

    WixPaymentMatchLabelHeights.labels.push($element);

    const numberOfLabels = 2;
    if (WixPaymentMatchLabelHeights.labels.length === numberOfLabels) {

      let stopInterval = $interval(() => {
        if (document.readyState === 'complete') {
          WixPaymentMatchLabelHeights.checkLabelsHeight();
          $interval.cancel(stopInterval);
        }
      }, 100);
    }

    $window.onresize = () => {
      WixPaymentMatchLabelHeights.checkLabelsHeight();
    };
  }

  static checkLabelsHeight() {
    if (WixPaymentMatchLabelHeights.isHeightAdjustmentNeeded()) {
      WixPaymentMatchLabelHeights.setShorterAndHigherLabels();
      WixPaymentMatchLabelHeights.matchLabelHeights();
    }
  }

  static isHeightAdjustmentNeeded(): boolean {

    var firstLabelHeight = WixPaymentMatchLabelHeights.labels[0].height();
    var secondLabelHeight = WixPaymentMatchLabelHeights.labels[1].height();

    return firstLabelHeight !== secondLabelHeight;
  }

  static setShorterAndHigherLabels(): void {

    if (WixPaymentMatchLabelHeights.isLabelsAlreadySet) {
      return;
    }

    var firstLabelHeight = WixPaymentMatchLabelHeights.labels[0].height();
    var secondLabelHeight = WixPaymentMatchLabelHeights.labels[1].height();

    if (firstLabelHeight < secondLabelHeight) {
      WixPaymentMatchLabelHeights.shorterLabel = WixPaymentMatchLabelHeights.labels[0];
      WixPaymentMatchLabelHeights.tallerLabel = WixPaymentMatchLabelHeights.labels[1];
    } else {
      WixPaymentMatchLabelHeights.shorterLabel = WixPaymentMatchLabelHeights.labels[1];
      WixPaymentMatchLabelHeights.tallerLabel = WixPaymentMatchLabelHeights.labels[0];
    }

    WixPaymentMatchLabelHeights.isLabelsAlreadySet = true;
  }

  static matchLabelHeights() {
    WixPaymentMatchLabelHeights.shorterLabel.height(WixPaymentMatchLabelHeights.tallerLabel.height());
  }
}

angular
  .module('paymentAppInternal')
  .directive('wixPaymentMatchLabelHeights', () => ({
    controller: WixPaymentMatchLabelHeights,
    restrict: 'A'
  }));
