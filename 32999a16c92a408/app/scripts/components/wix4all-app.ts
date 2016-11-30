/// <reference path="../../../reference.ts" />
'use strict';

class Wix4allApp {
  clicks: number;
  name: string;

  /* @ngInject */
  constructor(private $scope: ng.IScope) {

    this.clicks = 0;
  }

  onClick() {
    this.clicks++;
  }
}

angular
  .module('wix4allAppInternal')
  .component('wix4allApp', {
    templateUrl: 'views/wix4all-app.html',
    controller: Wix4allApp,
    bindings: {
      name: '='
    }
  });
