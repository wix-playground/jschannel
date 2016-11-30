'use strict';
declare var W;

class CashierBiLoggerService {

  wixBiLogger: WixBiLogger;

  /* @ngInject */
  constructor(paymentConstants) {

    this.wixBiLogger = new W.BI.Logger({
      defaultEventArgs: {src: paymentConstants.bi.src},
      eventMap: paymentConstants.bi.biEvents,
      adapter: paymentConstants.bi.adapter
    });
  }

  log(biDTO: BiDTO): void {
    this.wixBiLogger.log(biDTO);
  }

  getLastBiUrl(): WixBiUrl {
    return this.wixBiLogger.getLastBiUrl();
  }
}

interface WixBiLogger {
  log: (eventArgs, callback?) => void;
  error: (eventArgs, callback?) => void;
  reportOnReady: (viewName, eventArgs, callback?) => void;
  reportRouteChange: (viewName, eventArgs, callback?) => void;
  getLastBiUrl: () => WixBiUrl;
}

interface WixBiUrl {
  url: string;
  clear: () => void;
  resolve: () => void;
  assertEmpty: () => void;
}

angular
  .module('paymentAppBi')
  .service('cashierBiLoggerService', CashierBiLoggerService);
