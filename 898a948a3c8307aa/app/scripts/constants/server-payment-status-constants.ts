'use strict';

class ServerPaymentStatusConstants {
  APPROVED: string = 'Approved';
  DECLINED: string = 'Declined';
  GATEWAY_FAILURE: string = 'GatewayFailure';
  FAILURE: string = 'Failure';
}

angular
  .module('paymentAppConstants')
  .constant('ServerPaymentStatusConstants', new ServerPaymentStatusConstants());
