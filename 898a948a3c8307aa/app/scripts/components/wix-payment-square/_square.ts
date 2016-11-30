angular.module('paymentAppInternal')
/* @ngInject */
.config((squarePaymentFormAdapterProvider: square.services.SquarePaymentFormAdapterProvider) =>
    squarePaymentFormAdapterProvider.init('sq0idp-AwZi2YVkg4ckGTtWClQFSg')
);
