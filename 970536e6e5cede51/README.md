# OpenRest
[OpenRest](http://www.openrest.com) (founded early 2011) is a cloud-based service that enables restaurant owners to easily create online ordering websites, mobile websites and native mobile apps. As of September 2014, a total of almost a thousand restaurants power their online ordering systems with OpenRest.

OpenRest offers an open API for developers. The OpenRest API is exposed as a standard web service communicating JSON over HTTPS.

This module will allow for Node.JS developers easy integration with the OpenRest API.

## Quick Example

    var openrest = require("openrest");
    
    openrest.request({
	    request:{
		    type:"get_organization",
		    organizationId:"5670039316205915"
	    },
	    callback:function(e) {
		    if (e.error) {
			    console.error(e.errorMessage);
			    return;
			}

			var organization = e.value;
	    }
    });

## Download
The source is available for download from [GitHub](https://github.com/openrest/openrest4node/). Alternatively, you can install using Node Package Manager (npm):
    npm install openrest
    
## Usage
### Request
    openrest.request(params);
Send a request to the server.

__Arguments__

`params` - Object with two members: 

 - `request` - The request to send. For a list of possible requests, see [here](https://github.com/openrest/openrest4j/tree/master/openrest4j-api/src/com/openrest/v1_1).
 - `callback(result)` - Callback called when result is received from the server.



