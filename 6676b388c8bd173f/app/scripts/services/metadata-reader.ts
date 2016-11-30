'use strict';

class MetadataReader {
  resourcesUrl: string;

  /* @ngInject */
  constructor(private $http,
              private $q,
              private wixAngularTopology) {
    this.resourcesUrl = (this.wixAngularTopology.staticsUrl || '') + 'bower_components/site-generator-statics-metadata/dist/resources/';
  }

  readRaw(table, key) {
    return this.$http.get(`${this.resourcesUrl}${table}/${encodeURIComponent(key)}.raw.js`, {cache: true});
  }

  readZip(name) {
    return this.readZipAt(this.resourcesUrl + name + '.zip.js');
  }

  readZipAt(path) {
    let defer = this.$q.defer();
    JSZipUtils.getBinaryContent(path, function (err, data) {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve(new JSZip(data));
      }
    });
    return defer.promise;
  }
}

angular
  .module('siteGeneratorStaticsMetadataApp')
  .service('metadataReader', MetadataReader);
