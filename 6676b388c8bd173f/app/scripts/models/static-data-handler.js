'use strict';

angular
  .module('siteGeneratorStaticsMetadataApp')
  .factory('StaticDataHandler', function ($q) {
    function StaticDataHandler(data) {
      this.data = data;
    }
    StaticDataHandler.prototype.search = function (/*limit, skip, where*/) {
      //return _.slice(_.filter(this.data, where || function () {
      //    return true;
      //  }), skip || 0, (skip || 0) + limit);
      return $q.when(this.data);
    };
    return StaticDataHandler;
  });
