'use strict';

angular
  .module('siteGeneratorStaticsMetadataApp')
  .factory('BackendVerticalDefaultValue', function (StaticDataHandler, staticVerticalDefaultValuesArr) {
    return new StaticDataHandler(staticVerticalDefaultValuesArr);
  });
