'use strict';

angular.module('paymentAppConstants', []);

//add services, directives, controllers, filters, etc. in this module
//avoid adding module dependencies for this module
angular
  .module('paymentAppInternal', ['wixSecurityCodeTooltip', 'paymentTranslations', 'paymentPreload', 'wix.common.bi', 'paymentAppConstants', 'wixAngular', 'paymentAppBi', 'ngSanitize']);
  //.config((wixBiLoggerProvider, paymentConstants) => {
  //let domain = window.location.hostname.split('.').slice(-2)[0];
  //
  //  wixBiLoggerProvider.setConfig({
  //    defaultEventArgs: { src: paymentConstants.bi.src },
  //    eventMap: paymentConstants.bi.biEvents,
  //    // The frog server host name
  //    hostName: 'frog.' + domain + '.com',
  //    // The BI adapter (path) - can be overridden
  //    adapter: paymentConstants.bi.adapter
  //  });
  //});

//add module dependencies & config and run blocks in this module
//load only the internal module in tests and mock any module dependency
//the only exception to load this module in tests in to test the config & run blocks
angular
  .module('paymentApp', ['paymentAppInternal']);
