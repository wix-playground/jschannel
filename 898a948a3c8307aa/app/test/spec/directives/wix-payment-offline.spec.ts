'use strict';

class WixPaymentOfflineDriver extends TurnerComponentDriver {

  static getComponentName() {
    return 'wix-payment-offline';
  }

  render(configurations: ICashierPaymentsConfiguration, offlineDTO: IOfflineDTO) {
    this.renderFromTemplate(`<wix-payment-offline configurations="::configurations" offline-data="::offlineDTO"></wix-payment-offline>`, {
      configurations: configurations,
      offlineDTO: offlineDTO
    });
  }

  get offlineInstructionsText(): ng.IAugmentedJQuery {
    return this.findByDataHook('offline-instructions-text');
  }
}

describe('Directive: wixPaymentOffline', () => {
  let driver: WixPaymentOfflineDriver;

  const configurations: ICashierPaymentsConfiguration = {
    appDefId: 'abcAppDefId',
    appInstanceId: 'abcAppInstanceId',
    orderId: '',
    visitorId: ''
  };

  const offlineDTO: IOfflineDTO = {
    titleId: 'settings.offlineTitleOptionDefault',
    text: `
            <p>regular text</p>
            
            <p><span style="font-weight:bold;">bold text&nbsp;</span></p>
            
            <p><span style="font-style:italic;">indent text</span></p>
            
            <p><span style="text-decoration:underline;">underline text</span></p>
            
            <ul>
              <li>bullets</li>
              <li>bulltets</li>
            </ul>
            
            <ol>
              <li>number</li>
              <li>nubmer</li>
            </ol>
            
            <p><a href="http://www.google.com" target="_blank"><span style="text-decoration:underline;">link to google</span></a></p>
          `
  };

  beforeEach(module('wixPaymentOffline'));

  beforeEach(() => {

    driver = new WixPaymentOfflineDriver();
    driver.render(configurations, offlineDTO);
    driver.connectToBody();
  });

  afterEach(() => {
    driver.disconnectFromBody();
  });
});
