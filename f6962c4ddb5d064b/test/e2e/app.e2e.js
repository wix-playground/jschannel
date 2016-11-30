import {AppDriver} from './drivers/app.driver';
import * as env from './../environment';

let appDriver;

beforeEach(() => {
  appDriver = new AppDriver(env);
});


describe('React application', () => {
  it('should display a working counter', () => {
    appDriver
      .when.navigate()
      .when.increaseCounterValue();

    expect(appDriver.get.counterValue()).toEqual('1');
  });
});
