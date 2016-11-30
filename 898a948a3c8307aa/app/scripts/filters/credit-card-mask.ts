'use strict';

class CreditCardMask {
  /* @ngInject */
  constructor() {
    //
  }

  // transform an input '123456789' to '1234-5678-9' 
  filter(input: string): string {
    if (!angular.isDefined(input)) {
      return input;
    }

    let result = '';
    for (var i = 0, len = input.length; i < len && i < 16; i++) {
      result += input[i];
      if (i !== 0 && (i + 1) % 4 === 0) {
        result += '-';
      }
    }
    if (result.lastIndexOf('-') === (result.length - 1)) {
      result = result.slice(0, -1);
    }

    return result;
  }
}

angular
  .module('paymentAppInternal')
  .filter('creditCardMask', $injector => {
    let creditCardMask = $injector.instantiate(CreditCardMask);
    return creditCardMask.filter.bind(creditCardMask);
  });
