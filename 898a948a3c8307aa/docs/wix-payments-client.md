## Wix Payments Client - V1.0
==========================

1. [Overview](#overview)
2. [Installation](#installation)
3. [Directive Usage](#directive usage)
3. [API](#api)


## Overview

This is a client page component for integrating Wix Payment solution (see [Wix payment statics](https://github.com/wix/wix-payment-statics), [payment services repo](https://github.com/wix/payment-services) and [gateway server repo](https://github.com/wix/payment-gateway) for more details).

This doc is for V1.0.

## Installation

######Install using bower

`bower install --save wix-payment-statics`

Include the following style to your document head

```html
<link rel="stylesheet" href="bower_components/wix-payment-statics/dist/styles/wix-payment.css">
```

Include the following script tags in your html document

######Angular
```html
<script type="text/javascript" src="bower_components/wix-payment-statics/dist/scripts/wix-payment-modules.js"></script><!-- Note: Do not use this reference if you already uses wix-angular references -->

<script type="text/javascript" src="bower_components/wix-payment-statics/dist/scripts//locale/messages_{language}.js"></script>

<script type="text/javascript" src="bower_components/wix-payment-statics/dist/scripts//wix-payment-statics.js"></script>
```
Please note that your server will have to replace the {language} with the current language

######React - TBD

######Vanilla Javascript - TBD

##Usage

######Angular

Add a dependency to your application module.

```javascript
angular.module('myApp', ['wixPayment']);
```

Directive Usage

```html
<wix-payment configurations="configurations"
  on-load="onLoadHandler()"
  on-payment-start="onPaymentStartHandler()"
  on-payment-success="onPaymentSuccessHandler()"
  on-payment-error="paymentErrorHandler()"
  on-error="onErrorHandler()"
  on-offline-payment-complete="onOfflinePaymentCompleteHandler()"
  on-payment-navigate="onNavigateHandler()"
  on-payment-navigate-back="onNavigateBackHandler()"></wix-payment>
```

######React - TBD

######Vanilla Javascript - TBD

### Configurations

|Param|Type|Details|comments|
|---|---|---|---|
|orderId|string|Parameter received in server to server snapshot request|Mandatory|
|visitorId|string||Mandatory|
|appInstanceId|string||Mandatory|
|appDefId|string||Mandatory|
|externalSubmitButton|boolean|When set to true, payment submit button will be on vertical sided. Cashier button will be hidden|optional. default = false|

### Events
|Event|Details|comments|
|---|---|---|
|on-error|Triggered when iFrame was not loaded||
|on-payment-start|Triggered when user submits CC payment||
|on-payment-success|Triggered when payment successful||
|on-payment-error|Triggered when payment error occurred||
|on-offline-payment-complete|Triggered when offline payment completed||
|on-payment-navigate|Triggered when a user navigates to one of the payment providers (Paypal, Credit Card etc.)|Usefull for cases when host app need to change the ui when user navigates to payment page|
|on-payment-navigate-back|Triggered when a user navigates back from one of the payment providers (Paypal, Credit Card etc.)|Useful for cases when host app need to change the ui when user navigates to payment page|
|wixPaymentSubmit|This is an event sent from vertical to cashier in order to indicated submit payment was pressed. |To be used with 'externalSubmitButton' = true (see configuration above)|
