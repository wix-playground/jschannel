'use strict';

describe('Factory: BackendLayoutPreset', () => {
  const single = 'Bookings';
  let origGetBinaryContent;

  function flushPromises() {
    inject($rootScope => $rootScope.$digest());
  }

  function itemWithContent(x, remote) {
    return {data: {forContent: [x], remote}};
  }

  function later(f) {
    return () => setTimeout(f, 0);
  }

  beforeEach(() => {
    module('siteGeneratorStaticsMetadataApp');
    module({staticLayoutPresetsArr: [itemWithContent(single, false), itemWithContent('a', false)]});
    module(wixAngularTopologyProvider => wixAngularTopologyProvider.setStaticsUrl('xxx/'));
    origGetBinaryContent = JSZipUtils.getBinaryContent;
  });

  function setValidZipResponse(forContent) {
    let expectedURL = `xxx/bower_components/site-generator-statics-metadata/dist/resources/LayoutPresets/${encodeURIComponent(forContent)}.zip.js`;

    inject(function ($q) {
      JSZipUtils.getBinaryContent = function (url, callback) {
        $q.when().then(() => {
          if (url === expectedURL) {
            var leZipFile = new JSZip();
            leZipFile.file('data', JSON.stringify([itemWithContent(single, true)]));
            callback(undefined, leZipFile.generate({
              type: 'arraybuffer',
              compression: 'DEFLATE',
              compressionOptions: {level: 1}
            }));
          }
        });
      };
    });
  }

  function setInvalidZipResponse() {
    JSZipUtils.getBinaryContent = (url, callback) => {
      callback(Error('404 error'), null);
    };
  }

  function unsetZipResponse() {
    JSZipUtils.getBinaryContent = origGetBinaryContent;
  }

  afterEach(inject(($httpBackend: ng.IHttpBackendService) => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('should return static data if no options passed', done => inject(BackendLayoutPreset => {
    BackendLayoutPreset.search().then(x => expect(x.length).toBe(2)).then(later(done));
    flushPromises();
  }));

  it('should return static data if no forContent option passed', done => inject(BackendLayoutPreset => {
    BackendLayoutPreset.search({}).then(x => expect(x.length).toBe(2)).then(later(done));
    flushPromises();
  }));

  it('should return static data if forContent is not of tpa', done => inject(BackendLayoutPreset => {
    BackendLayoutPreset.search({forContent: 'a'}).then(x => expect(x.length).toBe(1)).then(later(done));
    flushPromises();
  }));

  describe('reading a LayoutPresets zip', () => {

    afterEach(() => {
      unsetZipResponse();
    });

    it('should merge local content with remotely fetched content', done => inject(BackendLayoutPreset => {
      setValidZipResponse(single);

      BackendLayoutPreset.search({forContent: single}).then(x => {
        expect(x).toEqual([itemWithContent(single, true), itemWithContent(single, false)]);
      }).then(later(done));

      flushPromises();
    }));

    it('should return only local content if remote request failed', done => inject(BackendLayoutPreset => {
      setInvalidZipResponse();

      BackendLayoutPreset.search({forContent: single}).then(x => {
        expect(x).toEqual([itemWithContent(single, false)]);
      }).then(later(done));

      flushPromises();
    }));
  });

  // it('should cache remote content', done => inject(($q, BackendLayoutPreset) => {
  //   setValidZipResponse(single);
  //   $q.all([BackendLayoutPreset.search({forContent: single}), BackendLayoutPreset.search({forContent: single})]).then(x => {
  //     expect(x[0]).toEqual([itemWithContent(single, true), itemWithContent(single, false)]);
  //     expect(x[1]).toEqual([itemWithContent(single, true), itemWithContent(single, false)]);
  //     // TODO: check somehow if the cache was used, or dump this test (maybe explicit caching is not needed)
  //   }).then(later(done));
  //   flushPromises();
  //   unsetZipResponse();
  // }));
});
