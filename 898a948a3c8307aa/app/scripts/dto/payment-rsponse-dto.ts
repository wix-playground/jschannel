'use strict';

interface PaymentResponseDTO {

  paymentStatus: IPaymentStatus;
  transactionKey: string;
  enc?: string;
}

interface IPaymentStatus {

  enumClass: string;
  value: string;
}
