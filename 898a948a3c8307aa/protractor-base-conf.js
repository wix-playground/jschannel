'use strict';

var serverRunner = require('wix-gruntfile/server-runner');
var serverInstance;

module.exports.config = {
  beforeLaunch: function () {
    serverInstance = serverRunner('app/test/e2e/lib/mock-server.js', ['3333']);
    return serverInstance.promise;
  },
  onPrepare: function () {
    serverRunner.addSessionCookieCleaner();
  },
  afterLaunch: function () {
    serverInstance.kill();
  }
};
