# bower-auto-release

This node module will help you to publish your package to bower in addition to already publishing it to npm.
Ideally you would only publish to npm, but as many older projects still use bower, this is sometime an unfortunate necessity.

## How to enable bower publishing for your existing npm module

Assuming you already defined you npm module in CI and already use the incredible [wnpm-release](https://github.com/wix-private/wnpm/tree/master/wnpm-ci) script to automatically bump your node module's version all you have to do in order to publish your package to bower is follow this simple steps:

### Add bower.json to your project

Just run the command `bower init`, and answer truthfully to all questions :P

### Add .bowerrc to your project

```json
{
  "registry": {
    "search": ["https://bower.herokuapp.com", "http://wix:wix@mirror.wixpress.com:3333"],
    "register": "http://wix:wix@mirror.wixpress.com:3333",
    "publish": "http://wix:wix@mirror.wixpress.com:3333"
  }
}
```

This is critical so that we work against wix's private bower registry

### Run bower-auto-release in your release script

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "http://repo.dev.wix/artifactory/api/npm/npm-local/"
  },
  "scripts": {
    "build": ":", 
    "test": ":",
    "release": "wnpm-release; bower-auto-release",
    "postpublish": "rm -f npm-shrinkwrap.json"
  },
  "devDependencies": {
    "wnpm-ci": "*",
    "bower-auto-release": "*"
  }
}
```

### Your package is automatically registered to bower

Once you're build is complete in CI, your package can be installed with - 
```sh
bower install package-name
```
where `package-name` is the name you gave your package in `bower init` above
