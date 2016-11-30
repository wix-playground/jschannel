// 'use strict';
//
// require('../lib/matchers.protractor.js');
// let experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');
//
// let browserLogs = require('protractor-browser-logs');
//
// import {OfflineTestPage} from '../pages/offline-page';
//
// describe('wixPaymentApp Offline Page', () => {
//
//   let offlinePage;
//   let logs;
//
//   const offlineDTO = {
//     titleId: 'settings.offlineTitleOptionDefault',
//     text: `<p>regular text</p> <p><span style="font-weight:bold;">bold text&nbsp;</span></p> <p><span style="font-style:italic;">indent text</span></p> <p><span style="text-decoration:underline;">underline text</span></p> <ul> <li>bullets</li> <li>bulltets</li> </ul> <ol> <li>number</li> <li>nubmer</li> </ol> <p><a href="http://www.google.com" target="_blank"><span style="text-decoration:underline;">link to google</span></a></p>`
//   };
//
//   beforeEach(() => {
//     logs = browserLogs(browser);
//   });
//
//   beforeEach(() => {
//     offlinePage = new OfflineTestPage();
//     offlinePage.navigate();
//     experimentManager.setExperiments({});
//     browser.addMockModule('paymentAppMocks', () => {});
//   });
//
//   afterEach(() => {
//     browser.clearMockModules();
//     return logs.verify();
//   });
// });
