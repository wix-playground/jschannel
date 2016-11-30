'use strict';

angular
  .module('paymentAppConstants')
  .constant('paymentConstants', {
    'paymentStatus': 'paymentStatus',
    'data': 'data',
    'approved': 'Approved',
    'isAlive': 'isAlive',
    'setHeight': 'setHeight',
    'startPaymentProcessing': 'startPaymentProcessing',
    'paymentStatusMapping': {
      'Approved': 'paymentComplete',
      'Declined': 'paymentError',
      'Failure': 'paymentError',
      'GatewayFailure': 'paymentError',
      'clientFailure': 'paymentError'
    },
    bi: {
      src: 64,
      adapter: 'cashier-ugc',
      biEvents: {
        IFRAME_LOADED: {
          evid: 100, payment_category: 'CreditCard'
        },
        VIEW_TOOLTIP: {
          evid: 101
        },
        INVALID_CARD: {
          evid: 102
        },
        SUBMIT_ORDER_END: {
          evid: 103
        },
        SUBMIT_ORDER: {
          evid: 104
        }
      },
      paymentMethodType: {
        jcb: 'jcb',
        mastercard: 'mastercard',
        discover: 'discover',
        isracard: 'isracard',
        maestro: 'maestro',
        visa: 'visa',
        amex: 'amex',
        diners: 'diners',
        dankort: 'dankort',
        unionpay: 'unionpay'
      }
    }
  })
  .constant('submitOrderAPIUrl', '/_api/payment-gateway-web/submit_order')
  .constant('orderAPIUrl', '/_api/payment-gateway-web/order')
  .constant('squareAPIUrl', '/_api/payment-services-web/merchant/square/pay');
