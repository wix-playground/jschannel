'use strict';

angular
  .module('siteGeneratorStaticsMetadataApp')
  .factory('BackendLayoutPreset', function (metadataReader, staticLayoutPresetsArr, $http, $q) {

    function isSingle(forContent) {
      let singles = ['Bookings', 'GetSubscribers', 'Stores', 'Blog', 'Music', 'ProGallery', 'BandsInTown'];
      return singles.indexOf(forContent.split('_')[0]) !== -1;
    }

    function staticsFilter(forContent) {
      return staticLayoutPresetsArr.filter(preset => {
        return preset.data.forContent.indexOf(forContent) !== -1;
      });
    }

    function fetchPresets(forContent) {
      return metadataReader.readZip(`LayoutPresets/${forContent}`)
        .then(zip => ({data: JSON.parse(zip.file('data').asText())}))
        .catch(() => ({data: []}))
        .then(({data: presets}) => {
          return presets.concat(staticsFilter(forContent));
        });
    }

    return {
      search: function (options) {
        if (options && options.forContent) {
          if (isSingle(options.forContent)) {
            return fetchPresets(options.forContent);
          } else {
            return $q.when(staticsFilter(options.forContent));
          }
        } else {
          return $q.when(staticLayoutPresetsArr);
        }
      }
    };
  });
