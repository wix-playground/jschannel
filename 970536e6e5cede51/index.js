var Q = require("q");

var OpenrestClient = require("openrest4js").OpenrestClient;

var apiUrl = null;

var _requests = {};
var _monitor = 0;
var _batch = null;

module.exports = {
    request:function(params) {
        var _client = new OpenrestClient({XMLHttpRequest : XMLHttpRequest, apiUrl:(apiUrl || "https://api.openrest.com/v1.1"), timeout:params.timeout});

        var request = params.request;
        var callback = params.callback;
        var client = params.client || _client;

        var defer = Q.defer();
        var startTime = (new Date()).getTime();
        _requests[request.type] = _requests[request.type] || [];

        if (_batch) {
            _batch.push({params:params, defer:defer});
            return defer.promise;
        }

        client.request({
            request:request,
            callback:function(e) {
                var t = (new Date()).getTime() - startTime;
                _monitor++; // Monitor only first 100 transactions
                if (e.error) {
                    if (_monitor < 100) _requests[request.type].push({'s':false, 't':t});
                    defer.reject(e);
                } else {
                    if (_monitor < 100) _requests[request.type].push({'s':true, 't':t});
                    defer.resolve(e);
                }

                if (callback) {
                    callback(e);
                }
            }
        });

        return defer.promise;
    },
    setApiUrl:function(val) {
        apiUrl = val;
    },
    getPerformance:function() {
        return _requests;
    },
    setBatch:function() {
        _batch = _batch || [];
    },
    releaseBatch:function() {
        var batch = _batch;
        _batch = null;

        var requests = batch.map(function(b) {
            return b.params.request;
        });

        this.request({request:{type:'batch', requests:requests}}).then(function(result) {
            var responses = result.value.responses;
            responses.forEach(function(response, index) {
                if (response.error) {
                    batch[index].defer.reject(response);
                } else {
                    batch[index].defer.resolve(response);
                }
                if (batch[index].params.callback) {
                    batch[index].params.callback(response);
                }
            });
        }).catch(function(error) {
            batch.forEach(function(b) {
                b.reject(error);
                if (b.params.callback) {
                    bparams.callback(error);
                }
            });
        });
    }
}
