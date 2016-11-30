'use strict';

class ServerPaymentStatusConstants {

  constructor() {
    this.APPROVED = 'Approved';
    this.DECLINED = 'Declined';
    this.GATEWAY_FAILURE = 'GatewayFailure';
    this.FAILURE = 'Failure';
  }
}

module.exports = new ServerPaymentStatusConstants();
