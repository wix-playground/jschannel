'use strict';

class PaymentGatewayidConstants {
    PAYPAL: string = 'payPal';
    YANDEX: string = 'yandex';
    MERCADO_PAGO: string = 'NA';
    OFFLINE: string = 'NA';
    STRIPE: string = 'com.stripe';
    EWAY: string = 'com.eway';
    SQUARE: string = 'com.square';
}

angular
    .module('paymentAppConstants')
    .constant('PaymentGatewayidConstants', new PaymentGatewayidConstants());
