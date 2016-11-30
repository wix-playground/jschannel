const path = require('path');
const bootstrap = require('wix-bootstrap-ng');

const rootDir = process.env.SRC_PATH || './dist/src';
const getPath = filename => path.join(rootDir, filename);

const jsdom = require('jsdom');
global.window = jsdom.jsdom('<div id="mount-point">Hello, World<div>').defaultView;
global.document = global.window.document;
global.navigator = global.window.navigator;
global.parent = global.window.parent;

require('css-modules-require-hook')({
  rootDir,
  generateScopedName: '[path][name]__[local]__[hash:base64:5]',
  extensions: ['.scss', '.css'],
  camelCase: true
});

bootstrap()
  .use(require('wix-bootstrap-rpc'))
  .config(getPath('config'))
  .express(getPath('server'))
  .start();
