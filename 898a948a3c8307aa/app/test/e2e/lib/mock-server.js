'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var serverPaymentStatusConstants = require('../constants/server-payment-status-constants');
var paymentMethodsConstants = require('../constants/payment-methods-constants');
var paymentGatewayidsConstants = require('../constants/payment-gatewayids-constants');

var app = express();
app.use(bodyParser.json());
app.use(session({
  secret: 'yoba',
  cookie: {httpOnly: false},
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', 0);
  return next();
});

var storage = {};
var testMandatoryValues = function (req) {
  var mandatoryKeysArray = ['ccnumber', 'month', 'year', 'csc', 'nameOnCard'];
  var i;
  for (i = 0; i < mandatoryKeysArray.length; i++) {

    if (!req.body.hasOwnProperty(mandatoryKeysArray[i]) || req.body[mandatoryKeysArray[i]] === '') {
      return false;
    }
  }
  return true;
};


var testCreditCard = function (creditCard) {
  creditCard.toString(); //hack to bypass jshint. //TODO: remove
  /* jshint ignore:start */
  var sumTable = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]];
  var sum = 0;
  var flip = 0;
  var num = creditCard.toString();
  for (var i = num.length - 1; i >= 0; --i) {
    sum += sumTable[flip++ & 1][parseInt(num.charAt(i), 10)];
  }
  return (sum % 10 === 0);
  /* jshint ignore:end */
};

var testSpecificCard = function (req) {
  var validCreditCardMock = {ccnumber: '5424000000000015', month: 8, year: 2018, csc: 900};
  if (req.body.ccnumber === validCreditCardMock.ccnumber) {
    if (req.body.month !== validCreditCardMock.month || req.body.year !== validCreditCardMock.year || req.body.csc !== validCreditCardMock.csc) {
      return false;
    }
    return true;
  }
  return true;
};

var parseRequest = function (req) {
  const dummyResponse = {
    'paymentStatus': {'enumClass': 'com.wixpress.payment.domain.PaymentStatus', 'value': serverPaymentStatusConstants.APPROVED},
    'transactionKey': 'cf891d48-856f-4b87-866a-5d434d594d48',
    'enc': 'kdsjahdakjdhasjkdhskajh_dsadhjksahdjksahdkas'
  };

  if (req.body.nonce) {
    delete dummyResponse.enc;
    return dummyResponse;
  }

  if (!testMandatoryValues(req)) {
    return {'paymentStatus': {'enumClass': 'com.wixpress.payment.domain.PaymentStatus', 'value': serverPaymentStatusConstants.FAILURE}};
  }

  if (!testCreditCard(req.body.ccnumber)) {
    return {'paymentStatus': {'enumClass': 'com.wixpress.payment.domain.PaymentStatus', 'value': serverPaymentStatusConstants.DECLINED}};
  }

  if (!testSpecificCard(req)) {
    return {'paymentStatus': {'enumClass': 'com.wixpress.payment.domain.PaymentStatus', 'value': serverPaymentStatusConstants.DECLINED}};
  }

  return dummyResponse;
};

// jscs:disable disallowTrailingWhitespace
var settingsDefault = {
  'paymentMethods': [
    {
      'paymentMethod': paymentMethodsConstants.PAYPAL,
      'gatewayId': paymentGatewayidsConstants.PAYPAL
    },
    {
      'paymentMethod': paymentMethodsConstants.YANDEX,
      'gatewayId': paymentGatewayidsConstants.YANDEX
    },
    {
      'paymentMethod': paymentMethodsConstants.CREDIT_CARD,
      // 'gatewayId': paymentGatewayidsConstants.STRIPE
      'gatewayId': paymentGatewayidsConstants.SQUARE
    },
    {
      'paymentMethod': paymentMethodsConstants.OFFLINE,
      'gatewayId': paymentGatewayidsConstants.OFFLINE
    },
    {
      'paymentMethod': paymentMethodsConstants.MERCADO_PAGO,
      'gatewayId': paymentGatewayidsConstants.MERCADO_PAGO
    }
  ],
  'offlineText': {
    titleId: 'settings.offlineTitleOptionDefault',
    text: `
                <p>regular text</p>
                
                <p><span style="font-weight:bold;">bold text&nbsp;</span></p>
                
                <p><span style="font-style:italic;">indent text</span></p>
                
                <p><span style="text-decoration:underline;">underline text</span></p>
                
                <ul>
                  <li>bullets</li>
                  <li>bulltets</li>
                </ul>
                
                <ol>
                  <li>number</li>
                  <li>nubmer</li>
                </ol>
                
                <p><a href="http://www.google.com" target="_blank"><span style="text-decoration:underline;">link to google</span></a></p>
              `
  }
};
// jscs:disable disallowTrailingWhitespace

app.route('/payment-gateway-web/submit_order')
  .get(function (req, res) {
    res.send({resources: storage[req.sessionID] || []});
  })
  .post(function (req, res) {
    // var data = storage[req.sessionID] || [];
    // storage[req.sessionID] = data.concat([req.body]);
    //TODO: add ;ogic here for fake server responses according to credit card
    var responseData = parseRequest(req);
    res.send(responseData);
  });

app.route('/payment-gateway-web/order')
  .get(function (req, res) {
    res.send({resources: storage[req.sessionID] || []});
  })
  .post(function (req, res) {
    // var data = storage[req.sessionID] || [];
    // storage[req.sessionID] = data.concat([req.body]);
    //TODO: add ;ogic here for fake server responses according to credit card
    var responseData = parseRequest(req);
    res.send(responseData);
  });

app.route('/payment-services-web/merchant/square/pay')
  .post((req, res) => {
    const responseData = parseRequest(req);
    res.send(responseData);
  });

app.route('/payment-services-web/buyer/settings')
  .get(function (req, res) {
    res.send(settingsDefault);
  });

app.listen(process.argv[2] || 3000);
console.log('listening...');
