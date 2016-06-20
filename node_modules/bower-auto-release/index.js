#!/usr/bin/env node
var workingDir = process.cwd();
var packageJson = require(workingDir + '/package.json');
var bowerJson = require(workingDir + '/bower.json');
var bower = require('bower');
var distFolder = 'dist';

if (process.argv[2] && process.argv[2] === '--dist' && process.argv[3]) {
  distFolder = process.argv[3];
}

require('child_process')
  .spawn(__dirname + '/release.sh', [packageJson.version, workingDir, distFolder], {stdio: 'inherit'})
  .on('close', function () {
    bower.commands.lookup(bowerJson.name).on('end', function(result) {
      if(!result) {
        bower.commands.register(bowerJson.name, process.env.GIT_REMOTE_URL);
      }
    });
  });
