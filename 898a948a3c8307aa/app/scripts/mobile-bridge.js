/* jshint ignore:start */
// jscs:disable
//------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------- General Utility Functions
//------------------------------------------------------------------------------------------------------------------------------------------------

function _wixTouchBridge_execute(url) {

	var iframe = document.createElement("IFRAME");
	iframe.setAttribute("src", url);
	document.documentElement.appendChild(iframe);
	iframe.parentNode.removeChild(iframe);
	iframe = null;
}

function _wixTouchBridge_argToQuery(arg) {

	if (typeof(arg) == 'string') 
		return encodeURIComponent(arg);
	else
		return $.param(arg);
}

function _guid() {

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------- Engine Public Interface (module messages)
//------------------------------------------------------------------------------------------------------------------------------------------------

function wixTouchBridge_SendMessageToParent(message, arg) {

	var query = _wixTouchBridge_argToQuery(arg);
	_wixTouchBridge_execute("wixTouchBridge://SendMessageToParent/" + encodeURIComponent(message) + "/?" + query);
}

function wixTouchBridge_SendMessageToModuleByConf(moduleConf, message, arg) {

	var query = _wixTouchBridge_argToQuery(arg);
	_wixTouchBridge_execute("wixTouchBridge://SendMessageToModuleByConf/" + encodeURIComponent(moduleConf) + "/" + encodeURIComponent(message) + "/?" + query);
}

function wixTouchBridge_DisplayActivityModuleByConf(moduleConf, params) {

	_wixTouchBridge_execute("wixTouchBridge://DisplayActivityModuleByConf/" + encodeURIComponent(moduleConf) + "/?" + $.param(params));
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------- Cashier
//------------------------------------------------------------------------------------------------------------------------------------------------

var gCashierCallbacks = {};

window.addEventListener('message', function (event) {
	if(event.data && event.data.id && event.data.result && event.data.name === 'nativeMessage') {
		engine_sendResultCallback(event.data.id, event.data.result);
	}
});

//-------------------------------------------------------------------------------------------------
//----------------------------- Native Interface For Callbacks ------------------------------------

/**
* This function is called from the native engine with the result
*
* @param id {String} the id of the callback to get back to
* @param result {Object} the result to be passed to the callback. Can be a Boolean, an Object, or whatever single parameter that this callback is supposed to return
*/
function engine_sendResultCallback(id, result) {

	var callback = gCashierCallbacks[id];
	if (callback !== undefined) {
		callback(result);
	};
}

//-------------------------------------------------------------------------------------------------
//----------------------------- Helper functions --------------------------------------------------

function _addCallbackAndGenerateAuthQuery(callback, extraParamsObj) {

	if (extraParamsObj === undefined)  {
		extraParamsObj = {};
	}

	var callbackId = _guid();
	gCashierCallbacks[callbackId] = callback;

	var params = $.extend({}, {"callbackId": callbackId}, extraParamsObj);
	var query = _wixTouchBridge_argToQuery(params);
	return query;
}

//-------------------------------------------------------------------------------------------------
//----------------------------- Public interface --------------------------------------------------

/**
* Checks if the a previously saved secured info exists
*
* @param infoType {String} the type of the info. Serves as the key to save/load the data (for example: cardInfo1, userDetails etc.)
* @param {Function}[callback] callback function
*		 @param infoExists {Boolean}
* @param iframeId {String} the id of the iframe that the page which uses the bridge is loaded in.
*						   when this parameter is sent, the native code will use postMessage on the contentWindow of the iframe to pass the result to the iframe.
*						   otherwise, the native code will just call the engine_sendResultCallback on the current page
*/
function wixTouchBridge_isSecuredInfoExists(infoType, callback, iframeId) {

	var query = _addCallbackAndGenerateAuthQuery(callback, {"infoType": infoType, "iframeId": iframeId || ""});
	_wixTouchBridge_execute("wixTouchBridge://IsSecuredInfoExists/" + "?" + query);
}

/**
* Specifies the current flow type that that app should work with
* this serves the app as a remote setting that can be changed if necessary
*
* @param flowType {String} the flow type. possible values: pin_only, quick_only, quick_on_lockable
* @param {Function}[callback] callback function
*		 @param success {Boolean}
* @param iframeId {String} the id of the iframe that the page which uses the bridge is loaded in.
*						   when this parameter is sent, the native code will use postMessage on the contentWindow of the iframe to pass the result to the iframe.
*						   otherwise, the native code will just call the engine_sendResultCallback on the current page
*/
function wixTouchBridge_specifyFlow(flowType, callback, iframeId) {

	var extraParamsObj = {"flowType": flowType, "iframeId": iframeId || ""};
	var query = _addCallbackAndGenerateAuthQuery(callback, extraParamsObj);
	_wixTouchBridge_execute("wixTouchBridge://SpecifyFlow/" + "?" + query);
}

/**
* Shows a modal screen or a simple dialog (depends on the flow type), which prompt the user for authentication before secured info can be loaded
  After the user is authenticated, the saved secured info will be retreived.
  Works only if there is a previously saved secured info
*
* @param infoType {String} the type of the info. Serves as the key to save/load the data (for example: cardInfo1, userDetails etc.)
* @param loadTitle {String} the title of the notification which will be shown to the user when authenticating
* @param loadText {String} the text which will be shown to the user when authenticating, which is specific for loading secured info
* @param {Function}[callback] callback function
*		 @param securedInfo {Object} an object containing all secured info
* @param iframeId {String} the id of the iframe that the page which uses the bridge is loaded in.
*						   when this parameter is sent, the native code will use postMessage on the contentWindow of the iframe to pass the result to the iframe.
*						   otherwise, the native code will just call the engine_sendResultCallback on the current page
*/
function wixTouchBridge_loadSecuredInfo(infoType, loadTitle, loadText, approveButtonText, callback, iframeId) {

	var extraParamsObj = {"infoType": infoType, "loadTitle": loadTitle, "loadText": loadText, "approveButtonText": approveButtonText, "iframeId": iframeId || ""};
	var query = _addCallbackAndGenerateAuthQuery(callback, extraParamsObj);
	_wixTouchBridge_execute("wixTouchBridge://LoadSecuredInfo/" + "?" + query);
}

/**
* Shows a modal screen or a simple dialog (depends on the flow type), which prompt the user for authentication before secured info can be saved
  After the user is authenticated, the secured will be securely saved to the device
  In case this secured already exists, it's info will be updated
*
* @param infoType {String} the type of the info. Serves as the key to save/load the data (for example: cardInfo1, userDetails etc.)
* @param securedInfo {Object} an object containing the secured information to save
* @param saveTitle {String} the title of the notification which will be shown to the user when authenticating
* @param saveText {String} the text which will be shown to the user when authenticating, which is specific for saving secured info
* @param loadHintText {String} the text which will be shown as a hint to the user about the save data on the load screen (for example: **** **** **** **** 1234)
* @param {Function}[callback] callback function
*		 @param success {Boolean} true if the info was saved successfuly
* @param iframeId {String} the id of the iframe that the page which uses the bridge is loaded in.
*						   when this parameter is sent, the native code will use postMessage on the contentWindow of the iframe to pass the result to the iframe.
*						   otherwise, the native code will just call the engine_sendResultCallback on the current page
*/
function wixTouchBridge_saveSecuredInfo(infoType, securedInfo, saveTitle, saveText, loadHintText, callback, iframeId) {

	var securedInfoJsonString = encodeURIComponent(JSON.stringify(securedInfo));
	var extraParamsObj = {"saveTitle": saveTitle, "saveText": saveText, "infoType": infoType, "securedInfo": securedInfoJsonString, "loadHintText": loadHintText, "iframeId": iframeId || ""};
	var query = _addCallbackAndGenerateAuthQuery(callback, extraParamsObj);
	_wixTouchBridge_execute("wixTouchBridge://SaveSecuredInfo/" + "?" + query);
}

/**
* Deletes previously saved data from the device
*
* @param infoType {String} the type of the info. Serves as the key to save/load the data (for example: cardInfo1, userDetails etc.)
* @param silent {Boolean} when true, the information will get deleted without any user approval
* @param {Function}[callback] callback function
*		 @param success {Boolean} true if the info was deleted successfuly
* @param iframeId {String} the id of the iframe that the page which uses the bridge is loaded in.
*						   when this parameter is sent, the native code will use postMessage on the contentWindow of the iframe to pass the result to the iframe.
*						   otherwise, the native code will just call the engine_sendResultCallback on the current page
*/
function wixTouchBridge_deleteSecuredInfo(infoType, silent, callback, iframeId) {

	var query = _addCallbackAndGenerateAuthQuery(callback, {"infoType": infoType, "silent": silent, "iframeId": iframeId || ""});
	_wixTouchBridge_execute("wixTouchBridge://DeleteSecuredInfo/" + "?" + query);
}
