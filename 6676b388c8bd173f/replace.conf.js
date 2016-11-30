'use strict';

var experiments = {

};

module.exports = {
  '${debug}': 'true',
  '${enableMocks}': 'false',
  '${experiments}': JSON.stringify(experiments),
  '${locale}': 'en',

  '${staticBaseUrl}': '//static.parastorage.com/',
  '${staticsUrl}': '',
  '${newRelicEndUserHeader}': '',
  '${newRelicEndUserFooter}': ''
};
