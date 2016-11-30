// Generated on 2016-01-10 using generator-wix-angular 1.0.38
'use strict';

module.exports = function (grunt) {
  require('wix-gruntfile')(grunt, {
    version: '1.0.38',
    port: 9000,
    livereload: 35729,
    preloadModule: 'siteGeneratorStaticsMetadataPreload',
    translationsModule: 'siteGeneratorStaticsMetadataTranslations',
    svgFontName: 'site-generator-statics-metadata',
    karmaConf: require('./karma.conf.js'),
    protractor: true,
    bowerComponent: true
  });

  grunt.modifyTask('yeoman', {
    //the address to which your local /_api is proxied to (to workaround CORS issues)
    api: 'http://www.pizza.wixpress.com/_api/',
    //api: 'http://localhost:3000',

    //this is the node.js fake server that e2e tests will use
    e2eTestServer: 'http://localhost:3333/',

    //the address that opens in your browser in grunt serve
    //(domain should be the same as staging so cookies will be sent in api requests)
    local: 'http://local.pizza.wixpress.com:<%= connect.options.port %>/'
  });

  //override sauce labs browser list
  //process.env.SAUCE_BROWSERS = 'Chrome FF';
  process.env.USE_JASMINE2 = 'true';

  //Follow this URL for instructions on how to override built-in definitions:
  //https://github.com/wix/wix-gruntfile/blob/master/README.md

  grunt.loadTasks('grunt-tasks');

  grunt.modifyTask('copy', {
    zipfile: {
      files: [{
        expand: true,
        cwd: 'app/scripts/statics',
        src: 'LayoutElements.zip',
        dest: 'dist/resources',
        rename: function (dest, src) {
          return dest + '/' + src.replace('.zip', '.zip.js');
        }
      },
      {
        expand: true,
        cwd: 'app/scripts/statics',
        src: 'ContactProtoTypeLayoutElements.zip',
        dest: 'dist/resources',
        rename: function (dest, src) {
          return dest + '/' + src.replace('.zip', '.zip.js');
        }
      },
        {
          expand: true,
          cwd: 'app/scripts/statics',
          src: '*/*.zip',
          dest: 'dist/resources',
          rename: function (dest, src) {
            return dest + '/' + src.replace('.zip', '.zip.js');
          }
        },
      {
        expand: true,
        cwd: 'app/scripts/statics',
        src: '*/*.raw',
        dest: 'dist/resources',
        rename: function (dest, src) {
          return dest + '/' + src.replace('.raw', '.raw.js');
        }
      }]
    }
  });

  grunt.hookTask('build').unshift('fetch-all-metadata');
  grunt.hookTask('build:ci').unshift('fetch-all-metadata');
  grunt.hookTask('build').push('copy:zipfile');
  grunt.hookTask('build:ci').push('copy:zipfile');
};
