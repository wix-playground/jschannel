var chai = require("chai");
var openrest = require('../index.js');
var OpenrestClient = require("openrest4js").OpenrestClient;
var xhr2 = require('xhr2');
global.XMLHttpRequest = xhr2.XMLHttpRequest;

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

describe("Openrest node component", function() {
    it("should return results from the server", function(done) {
        openrest.request({
            request:{
                "type":"get_organization",
                "organizationId":"us.openrest.com"
            },
            callback:function(e) {

                expect(e.error).to.not.exist;
                expect(e.value.id).to.equal("us.openrest.com");
                done();
            }
        });
    });

    it("should be timed out", function(done) {
        openrest.request({
            request:{
                "type":"get_organization",
                "organizationId":"us.openrest.com"
            },
            timeout: 1,
            callback:function(e) {
                expect(e.error).to.equal('timeout');
                done();
            }
        });
    });

    it("should return results from server as a promise", function() {
        return openrest.request({request:{"type":"get_organization", "organizationId":"us.openrest.com"}}).then(function(e) {
            expect(e.value.id).to.equal("us.openrest.com");
        });
    });

    it("should return error when sending a bad request", function(done) {
        openrest.request({
            request:{
                "type":"get_organization",
                "organizationId":"us.opaenrest.com"
            },
            callback:function(e) {
                expect(e.error).to.equal("not_found");
                done();
            }
        });
    });

    it("should fail (as a promise) when sending a bad request", function() {
        return expect(openrest.request({request:{"type":"get_organization", "organizationId":"us.openarest.com"}})).to.eventually.be.rejected;
    });

    it("should fail gracefully when getting an catastrophic error from the server", function() {

        var client = new OpenrestClient({XMLHttpRequest : XMLHttpRequest, apiUrl:"http://www.google.com"});
        return openrest.request({client:client, request:{"type":"get_organization", "organizationId":"us.openrest.com"}}).then(function() {
            return Q.reject("Should fail");
        }).catch(function(e) {
            expect(e.error).to.equal("protocol");
        });
    });

    it("should print out performance", function() {
        var performance = openrest.getPerformance();
        console.log(performance);
    });
});

