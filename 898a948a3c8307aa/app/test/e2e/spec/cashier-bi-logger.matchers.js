'use strict';

beforeEach(function () {

  function getDomainFromUrl(url) {
    var index = url.indexOf('?');
    return url.slice(0, index === -1 ? url.length : index);
  }

  function getUrlParams(url) {
    if (url.asymmetricMatch) {
      return url;
    } else if (typeof url !== 'string') {
      Object.keys(url).forEach(function (key) {
        if (url[key] instanceof RegExp) {
          var regexp = url[key];
          url[key] = {
            asymmetricMatch: function (value) {
              return regexp.test(value);
            }
          };
        } else if (!url[key] || !url[key].asymmetricMatch) {
          url[key] = url[key] + '';
        }
      });
      return url;
    }

    var params = {};
    var paramsString = url.slice(url.indexOf('?'));

    paramsString.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
      params[key] = decodeURIComponent(value);
    });

    return params;
  }

  jasmine.addMatchers({
    toMatchBiAdapter: function () {
      return {compare: function (actual, expected) {
        return {pass: getDomainFromUrl(actual.url) === getDomainFromUrl(expected)};
      }};
    },
    toMatchBiUrl: function () {
      return {compare: function (actual, expected) {
        //remove msid and metaSiteId when solving CE-2337
        var ignoredKeys = ['_', 'ts', 'msid', 'metaSiteId', 'cat', 'sev', 'iss', 'ver', 'ownerId', 'roles'];
        var actualUrlParams = getUrlParams(actual.url);
        var expectedUrlParams = getUrlParams(expected);

        if (typeof expected === 'string' &&
          getDomainFromUrl(actual.url) !== getDomainFromUrl(expected)) {
          return {pass: false};
        }

        ignoredKeys.forEach(function (key) {
          if (actualUrlParams.hasOwnProperty(key) && !expectedUrlParams.hasOwnProperty(key)) {
            expectedUrlParams[key] = jasmine.any(String);
          }
        });

        // actual = actualUrlParams;
        if (expectedUrlParams.asymmetricMatch) {
          return {pass: expectedUrlParams.asymmetricMatch(actualUrlParams)};
        } else {
          return {pass: jasmine.objectContaining(expectedUrlParams).asymmetricMatch(actualUrlParams) &&
                 Object.keys(expectedUrlParams).length === Object.keys(actualUrlParams).length};
        }
      }};
    }
  });
});
