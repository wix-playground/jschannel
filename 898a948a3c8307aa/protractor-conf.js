'use strict';

var config = require('wix-gruntfile/protractor-conf').config;

config.capabilities.browserName = 'chrome';

module.exports.config = config;

config.chromeDriver = '/usr/local/bin/chromedriver';
