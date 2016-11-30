'use strict';

class PaymentsApi {

  /* @ngInject */
  constructor(private $http: ng.IHttpService, private $q: ng.IQService, private squareAPIUrl: string, private paymentConstants, private submitOrderAPIUrl: string, private orderAPIUrl: string, private ServerPaymentStatusConstants: ServerPaymentStatusConstants) {
  }

  submitOrder(paymentDto: PaymentDTO): ng.IPromise<PaymentResponseDTO> {
    return this._submit(paymentDto, this.submitOrderAPIUrl);
  }

  pay(paymentDto: PaymentDTO, encrypted: boolean = false): ng.IPromise<PaymentResponseDTO> {
    let getParams = encrypted ? '?enc=true' : '';
    return this._submit(paymentDto, `${this.orderAPIUrl}${getParams}`);
  }

  payWithSquare(paymentDto: PaymentSquareDTO): ng.IPromise<PaymentResponseDTO> {
    return this._submit(paymentDto, this.squareAPIUrl);
  }

  payOffline(orderId: string): ng.IPromise<any> {
    return this.$http.post('/_api/payment-services-web/transactions/offline', {orderSnapshotId: orderId});
  }

  _submit(paymentDto: PaymentDTO|PaymentSquareDTO, url: string): ng.IPromise<PaymentResponseDTO> {
    return this.$http({ 'method': 'post', 'url': url, 'data': paymentDto, 'timeout': 90000 })
      .then((response: ng.IHttpPromiseCallbackArg<PaymentResponseDTO>) => {
        let responseType = response.data.paymentStatus.value;
        if (responseType === this.paymentConstants.approved) {
          return response.data;
        }

        // TODO: remove this reject (return meaningful error obj)
        return this.$q.reject(response);
      })
      .catch((response: ng.IHttpPromiseCallbackArg<PaymentResponseDTO>) => {

        let data = response.data;

        // TODO: handle and log all possible errors
        if (response.status === 500) {
          data = <PaymentResponseDTO> {
            paymentStatus: <IPaymentStatus> {
              value: this.ServerPaymentStatusConstants.GATEWAY_FAILURE
            }
          };
        }
        return this.$q.reject(data);
      });
  }
}

angular
  .module('paymentAppInternal')
  .service('paymentsApi', PaymentsApi);
