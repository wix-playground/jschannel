'use strict';
import * as env from '../environment';
import {expect} from 'chai';
import {MetasiteDriver} from './drivers/metasite.driver';

describe('Rpc: metasite', () => {
  let metasiteDriver;
  env.start();

  beforeEach(() => {
    metasiteDriver = new MetasiteDriver(env);
  });

  xit('should return user site list', () =>
    metasiteDriver.given.listSiteData()
      .when.listMetasites().then(result => {
        expect(result[0].id).to.equal(metasiteDriver.get.metaSiteId());
        expect(result[0].siteName).to.equal(metasiteDriver.get.siteName());
      })
  );
});
