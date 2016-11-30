'use strict';

class DomEventHelper {

  /* @ngInject */
  constructor() {
    //
  }

  cancelEvent(event: BaseJQueryEventObject) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  isSpecialKeypress(event: JQueryKeyEventObject) {
    const enterKeyCode = 13;
    return (event.which === 0 && event.charCode === 0) || event.keyCode === enterKeyCode;
  }
}

angular
  .module('paymentAppInternal')
  .service('domEventHelper', DomEventHelper);
