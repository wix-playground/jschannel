'use strict';

class CashierPaymentMethodConstants {
    CREDIT_CARD: string = 'creditCard';
    PAYPAL: string = 'payPal';
    YANDEX: string = 'yandex';
    MERCADO_PAGO: string = 'mercadoPago';
    OFFLINE: string = 'offline';
}

angular
    .module('paymentAppConstants')
    .constant('CashierPaymentMethodConstants', new CashierPaymentMethodConstants());
