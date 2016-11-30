import biLogger from 'web-bi-logger';

export default biLogger
  .factory({endpoint: 'lp'})
  .setDefaults({src: 19})
  .logger();
