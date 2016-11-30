'use strict';

export class BaseDriver {

  getByDataHook(dataHookName) {
    return $(`[data-hook="${dataHookName}"]`);
  }

  getAllByDataHook(dataHookName) {
    return $$(`[data-hook="${dataHookName}"]`);
  }

  waitForPresenceOf(element) {
    browser.driver.wait(protractor.ExpectedConditions.presenceOf(element), 3000);
    return element;
  }

  waitForStalenessOf(element) {
    browser.driver.wait(protractor.ExpectedConditions.stalenessOf(element), 3000);
    return element;
  }

  moveMouseToElement(element) {
    browser.actions().mouseMove(element).perform();
  }
}
