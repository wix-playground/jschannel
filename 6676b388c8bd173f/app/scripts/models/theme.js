'use strict';

angular
  .module('siteGeneratorStaticsMetadataApp')
  .factory('BackendTheme', function (StaticDataHandler, staticThemesArr) {
    return new StaticDataHandler(staticThemesArr);
  });
