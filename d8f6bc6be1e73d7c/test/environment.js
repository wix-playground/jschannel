import testkit from 'wix-bootstrap-testkit';
import configEmitter from 'wix-config-emitter';

export const app = bootstrapServer();

export const start = function () {
  beforeEach(() => emitConfigs());
  app.beforeAndAfterEach();
};

function emitConfigs() {
  return configEmitter({sourceFolders: ['./templates'], targetFolder: './target/configs'})
    .fn('static_url', 'com.wixpress.marketing.marketing-campaign-creative-mornings', 'http://local.dev.wix.com:3200/')
    .emit();
}

function bootstrapServer() {
  return testkit.app('./index', {
    env: {
      PORT: 3100,
      MANAGEMENT_PORT: 3104,
      NEW_RELIC_LOG_LEVEL: 'warn',
      DEBUG: ''
    }
  });
}
