'use strict';

class KeyCodes {
  backspace: number = 8;
  space: number = 32;
  leftArrow: number = 37;
  rightArrow: number = 39;
  delete: number = 46;
}

angular
  .module('paymentAppInternal')
  .value('keyCodes', new KeyCodes());
