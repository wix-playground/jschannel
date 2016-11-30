## Wix Payments Statics - V0.5
==========================

1. [Overview](#overview)
2. [Installation](#installation)
3. [API](#api)
4. [Preload/Precache](#preload)


## Overview

This is client side integration for Payments projects (see [payment services repo](https://github.com/wix/payment-services) and [gateway server repo](https://github.com/wix/payment-gateway) for more details).

This doc is for V0.5.

## Installation

Simply load our page into an iFrame: "https://cashier.wix.com/render/cashier_payment_iframe". The iFrame should contain an `orderId` parameter, received from the 'snapshot' stage (see server integration for details).

## API

####Input 'get' params:
- orderId - should be received on an early 'snapshot' stage (server integration). (TODO: add link to iFrame)

####Api methods:

Api integration is currently via postMessage api (on a later stage there might be a javascript wrapper tag).
In order to listen to postMessage events you should register the following:

`window.addEventListener("message", receiveMessageMethod);`

Now, `receiveMessageMethod` should look something like this:

```javascript
function receiveMessage(event) {
  switch (event.data.eventType) {
    case 'isAlive':
    //This event will be called when iFrame is loaded
    break;
    case 'setHeight':
    //This event will be called when iFrame is loaded / size was changed.
    //You should set iFrame's height according to 'event.data.height'. For example:
    document.getElementById('pay-form').style.height = event.data.height + 'px';
    break;
    case 'startPaymentProcessing':
    //This event will be called when 'Place Order' button is clicked.
    //*This event can be useful if you want to add spinner/control payment process.
    break;
    case 'paymentComplete':
    //This event will be called after a payment request completed successfuly.
    break;
    case 'paymentError':
    //This event will be called when payment was failed. TODO: supply failure details.
    //Faliure reasons can be:
    //*Payment was declined.
    //*Payment failed.
    break;
  }
}
```
## Preload
In order to increase iFrame load performance we supply a preload url. This url can be async loaded into an invisible iframe in order to precache our static assets. 

An example for iFrame async loading (vanilla Javascript):

```javascript
  var iframe = document.createElement('iframe');
  iframe.style.visibility = "hidden";
  iframe.src='https://cashier.wix.com/render/preload_payment_iframe'; 
  iframe.width=1; iframe.height=1;
  document.body.appendChild(iframe);
```
