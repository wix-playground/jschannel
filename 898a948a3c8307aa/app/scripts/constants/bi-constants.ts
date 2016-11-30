'use strict';

class BiConstants {
  public Status = new BiStatusConstants();
  public PageType = new BiPageTypeConstants();
  public Source = new BiSourceConstants();
}

class BiStatusConstants {
  public FAILURE = false;
  public SUCCESS = true;
}

class BiPageTypeConstants {
  public CHOOSE_PAYMENT_METHOD_PAGE = 'payment method menu';
  public PAYMENT_PAGE = 'payment page';
}

class BiSourceConstants {
  public PAY_WITH = 'pay with';
  public BUYER_CHOOSE = 'buyer choose';
  public ONE_PAYMENT_METHOD = 'one payment method';
  public IFRAME_ONLY_INTEGRATION = 'iframe only integration';
}

angular
  .module('paymentAppConstants')
  .constant('BiConstants', new BiConstants());
