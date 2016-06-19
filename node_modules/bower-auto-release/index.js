#!/usr/bin/env node
var workingDir = process.cwd();
var packageJson = require(workingDir + '/package.json');
var bowerJson = require(workingDir + '/bower.json');
var bower = require('bower');

require('child_process')
  .spawn(__dirname + '/release.sh', [packageJson.version, workingDir], {stdio: 'inherit'})
  .on('close', function () {
    try {
      bower.commands.info(bowerJson.name);
    } catch (error) {
      bower.commands.register(bowerJson.name, process.env.GIT_REMOTE_URL);
    }
  });
