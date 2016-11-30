'use strict';

import {BaseDriver} from './base.driver';

export class CreditCardComponentTestPage extends BaseDriver {

  navigate(urlParams) {
    browser.get('/cc-component-test-page.html#?orderId=' + urlParams.orderSnapshotId + '&visitorId=' + (urlParams.visitorId ? urlParams.visitorId : '') + '&appInstanceId=' + (urlParams.appInstanceId ? urlParams.appInstanceId : ''));
  }

  get responsesLabels() {
    return $$('.response-title');
  }
}
