'use strict';

export class OfflineTestPage {

  navigate (urlParams) {
    if (urlParams) {
      browser.get('/offline-test-page.html#?appInstanceId=' + (urlParams.appInstanceId ? urlParams.appInstanceId : '') + '&appDefId=' + (urlParams.appDefId ? urlParams.appDefId : ''));
    } else {
      browser.get('/offline-test-page.html');
    }
  }

  getByDataHook (dataHookName) {
    return $(`[data-hook="${dataHookName}"]`);
  }

  getAllByDataHook (dataHookName) {
    return $$(`[data-hook="${dataHookName}"]`);
  }

  get offlineInstructionsText () {
    return this.getByDataHook('offline-instructions-text');
  }
}
