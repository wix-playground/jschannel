'use strict';

class PaymentDTO {
  constructor(public orderId: string, public ccnumber: string, public month: number, public year: number, public csc: string, public nameOnCard: string) {
  }
}

class PaymentSquareDTO {
  constructor(public orderId: string, public nonce: string) {}
}
