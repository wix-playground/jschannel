'use strict';

module.exports = function (grunt) {

  var q = require('q');
  var fs = require('fs');
  var JSZip = require('jszip');
  var mkdirp = require('mkdirp');
  var _ = require('lodash');
  var nodeFetch = require('node-fetch');
  var endpointPassword;
  var outDir = 'app/scripts/statics';

  function getScriptStart(fileName) {
    return 'angular.module(\'siteGeneratorStaticsMetadataApp\').value(\'static' + fileName + 'Arr\', ';
  }

  function getScriptEnd() {
    return ');';
  }

  function fetchTablePage(tableName, createdAfterID) {
    // var env = 'inari';
    var env = 'prod';
    let urls = {inari: 'http://local.inari.wixpress.com:1337/',
                prod: 'https://www.wix.com/_api/site-generator-http-api/'};
    let passwords = {inari: 'password',
                     prod: endpointPassword};
    let url = urls[env];
    endpointPassword = passwords[env];

    return nodeFetch(url + tableName + "/dump" +
      "?password=" + endpointPassword +
      "&createdAfter=" + (createdAfterID || ""),
      {compress: true})
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        return JSON.parse(data);
      });
  }

  function fetchTable(tableName) {

    var deferred = q.defer();
    var allPages = [];
    var createdAfterID = ""; // empty value gives the first page

    // Recursively call the next page by supplying the last ID of the current page
    function loadNextPages() {
      grunt.log.ok("Reading table " + tableName + ": page starting at ID = " + (createdAfterID || "0"));
      fetchTablePage(tableName, createdAfterID)
        .then(function(page) {
          allPages.push(page);
          if(page.length > 0) {
            createdAfterID = page[page.length-1].id;
            loadNextPages();
          }
          else {
            deferred.resolve(_.flatten(allPages));
          }
        })
        .catch(function (error) {
          deferred.reject(error);
        });
    }

    loadNextPages();
    return deferred.promise;

  }

  function saveToScript(targetBasename, data) {
    grunt.file.write(outDir + '/' + targetBasename + '.js', getScriptStart(targetBasename) + JSON.stringify(data) + getScriptEnd());
  }

  function isSingle(forContent) {
    let singles = ['Bookings', 'GetSubscribers', 'Stores', 'Blog', 'Music', 'ProGallery', 'BandsInTown'];
    return forContent.length === 1 && singles.indexOf(forContent[0].split('_')[0]) !== -1;
  }

  function savePerContent(targetBasename, data) {
    mkdirp(outDir + '/' + targetBasename);
    data = _.groupBy(data, x => isSingle(x.data.forContent) ? x.data.forContent[0] : 'All');

    saveToScript(targetBasename, data['All']);

    _.forEach(_.pickBy(data, (value, key) => key !== 'All'), (value, key) => {
      saveAsZip(`${targetBasename}/${key}`, value);
    });
  }

  function fetch(tableName, targetBasename, postProcessFunc, filterFunc, fieldsToJSONparse, savingFunc) {
    return fetchTable(tableName)
      .then(function (table) {
        var data = table.filter(function (item) {
          return !(item.archive || item.archived) && (filterFunc ? filterFunc(item) : true);
        }).map(postProcessFunc);

        if (fieldsToJSONparse) {
          data = data.map(function (item) {
            fieldsToJSONparse.forEach(function (field) {
              item[field] = JSON.parse(item[field]);
            });
            return item;
          });
        }

        savingFunc = savingFunc || saveToScript;
        savingFunc(targetBasename, data);

        grunt.log.ok('Successfully fetched ' + tableName + ', count ' + data.length);
      })
      .catch(function (error) {
        grunt.log.error(error);
        return q.reject(error);
      });
  }

  function dontFilter(item) {
    return true;
  }

  function saveAsZipByFields(fieldNames, defaultValues) {
    return function(targetBasename, dataArray) {
      var zip = new JSZip();
      var groups = _.groupBy(dataArray, function (datum) {
        return fieldNames.map(function (fieldName, idx) {
          return datum[fieldName] || defaultValues[idx] || 'undefined';
        }).join('_');
      });
      mkdirp(outDir + "/" + targetBasename);
      _.forOwn(groups, function (groupItems, key) {
        fs.writeFile(outDir + "/" + targetBasename + "/" + key + ".raw", JSON.stringify(groupItems));
        zip.file(key, JSON.stringify(groupItems));
      });
      saveToScript(targetBasename + 'Base64', zip.generate({type: 'base64', compression: 'DEFLATE', compressionOptions: {level: 9}}));
      fs.writeFile(outDir + "/" + targetBasename + ".zip", zip.generate({type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: {level: 9}}));
    };
  }

  function saveAsZip(targetBasename, dataArray) {
    var zip = new JSZip();
    zip.file('data', JSON.stringify(dataArray));
    fs.writeFile(outDir + "/" + targetBasename + ".zip", zip.generate({type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: {level: 9}}));
  }

  grunt.registerTask('fetch-all-metadata', 'Fetch data from node.js server', function () {

    var done = this.async();
    var emptyWidths = 0;
    var emptyArgsSignatures = 0;

    function omitFields(entry) {
      entry = _.omit(entry, ['createdAt', 'updatedAt', 'archive', 'archived', 'updatedBy', 'createdBy', 'owner', 'snapShot']);
      if ('data' in entry) {
        var dataParsed = JSON.parse(entry.data);
        if ('snapShot' in dataParsed) {
          entry.data = JSON.stringify(_.omit(dataParsed, 'snapShot'));
        }
      }
      return entry;
    }

    q.when()
      .then(getEndpointPassword)
      .then(function (password) {
        endpointPassword = password;
      })
      .then(function () {
        return fetch('contentelements', 'ContentElements', omitFields, dontFilter);
      })
      .then(function () {
        return fetchTable('scenarios');
      })
      .then(function (scenarios) {
        var defaultScenariosIDs = new Set(_.map(_.filter(scenarios, {default: true}), 'id'));
        function filterByScenarioIDs(le) {
          return !le.scenarioId || defaultScenariosIDs.has(le.scenarioId);
        }
        function filterByRequiredFields (le) {
          if (!le.width) {
            emptyWidths++;
          }
          if (!le.argsSignature) {
            emptyArgsSignatures++;
          }
          return le.width && le.argsSignature;
        }
        function filterProtoTypeContacts (le) {
          return !le.generator;
        }
        function filterLEs (le) {
          return filterByScenarioIDs(le) && filterByRequiredFields(le) && filterProtoTypeContacts(le);
        }
        return fetch('layoutelements', 'LayoutElements', omitFields, filterLEs, null, saveAsZipByFields(['width', 'argsSignature'], ['none', 'none']));
      })
      .then(function () {
        grunt.log.ok('Omitted ' + emptyWidths + ' LEs with empty width');
        grunt.log.ok('Omitted ' + emptyArgsSignatures + ' LEs with empty argsSignature');
      })
      .then(function () {
        function filterLEs (le) {
          return le.generator;
        }
        return fetch('layoutelements', 'ContactProtoTypeLayoutElements', omitFields, filterLEs, null, saveAsZipByFields([], []));
      })
      .then(function () {
        return fetch('layoutpresets', 'LayoutPresets', omitFields, dontFilter, ['data'], savePerContent);
      })
      .then(function () {
        var filterOnlyKits = function(theme) {
          return theme.color && theme.font;
        };
        return fetch('themes', 'Themes', omitFields, filterOnlyKits);
      })
      .then(function () {
        return fetch('verticaldefaultvalues', 'VerticalDefaultValues', omitFields);
      })
      .then(function () {
        done(true);
      })
      .catch(function (error) {
        grunt.log.error(error);
        done(false);
      });

  });

};


function getEndpointPassword() {

  var _ = require('lodash');
  var fs = require('fs');
  var q = require('q');
  var xml2js = require('xml2js');
  var parser = new xml2js.Parser();
  var passwordFile = '/opt/private/com.wixpress.site-generator-http-api/appengine-web.xml';
  var errStr = 'ERROR: Expected to find Wix endpoint password inside <system-properties> as <property name:"dumpPassword" value="..."> in file ' + passwordFile;
  var endpointPassword;

  var deferred = q.defer();

  fs.readFile(passwordFile, function (err, data) {
    if (err) {
      deferred.reject(err);
    }
    parser.parseString(data, function (err, result) {
      if (err) {
        deferred.reject(err);
      }
      if (!result || !result['system-properties'] || !result['system-properties']['property']) {
        deferred.reject(errStr);
      }
      else {
        _.forEach(result['system-properties']['property'], function (property) {
          if (property.$.name === 'secrets-1454316270') {
            var endpointPasswordJSONInBase64 = property.$.value;
            var endpointPasswordJSON = new Buffer(endpointPasswordJSONInBase64, 'base64').toString("ascii");
            endpointPassword = JSON.parse(endpointPasswordJSON)['credentials']['dump']['password'];
            deferred.resolve(endpointPassword);
          }
        });
        if (!endpointPassword) {
          deferred.reject(errStr);
        }
      }
    });

  });

  return deferred.promise;

}
