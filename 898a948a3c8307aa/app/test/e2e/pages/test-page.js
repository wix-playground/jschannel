'use strict';

function TestPage() {
  this.navigate = function (urlParams) {
    browser.get('/test-page.html#?orderId=' + urlParams.orderSnapshotId + '&visitorId=' + (urlParams.visitorId ? urlParams.visitorId : '') + '&appInstanceId=' + (urlParams.appInstanceId ? urlParams.appInstanceId : ''));
  };

  this.getPaymentIframe = function () {
    return $('.payment');
  };
  this.addorderIDToPaymentIframe = function (orderId) {
    //var paymentIframe = this.getPaymentIframe();
    var src = $('.payment').attr('src') + '?orderId=' + orderId;
    this.getPaymentIframe().attr('src', src);
  };
  this.getResponsesLabel = function () {
    return $$('.response-title');
  };

  this.setOrderId = function (orderId) {
    $('.orderid').sendKeys(orderId);
  };

  this.submit = function () {
    $('.submit').click();
  };

  this.setIframeSrc = function (orderId) {
    $('.payment').setAttribute('src', './index.html#?orderId=' + orderId);
  };
}

module.exports = TestPage;
