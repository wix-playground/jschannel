'use strict';

angular
  .module('siteGeneratorStaticsMetadataApp')
  .factory('BackendContentElement', function (StaticDataHandler, staticContentElementsArr) {
    return new StaticDataHandler(staticContentElementsArr);
  });
