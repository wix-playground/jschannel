const path = require('path');
const bootstrap = require('wix-bootstrap-ng');

const rootDir = process.env.SRC_PATH || './dist/src';
const getPath = filename => path.join(rootDir, filename);

bootstrap()
  .use(require('wix-bootstrap-rpc'))
  .config(getPath('config'))
  .express(getPath('server'))
  .start({disableCluster: process.env.NODE_ENV === 'development'});
