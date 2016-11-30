// Generated on 2015-07-13 using generator-wix-angular 1.0.11
'use strict';
module.exports = function (grunt) {
  var options = {
    version: '1.0.112',
    port: 9000,
    livereload: 35729,
    preloadModule: 'paymentPreload',
    translationsModule: 'paymentTranslations',
    svgFontName: 'payment',
    karmaConf: require('./karma.conf.js'),
    protractor: true,
    bowerComponent: true
  };

  var karmaFile = require('./karma.conf.js');

  karmaFile({
    set: function (karmaConf) {
      options.karmaTestFiles = karmaConf.files;
    }
  });

  require('wix-gruntfile')(grunt, options);

  grunt.modifyTask('yeoman', {
    //the address to which your local /_api is proxied to (to workaround CORS issues)
    //api: 'http://www.daiquiri.wixpress.com/_api/',
    api: 'http://localhost:3000',

    //this is the node.js fake server that e2e tests will use
    e2eTestServer: 'http://localhost:3333/',

    //the address that opens in your browser in grunt serve
    //(domain should be the same as staging so cookies will be sent in api requests)
    local: 'http://local.pizza.wixpress.com:<%= connect.options.port %>/wix-payment-test-page.html'
  });

  //override sauce labs browser list
  //process.env.SAUCE_BROWSERS = 'Chrome FF';

  //Follow this URL for instructions on how to override built-in definitions:
  //https://github.com/wix/wix-gruntfile/blob/master/README.md
};
