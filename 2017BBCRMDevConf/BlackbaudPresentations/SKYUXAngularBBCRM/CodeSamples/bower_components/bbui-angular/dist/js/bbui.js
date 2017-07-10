/*global angular */

// Declare the one global variable under which all other BBUI components will reside.
(function () {
    "use strict";

    angular.module('bbui.core', [])
        .factory('bbui', ['$window', function ($window) {
            var BBUI,
                // JSLint chokes on this regular expression if a literal is used.
                escapeRegExpRegEx = new RegExp("[.*+?|()\\[\\]{}\\\\\\$\\^]", "g"),
                euc = $window.encodeURIComponent,
                TYPE_STRING = "string";

            function objEquals(value1, value2, ignoreCase) {
                if (value1 === value2) {
                    return true;
                }

                if (ignoreCase && typeof value1 === TYPE_STRING && typeof value2 === TYPE_STRING) {
                    return value1.toUpperCase() === value2.toUpperCase();
                }

                return false;
            }

            /**
             * @class bbui
             * Contains methods for issuing XMLHttpReqests as well as some basic helper functions.
             * @singleton
             */
            BBUI = {

                /**
                 * @readonly
                 * Represents an empty GUID value.
                 * @type {String}
                 */
                emptyGuid: "00000000-0000-0000-0000-000000000000",

                /**
                 * Returns a flag indicating the given object is defined and its value is not null.   This function is mainly
                 * used to see if a JSON property is present, since the absense of a property usually means "no change" rather
                 * than "this property's value was changed to null."
                 * <br/><br/>
                 * Calling this function is equivalent to evaluating <tt>typeof obj !== "undefined" && obj !== null</tt>.
                 *
                 * @param {Object} obj
                 * The object to check.
                 *
                 * @return {Boolean}
                 * False if the object is null or undefined; otherwise, true.
                 */
                is: function (obj) {
                    return typeof obj !== "undefined" && obj !== null;
                },

                /**
                 * Finds an item in an array with the specified property value.
                 *
                 * @param {Array} items
                 * The array to search.
                 *
                 * @param {String} propName
                 * The property's name.
                 *
                 * @param {Object} value
                 * The property's value.
                 *
                 * @param {Boolean} [ignorePropCase=false]
                 * Does a case-insensitive search on the property's name.
                 *
                 * @param {Boolean} [ignoreValueCase=false]
                 * Does a case-insensitive search on the property's value.
                 *
                 * @return {Object}
                 * The first item in the array that matches the property value (or null if no matching item is found).
                 */
                findByProp: function (items, propName, value, ignorePropCase, ignoreValueCase) {

                    var i,
                        item,
                        propValue;

                    if (items) {
                        i = items.length || 0;
                        while (i--) {
                            item = items[i];

                            if (item) {
                                propValue = BBUI.getPropValue(item, propName, ignorePropCase);
                                if (objEquals(propValue, value, ignoreValueCase)) {
                                    return item;
                                }
                            }
                        }
                    }

                    return null;
                },

                /**
                 * Gets an object's property value using a case-insensitive comparison if specified.
                 *
                 * @param {Object} obj
                 * The object containing the property.
                 *
                 * @param {String} propName
                 * The name of the property.
                 *
                 * @param {Boolean} [ignoreCase]
                 * Indicates whether to ignore case on the property.
                 *
                 * @param {Object} [defaultValue]
                 * The default value to return if the property does not exist.
                 *
                 * @return {Object}
                 */
                getPropValue: function (obj, propName, ignoreCase, defaultValue) {

                    var p,
                        propNameUpper;

                    if (obj && propName) {
                        if (typeof obj[propName] !== "undefined") {
                            return obj[propName];
                        }

                        if (ignoreCase) {
                            propNameUpper = propName.toUpperCase();
                            for (p in obj) {
                                /*jslint forin: true */
                                if (p.toUpperCase() === propNameUpper) {
                                    return obj[p];
                                }
                            }
                        }
                    }

                    return defaultValue;
                },

                /**
                 * Copies the properties of the specified object to a new object and returns the new object.
                 *
                 * @param {Object} obj
                 * Object to clone.
                 *
                 * @return {Object}
                 * The cloned object.
                 */
                clone: function (obj) {

                    var cloneObj,
                        p;

                    if (typeof obj !== "undefined") {
                        if (obj === null) {
                            return null;
                        }
                        cloneObj = {};
                        for (p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                cloneObj[p] = obj[p];
                            }
                        }
                    }

                    return cloneObj;
                },

                /**
                 * Copy properties from one object onto another.
                 *
                 * @param {Object} to
                 * @param {Object} from
                 */
                copyProps: function (to, from) {
                    var p;

                    if (from) {
                        for (p in from) {
                            if (from.hasOwnProperty(p)) {
                                to[p] = from[p];
                            }
                        }
                    }
                },

                /**
                 * Compares two GUID values by normalizing capitalization of each GUID and comparing them as strings.
                 *
                 * @param {String} guid1
                 * The first GUID to compare.
                 *
                 * @param {String} guid2
                 * The second GUID to compare.
                 *
                 * @param {String} [guid1Upper]
                 * A flag indicating the first GUID is already upper-cased.  When true, a new upper-cased string is not created for the
                 * first GUID for comparison.  Use this flag as an optimization when comparing GUIDs in a loop so a new string does not
                 * have to be created for each iteration of the loop when the GUID does not change between iterations.
                 *
                 * @param {String} [guid2Upper]
                 * A flag indicating the second GUID is already upper-cased.  When true, a new upper-cased string is not created for the
                 * second GUID for comparison.  Use this flag as an optimization when comparing GUIDs in a loop so a new string does not
                 * have to be created for each iteration of the loop when the GUID does not change between iterations.
                 *
                 * @return {Boolean}
                 * A flag indicating whether the two GUIDs are the same.
                 */
                guidEquals: function (guid1, guid2, guid1Upper, guid2Upper) {

                    if (typeof guid1 !== TYPE_STRING || typeof guid2 !== TYPE_STRING) {
                        return false;
                    }

                    if (!guid1Upper) {
                        guid1 = guid1.toUpperCase();
                    }

                    if (!guid2Upper) {
                        guid2 = guid2.toUpperCase();
                    }

                    return guid1 === guid2;
                },

                /**
                 * Parses the provided object name and returns a reference to the object it represents.
                 *
                 * @param {String} objName
                 * The name of the object.
                 *
                 * @return {Object}
                 * The corresponding object, or null if any part of the object is undefined.
                 */
                getObjByName: function (objName) {

                    var i,
                        n,
                        obj,
                        parts,
                        part;

                    // Split the object name on the period, then loop through the parts, building up a reference to the
                    // object.  This essentially turns a string like "BBUI.globals.myFunctionName" into the object
                    // window["BBUI"]["globals"]["myFunctionName"].
                    parts = objName.split(".");

                    // Start with the window object.
                    obj = $window;

                    for (i = 0, n = parts.length; i < n; i++) {
                        part = parts[i];
                        if (!(i === 0 && part === "window")) {
                            obj = obj[part];
                            if (typeof obj === "undefined") {
                                return null;
                            }
                        }
                    }

                    return obj;
                },

                /**
                 * Concatenates all the provided arguments as if they were portions of a URL, inserting forward slashes where appropriate.
                 * @param {String} arg1 A portion of the URL.
                 * @param {String} [arg2]
                 * @param {String} [argN]
                 *
                 * @return {String} The concatenated URL.
                 */
                urlConcat: function (arg1) {

                    var arg,
                        argCount,
                        argObj,
                        i,
                        url;

                    argCount = arguments.length;

                    if (argCount) {
                        if (!BBUI.is(arg1)) {
                            return null;
                        }

                        url = arg1.toString();

                        for (i = 1; i < argCount; i++) {
                            argObj = arguments[i];

                            if (!BBUI.is(argObj)) {
                                return null;
                            }

                            arg = argObj.toString();

                            if (url.charAt(url.length - 1) !== "/" && arg.charAt(0) !== "/") {
                                url += "/";
                            }

                            url += arg;
                        }

                        return url;
                    }

                    return null;
                },

                /**
                 * Takes the special arguments object from a function and returns the arguments in a true array.
                 *
                 * @param {Object} args
                 * The arguments object.
                 *
                 * @param {Number} [start]
                 * The index of the first item to return.  When not specified, all the items are returned.
                 *
                 * @return {Object[]}
                 * The array of arguments.
                 */
                argsToArray: function (args, start) {
                    return Array.prototype.slice.call(args, start || 0);
                },

                /**
                 * Takes an array of objects with an "id" or "name" property and a "value" property and returns
                 * the items as a query string.
                 *
                 * @param {Object[]} items
                 * The array of objects.
                 *
                 * @param {String} [itemPrefix]
                 * The string to prepend to the query string item name.
                 *
                 * @param {Boolean} [prependAmpersand]
                 * Flag indicating whether to prepend an ampersand to the returned query string.
                 *
                 * @return {String}
                 * The query string.
                 */
                arrayToQueryString: function (items, itemPrefix, prependAmpersand) {

                    var i,
                        item,
                        n,
                        s;

                    s = "";

                    if (items && items.length) {
                        itemPrefix = itemPrefix || "";

                        for (i = 0, n = items.length; i < n; i++) {
                            item = items[i];

                            if (i > 0 || prependAmpersand) {
                                s += "&";
                            }

                            s += itemPrefix + euc(item.id || item.name) + "=" + euc(item.value);
                        }
                    }

                    return s;
                },

                /**
                 * @return {String}
                 */
                getAbsoluteBaseUrl: function (relativeBaseUrl) {
                    var baseUrl,
                        i,
                        serverPartsCount;

                    if (!relativeBaseUrl) {
                        return relativeBaseUrl;
                    }

                    serverPartsCount = relativeBaseUrl.split("/").length;

                    // NOTE: The base URL value used to be passed as a relative URL down from the server, but this caused problems
                    // with mixed content warnings in IE8 when a URL on a DOM element (such as an href attribute on a LINK element
                    // or a background-image CSS rule on a DIV element) was specified and then created and not added to the page or
                    // removed from the page and then garbage collected.  This is due to a bug in IE8 where the protocol of "about:"
                    // is assumed rather than the protocol specified on the current web page.  Changing the base URL to an absolute
                    // URL by removing a known part of the URL here fixes this issue.  More information on the bug in IE that causes
                    // the mixed content warning can be found here:
                    // http://support.microsoft.com/kb/925014
                    // http://www.pelagodesign.com/blog/2007/10/30/ie7-removechild-and-ssl/
                    // http://blog.httpwatch.com/2009/09/17/even-more-problems-with-the-ie-8-mixed-content-warning/#comment-10632
                    // http://blogs.msdn.com/b/ieinternals/archive/2009/06/22/https-mixed-content-in-ie8.aspx?PageIndex=3#comments

                    // Also, a utility called "Scriptfree" was instrumental in tracking this bug down.  This was mentioned in a
                    // comment on the IEInternals blog post above.
                    // http://www.enhanceie.com/dl/scriptfreesetup.exe

                    // Remove the query string since it's not relevant.
                    baseUrl = $window.location.href.split("?")[0];

                    for (i = 0; i < serverPartsCount + 1; i++) {
                        baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf("/"));
                    }

                    return baseUrl;
                },

                /**
                 * Detemines whether the value of the first parameter ends with the value of the second parameter.
                 *
                 * @param {String} s
                 * The value to search.
                 *
                 * @param {String} val
                 * The value to find.
                 *
                 * @return {Boolean}
                 * A flag indicating whether the value of the first parameter ends with the value of the second parameter.
                 */
                endsWith: function (s, val) {
                    var pos;

                    if (typeof s === TYPE_STRING && typeof val === TYPE_STRING) {
                        pos = s.length - val.length;
                        return pos >= 0 && s.lastIndexOf(val) === pos;
                    }

                    return false;
                },

                /**
                 * Overrides functions on the first argument with properties from the second argument and returns an object
                 * with the original base functions.
                 *
                 * @param {Object} to
                 * The object whose functions are to be overridden.
                 *
                 * @param {Object} from
                 * The Object containing the override functions.
                 *
                 * @return {Object}
                 * The object containing the original functions.
                 */
                override: function (to, from) {
                    var base,
                        overridden,
                        p;

                    base = {};

                    for (p in from) {
                        if (from.hasOwnProperty(p)) {
                            overridden = to[p];

                            if (overridden) {
                                base[p] = overridden;
                            }

                            to[p] = from[p];
                        }
                    }

                    return base;
                },

                /**
                 * @return {String}
                 */
                escapeRegExp: function (filter) {
                    if (typeof filter === TYPE_STRING) {
                        return filter.replace(escapeRegExpRegEx, '\\$&');
                    }

                    return null;
                }

            };

            return BBUI;

        }]);

}());

/*global angular */

(function () {
    'use strict';

    angular.module('bbui', ['bbui.core', 'bbui.shellservice', 'bbui.uimodelingservice']);

}());
/*global angular */

(function () {
    'use strict';

    angular.module('bbui.shellservice', ['bbui.core'])
        /**
         * @class bbui.shellservice.bbuiShellServiceConfig
         */
        .constant('bbuiShellServiceConfig', {
            /**
             * @cfg {String} baseUrl
             */
            baseUrl: null,
            /**
             * @cfg {String} databaseName
             */
            databaseName: null
        })
        .factory('bbuiShellService', ['$http', 'bbui', 'bbuiShellServiceConfig', function ($http, BBUI, bbuiShellServiceConfig) {
            var Service;

            (function () {
                // Shorter alias for commonly-used function.
                var euc = encodeURIComponent,
                    paramPrefix = "p_";

                function pushIf(sb, qsVarName, value, condition) {
                    if (typeof condition === "undefined") {
                        condition = !!value;
                    }

                    if (condition) {
                        sb.push("&" + qsVarName + "=");
                        sb.push(euc(value));
                    }
                }

                function buildBaseUrl(svc, fileName, action, pageId, tabId, sectionId, actionId, contextRecordId) {
                    var sb;

                    sb = [];

                    if (svc.proxyUrl) {
                        sb.push(svc.proxyUrl +
                            (svc.proxyUrl.indexOf("?") >= 0 ? "&" : "?") +
                            "fileName=" +
                            euc(fileName) +
                            "&");
                    } else {
                        sb.push(BBUI.urlConcat(svc.baseUrl, "webui/" + fileName + "?"));
                    }

                    sb.push("databaseName=" + euc(svc.databaseName));

                    pushIf(sb, "runAs", svc.runAs);

                    pushIf(sb, "action", action);
                    pushIf(sb, "pageId", pageId);
                    pushIf(sb, "tabId", tabId);
                    pushIf(sb, "sectionId", sectionId);
                    pushIf(sb, "actionId", actionId);
                    pushIf(sb, "contextRecordId", contextRecordId);

                    return sb.join("");
                }

                function buildSvcBaseUrl(svc, action, pageId, tabId, sectionId, actionId, contextRecordId) {
                    return buildBaseUrl(svc, "WebShellService.ashx", action, pageId, tabId, sectionId, actionId, contextRecordId);
                }

                function buildAdHocQuerySvcBaseUrl(svc) {
                    return buildBaseUrl(svc, "WebShellAdHocQueryService.ashx");
                }

                function buildDataListSvcBaseUrl(svc, dataListId, pageId, tabId, sectionId) {
                    var url;

                    url = buildBaseUrl(svc, "WebShellDataListService.ashx", null, pageId, tabId, sectionId) +
                        "&dataListId=" +
                        euc(dataListId);

                    return url;
                }

                function buildSearchListSvcBaseUrl(svc, searchListId, criteria) {
                    return buildBaseUrl(svc, "WebShellSearchListService.ashx") +
                        "&searchListId=" +
                        euc(searchListId) +
                        "&criteria=" +
                        euc(criteria);
                }

                function addSecurityContext(url, options) {
                    if (options) {
                        if (options.securityContextFeatureId) {
                            url += "&securityContextFeatureId=" + euc(options.securityContextFeatureId);
                        }

                        if (BBUI.is(options.securityContextFeatureType)) {
                            url += "&securityContextFeatureType=" + euc(options.securityContextFeatureType);
                        }
                    }

                    return url;
                }

                function getHeaders(svc) {
                    var headers;

                    headers = {};

                    BBUI.copyProps(headers, bbuiShellServiceConfig.globalHttpHeaders);
                    BBUI.copyProps(headers, svc.httpHeaders);

                    return headers;
                }

                function doRequest(svc, method, url, data) {
                    return svc.$http({
                        method: method,
                        url: url,
                        data: data,
                        headers: getHeaders(svc),
                        cache: false
                    });
                }

                function doGet(svc, url) {
                    return svc.doGet(url);
                }

                function doPost(svc, url, data) {
                    return svc.doPost(url, data);
                }

                /**
                 * @class bbui.shellservice.bbuiShellService.Service
                 * Provides various methods for communicating with the web shell endpoints on the web server.
                 * <br/><br/>
                 * Note that all methods that make a call to the web server have the same last three arguments:
                 *
                 * @param {String} baseUrl
                 * The base URL to the web server.
                 *
                 * @param {String} databaseName
                 * The name of the database to which to connect.
                 *
                 * @param {Object} [options]
                 *
                 * @param {String} options.proxyUrl
                 * A URL to a web server that acts as a proxy between the client and the AppFx web server.
                 * This is useful in cases where the host page is hosted on a server other than the AppFx web server
                 * and the browser would otherwise block the request for being a cross-site request.
                 *
                 * @param {String} options.runAs
                 *
                 * @param {Object} options.onRequestBegin
                 *
                 * @param {Object} options.onRequestEnd
                 *
                 * @param {Object} options.httpHeaders
                 *
                 */
                Service = function (baseUrl, databaseName, options) {

                    var svc;

                    svc = this;

                    svc.baseUrl = baseUrl;
                    svc.databaseName = databaseName;

                    if (options) {
                        svc.runAs = options.runAs;
                        svc.onRequestBegin = options.onRequestBegin;
                        svc.onRequestEnd = options.onRequestEnd;
                        svc.httpHeaders = options.httpHeaders;
                        svc.proxyUrl = options.proxyUrl;
                    }
                };

                Service.prototype = {

                    /**
                     * @readonly
                     * The base URL to the web server.
                     * @property baseUrl
                     * @type String
                     */
                    baseUrl: null,

                    /**
                     * @readonly
                     * The name of the database to which to connect.
                     * @property databaseName
                     * @type String
                     */
                    databaseName: null,

                    /**
                     * @private
                     * Validates a user name and password for a given user.
                     *
                     * @param {Object} loginInfo An object with username and password properties.
                     *
                     * @return {promise}
                     */
                    login: function (loginInfo) {
                        var url;

                        url = buildBaseUrl(this, "WebShellLogin.aspx") + "&action=login";

                        return doPost(this, url, loginInfo);
                    },

                    /**
                     * @private
                     * Removes the session cookie that keeps the user logged in.
                     *
                     * @return {promise}
                     */
                    logout: function () {
                        var url;

                        url = buildBaseUrl(this, "WebShellLogin.aspx") + "&action=logout";

                        return doPost(this, url, null);
                    },

                    /**
                     * @private
                     * Requests a password reset link and emails it to the associated user.
                     *
                     * @param {Object} emailAddress
                     * The user's email address.
                     *
                     * @return {promise}
                     */
                    sendPasswordResetLink: function (emailAddress) {
                        var url;

                        url = buildBaseUrl(this, "WebShellLogin.aspx") + "&action=sendPasswordResetLink&emailAddress=" + emailAddress;

                        return doPost(this, url, null);
                    },

                    /**
                     * @private
                     * Resets the user's password.
                     *
                     * @param {Object} request
                     * An object containing token and newPassword properties.
                     *
                     * @return {promise}
                     */
                    resetPassword: function (request) {
                        var url;

                        url = buildBaseUrl(this, "WebShellLogin.aspx") + "&action=resetPassword";

                        return doPost(this, url, request);
                    },

                    /**
                     * @private
                     * Starts the user's session and returns navigation information for web shell.
                     *
                     * @return {promise}
                     */
                    sessionStart: function () {
                        var url;

                        url = buildSvcBaseUrl(this, "sessionStart");

                        return doPost(this, url, null);
                    },

                    /**
                     * @private
                     * Gets the site-wide navigation information for web shell.
                     *
                     * @param {Object} [options]
                     *
                     * @param {Boolean} options.refreshCache
                     *
                     * @return {promise}
                     */
                    getNavigation: function (options) {
                        var url;

                        url = buildSvcBaseUrl(this, "getNavigation");

                        if (options.refreshCache) {
                            url += "&refreshCache=true";
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @private
                     * Gets the specified page's metadata.
                     *
                     * @param {String} pageId
                     * The ID of the page.
                     *
                     * @param {String} [recordId]
                     * The ID of the record to be shown by the page.
                     *
                     * @param {Object} [options]
                     *
                     * @param {Boolean} options.firstTab
                     * Indicates that the first visible tab's full metadata should be returned.  Only the caption for other tabs will be returned.
                     *
                     * @param {String} options.tabId
                     * The ID of the tab whose full metadata should be returned.  Only the caption for other tabs will be returned.
                     *
                     * @param {String} options.listBuilderInstanceId
                     *
                     * @return {promise}
                     */
                    getPage: function (pageId, recordId, options) {
                        var url;

                        options = options || {};

                        url = buildSvcBaseUrl(this, "getPage", pageId, options.tabId, null, null, recordId);

                        if (options.firstTab) {
                            url += "&firstTab=true";
                        }
                        if (options.listBuilderInstanceId) {
                            url += "&listBuilderInstanceId=" + euc(options.listBuilderInstanceId);
                        }

                        return doGet(this, url);
                    },

                    /**
                    * @private
                    * Gets the specified page's metadata.
                    *
                    * @param {String} pageId
                    * The ID of the page.
                    *
                    * @return {promise}
                    */
                    getPageIsCustomizable: function (pageId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageIsCustomizable", pageId);

                        return doGet(this, url);
                    },

                    /**
                     * @private
                     * Gets the specified page tab's metadata.
                     *
                     * @param {String} pageId
                     * The ID of the page.
                     *
                     * @param {String} tabId The ID of the tab.
                     * @param {String} recordId The ID of the record to be shown by the page.
                     *
                     * @return {promise}
                     */
                    getPageTab: function (pageId, tabId, recordId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageTab", pageId, tabId, null, null, recordId);

                        return doGet(this, url);
                    },

                    /**
                     * @private
                     * Builds a page on the server according to the specified report and returns that page's metadata.
                     *
                     * @param {String} reportId The ID of the report.
                     *
                     * @param {Object} [options]
                     *
                     * @param {String} options.historyId
                     *
                     * @param {String} options.caption
                     *
                     * @param {String} options.displayPromptArea
                     *
                     * @param {Object[]} options.parameters
                     *
                     * @return {promise}
                     */
                    getReportPage: function (reportId, options) {
                        var url;

                        options = options || {};

                        url = buildSvcBaseUrl(this, "getReportPage") +
                            "&reportId=" + euc(reportId);

                        if (options.historyId) {
                            url += "&historyId=" + euc(options.historyId);
                        }

                        if (options.caption) {
                            url += "&caption=" + euc(options.caption);
                        }

                        if (options.displayPromptArea) {
                            url += "&displayPromptArea=" + euc(options.displayPromptArea);
                        }

                        url += BBUI.arrayToQueryString(options.parameters, paramPrefix, true);

                        return doGet(this, url, options);
                    },

                    /**
                     * @private
                     * Gets the action metadata for a functional area's task.
                     *
                     * @param {String} functionalAreaId
                     * The ID of the functional area.
                     *
                     * @param {String} taskId
                     * The ID of the functional area's task.
                     *
                     * @return {promise}
                     */
                    getFunctionalAreaTaskAction: function (functionalAreaId, taskId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getFunctionalAreaTaskAction");

                        if (functionalAreaId) {
                            url += "&functionalAreaId=" + euc(functionalAreaId);
                        }

                        if (taskId) {
                            url += "&taskId=" + euc(taskId);
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @private
                     * Returns a task as the variable reply for the callback
                     *
                     * @param {String} taskId
                     * The ID of the task.
                     *
                     * @return {promise}
                     */
                    getTaskAction: function (taskId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getTaskAction");

                        if (taskId) {
                            url += "&taskId=" + euc(taskId);
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @private
                     * Gets the metadata for a page-level action.
                     *
                     * @param {String} pageId
                     * The ID of the page.
                     *
                     * @param {String} actionId
                     * The ID of the page's action.
                     *
                     * @param {String} contextRecordId
                     *
                     * @return {promise}
                     */
                    getPageAction: function (pageId, actionId, contextRecordId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageAction", pageId, null, null, actionId, contextRecordId);

                        return doGet(this, url);
                    },

                    /**
                     * @private
                     * Gets the metadata for a page section.
                     *
                     * @param {String} pageId
                     * The ID of the page.
                     *
                     * @param {String} tabId
                     * The ID of the tab to which the section belongs.
                     *
                     * @param {String} sectionId
                     * The ID of the section.
                     *
                     * @param {String} [contextRecordId]
                     * The ID of the page's context record.
                     *
                     * @return {promise}
                     */
                    getPageSection: function (pageId, tabId, sectionId, contextRecordId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageSection", pageId, tabId, sectionId, null, contextRecordId);

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    getPageDataFormSectionAction: function (pageId, tabId, sectionId, actionId, contextRecordId, formSessionId, modelInstanceId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageDataFormSectionAction", pageId, tabId, sectionId, actionId, contextRecordId) +
                            "&formSessionId=" +
                            euc(formSessionId) +
                            "&modelInstanceId=" +
                            euc(modelInstanceId);

                        return doPost(this, url, null);
                    },

                    /**
                     * @return {promise}
                     */
                    getPageReportSectionAction: function (pageId, tabId, sectionId, actionId, contextRecordId, options) {
                        var reportValues,
                            url;

                        if (options) {
                            reportValues = options.reportValues;
                        }

                        url = buildSvcBaseUrl(this, "getPageReportSectionAction", pageId, tabId, sectionId, actionId, contextRecordId);

                        return doPost(this, url, reportValues);
                    },

                    /**
                     * @return {promise}
                     */
                    getPageUIWidgetSectionAction: function (pageId, tabId, sectionId, actionId, contextRecordId, options) {
                        var row = null,
                            url;

                        url = buildSvcBaseUrl(this, "getPageUIWidgetSectionAction", pageId, tabId, sectionId, actionId, contextRecordId);

                        if (options) {
                            if (options.pageRecordId) {
                                url += "&pageRecordId=" + euc(options.pageRecordId);
                            }

                            if (options.rowValues) {
                                row = options.rowValues;
                            }
                        }

                        return doPost(this, url, row);
                    },

                    /**
                     * @return {promise}
                     */
                    getPageUrlSectionAction: function (pageId, tabId, sectionId, actionId, contextRecordId, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageUrlSectionAction", pageId, tabId, sectionId, actionId, contextRecordId);

                        if (options) {
                            if (options.pageRecordId) {
                                url += "&pageRecordId=" + euc(options.pageRecordId);
                            }
                        }

                        return doPost(this, url, null);
                    },

                    /**
                     * @return {promise}
                     */
                    getPageDataListSectionAction: function (pageId, tabId, sectionId, actionId, contextRecordId, row, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageDataListSectionAction", pageId, tabId, sectionId, actionId, contextRecordId);

                        if (options) {
                            if (options.pageRecordId) {
                                url += "&pageRecordId=" + euc(options.pageRecordId);
                            }
                            if (options.formSessionId) {
                                url += "&formSessionId=" + euc(options.formSessionId);
                            }
                            if (options.modelInstanceId) {
                                url += "&modelInstanceId=" + euc(options.modelInstanceId);
                            }
                        }

                        return doPost(this, url, row);
                    },

                    /**
                     * @return {promise}
                     */
                    getPageListBuilderSectionAction: function (pageId, tabId, sectionId, actionId, contextRecordId, row, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageListBuilderSectionAction", pageId, tabId, sectionId, actionId, contextRecordId);

                        if (options && options.pageRecordId) {
                            url += "&pageRecordId=" + euc(options.pageRecordId);
                        }

                        return doPost(this, url, row);
                    },

                    /**
                     * @return {promise}
                     */
                    getListBuilderAvailableColumns: function (queryViewId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getListBuilderAvailableColumns") + "&queryViewId=" + queryViewId;

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    listBuilderGetInstanceXml: function (queryViewId, request, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "listBuilderGetInstanceXml") +
                            "&queryViewId=" +
                            euc(queryViewId);

                        if (options.parameterFormSessionId) {
                            url += "&parameterFormSessionId=" + euc(options.parameterFormSessionId);
                        }

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    listBuilderGetInstance: function (listBuilderInstanceId) {
                        var url;

                        url = buildSvcBaseUrl(this, "listBuilderGetInstance") + "&listBuilderInstanceId=" + listBuilderInstanceId;

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    listBuilderClearAllSettings: function (userSettingsPath, queryViewId) {

                        var url;

                        url = buildSvcBaseUrl(this, "listBuilderClearAllSettings") +
                            "&userSettingsPath=" + userSettingsPath +
                            "&queryViewId=" + queryViewId;

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQueryClearAllSettings: function (userSettingsPath, adHocQueryId) {
                        var url;

                        url = buildSvcBaseUrl(this, "adHocQueryClearAllSettings") +
                            "&userSettingsPath=" + userSettingsPath +
                            "&adHocQueryId=" + adHocQueryId;

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    getAdHocQueryAvailableColumns: function (adHocQueryId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getAdHocQueryAvailableColumns") + "&adHocQueryId=" + adHocQueryId;

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    getPageSummarySectionAction: function (pageId, actionId, contextRecordId, formSessionId, modelInstanceId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageSummarySectionAction", pageId, null, null, actionId, contextRecordId) +
                            "&formSessionId=" +
                            euc(formSessionId) +
                            "&modelInstanceId=" +
                            euc(modelInstanceId);

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    evaluateDataListSectionActions: function (pageId, tabId, sectionId, contextRecordId, row, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "evaluateDataListSectionActions", pageId, tabId, sectionId, null, contextRecordId);

                        if (options) {
                            if (options.pageRecordId) {
                                url += "&pageRecordId=" + euc(options.pageRecordId);
                            }
                        }

                        return doPost(this, url, row);
                    },

                    /**
                     * @return {promise}
                     */
                    evaluateListBuilderSectionActions: function (pageId, tabId, sectionId, contextRecordId, row, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "evaluateListBuilderSectionActions", pageId, tabId, sectionId, null, contextRecordId);

                        if (options && options.pageRecordId) {
                            url += "&pageRecordId=" + euc(options.pageRecordId);
                        }

                        return doPost(this, url, row);
                    },

                    /**
                     * @return {promise}
                     */
                    evaluateDataFormSectionActions: function (pageId, tabId, sectionId, contextRecordId, formSessionId, modelInstanceId) {
                        var url;

                        url = buildSvcBaseUrl(this, "evaluateDataFormSectionActions", pageId, tabId, sectionId, null, contextRecordId) +
                            "&formSessionId=" +
                            euc(formSessionId) +
                            "&modelInstanceId=" +
                            euc(modelInstanceId);

                        return doPost(this, url, null);
                    },

                    /**
                     * @return {promise}
                     */
                    dataListGetOutputDefinition: function (dataListId, options) {
                        var url;

                        options = options || {};
                        options.cache = true;

                        url = BBUI.urlConcat(this.baseUrl, "webui/mc/") + euc(this.databaseName) + "/d/" + euc(dataListId) + "." + (options.timestamp || 0) + "_bbmd.ashx";

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    queryViewGetOutputDefinition: function (queryViewId, options) {
                        var url;

                        options = options || {};
                        options.cache = true;

                        url = BBUI.urlConcat(this.baseUrl, "webui/mc/") + euc(this.databaseName) + "/q/" + euc(queryViewId) + "." + (options.timestamp || 0) + "_bbmd.ashx";

                        return doGet(this, url);
                    },

                    /**
                     * Loads the results of the specified data list and passes the {@link BBUI.webshell.servicecontracts.DataListLoadReply reply object}
                     * to the promise.
                     *
                     * @param {String} dataListId
                     * The ID of the data list to load.
                     *
                     * @param {String} [contextRecordId]
                     * The ID of the data list's context record.
                     *
                     * @param {Object} [options]
                     *
                     * @param {String} options.pageRecordId
                     * The ID of the page's context record where the data list is rendered.
                     *
                     * @param {String} options.parameterFormSessionId
                     * The ID of the form session that provides parameters to the data list.
                     *
                     * @param {Object[]} options.parameters
                     * An array of objects containing <tt>name</tt> and <tt>value</tt> properties used to filter the data list results.
                     * @param {String} options.parameters.name
                     * @param {Object} options.parameters.value
                     *
                     * @param {Boolean} options.returnFlotData
                     * A flag indicating the data should be returned in a format readable by flot charts.
                     *
                     * @param {Boolean} options.returnFormattedValues
                     * Flag indicating the data list should return formatted values along with the raw values.
                     *
                     * @param {String} options.userSettingsPath
                     * The path used as the key to store user information about the data list, such as column sizes or the last filter values used.
                     *
                     * @return {promise}
                     */
                    dataListLoad: function (dataListId, contextRecordId, options) {
                        var sb,
                            url;

                        options = options || {};

                        sb = [buildDataListSvcBaseUrl(this, dataListId)];

                        pushIf(sb, "recordId", contextRecordId);

                        if (options) {
                            pushIf(sb, "returnFormattedValues", "true", !!options.returnFormattedValues);
                            pushIf(sb, "pageRecordId", options.pageRecordId);
                            pushIf(sb, "parameterFormSessionId", options.parameterFormSessionId);
                            pushIf(sb, "functionalAreaId", options.functionalAreaId);
                            pushIf(sb, "uiWidgetId", options.uiWidgetId);
                            pushIf(sb, "personalizationMode", options.personalizationMode);
                            pushIf(sb, "userSettingsPath", options.userSettingsPath);
                            pushIf(sb, "returnFlotData", "true", !!options.returnFlotData);
                            pushIf(sb, "pageId", options.pageId);
                            pushIf(sb, "tabId", options.tabId);
                            pushIf(sb, "sectionId", options.sectionId);
                            pushIf(sb, "moreRowsRangeKey", options.moreRowsRangeKey);
                            pushIf(sb, "discardRows", "true", !!options.discardRows);
                            pushIf(sb, "returnPageNavigationTree", "true", !!options.returnPageNavigationTree);
                            pushIf(sb, "limit", options.limit);
                            pushIf(sb, "cancelId", options.cancelId);

                            sb.push(BBUI.arrayToQueryString(options.parameters, paramPrefix, true));
                        }

                        url = sb.join("");

                        return doGet(this, url);
                    },

                    /**
                     * Loads the results of the specified simple data list and passes the {@link BBUI.webshell.servicecontracts.SimpleDataListLoadReply reply object}
                     * to the promise.
                     *
                     * @param {String} simpleDataListId
                     * The ID of the simple data list to load.
                     *
                     * @param {Object} [options]
                     *
                     * @param {Object[]} options.parameters
                     * An array of objects containing <tt>name</tt> and <tt>value</tt> properties used to filter the simple data list results.
                     * @param {String} options.parameters.name
                     * @param {Object} options.parameters.value
                     * 
                     * @param {String} [options.securityContextFeatureId]
                     * The feature ID that provides implied security for the given simple data list.
                     *
                     * @param {String} [options.securityContextFeatureType]
                     * The feature type of the feature providing implied security for the given data list.
                     *
                     * @return {promise}
                     */
                    simpleDataListLoad: function (simpleDataListId, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "simpleDataListLoad") +
                            "&simpleDataListId=" + euc(simpleDataListId);

                        if (options) {
                            url += BBUI.arrayToQueryString(options.parameters, paramPrefix, true);
                            url = addSecurityContext(url, options);
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {String}
                     */
                    buildPageSectionDataListResultsUrl: function (pageId, tabId, sectionId, dataListId, options) {
                        var sb,
                            url;

                        if (!options) {
                            options = {};
                        }

                        sb = [buildDataListSvcBaseUrl(this, dataListId, pageId, tabId, sectionId)];

                        pushIf(sb, "recordId", options.contextRecordId);
                        pushIf(sb, "pageRecordId", options.pageRecordId);
                        pushIf(sb, "returnFormattedValues", "true", options.returnFormattedValues);
                        // Adding moreRowsRangeKey back here
                        // Since buildResultsUrl is always called now to set the proxy connection url, we should always be getting the correct value
                        pushIf(sb, "moreRowsRangeKey", options.moreRowsRangeKey);
                        pushIf(sb, "previousRowCount", options.previousRowCount);
                        pushIf(sb, "parameterFormSessionId", options.parameterFormSessionId);
                        pushIf(sb, "personalizationMode", options.personalizationMode);
                        pushIf(sb, "userSettingsPath", options.userSettingsPath);
                        pushIf(sb, "exportFormat", options.exportFormat);
                        pushIf(sb, "cancelId", options.cancelId);

                        sb.push(BBUI.arrayToQueryString(options.parameters, paramPrefix, true));

                        url = sb.join("");

                        return url;
                    },

                    /**
                     * @return {String}
                     */
                    buildPageSectionAdHocQueryListResultsUrl: function (pageId, tabId, sectionId, adHocQueryId, queryViewId, options) {
                        var sb,
                            svc = this,
                            url;

                        sb = [buildBaseUrl(svc, "WebShellAdHocQueryListService.ashx") +
                            "&adHocQueryId=" + euc(adHocQueryId) +
                            "&queryViewId=" + euc(queryViewId) +
                            "&returnResults=true"];

                        options = options || {};

                        pushIf(sb, "returnFormattedValues", "true", options.returnFormattedValues);
                        pushIf(sb, "parameterFormSessionId", options.parameterFormSessionId);
                        pushIf(sb, "pageId", pageId);
                        pushIf(sb, "tabId", tabId);
                        pushIf(sb, "sectionId", sectionId);
                        pushIf(sb, "pageRecordId", options.pageRecordId);
                        pushIf(sb, "recordId", options.contextRecordId);
                        pushIf(sb, "userSettingsPath", options.userSettingsPath);
                        pushIf(sb, "saveUserSettings", "true", !!options.saveUserSettings);
                        pushIf(sb, "cancelId", options.cancelId);

                        url = sb.join("");

                        return url;
                    },

                    /**
                     * @return {String}
                     */
                    buildPageSectionListBuilderResultsUrl: function (pageId, tabId, sectionId, queryViewId, options) {
                        var sb,
                            svc = this,
                            url;

                        sb = [buildBaseUrl(svc, "WebShellListBuilderService.ashx") +
                            "&queryViewId=" + euc(queryViewId) +
                            "&returnResults=true"];

                        options = options || {};

                        pushIf(sb, "returnFormattedValues", "true", options.returnFormattedValues);
                        pushIf(sb, "parameterFormSessionId", options.parameterFormSessionId);
                        pushIf(sb, "pageId", pageId);
                        pushIf(sb, "tabId", tabId);
                        pushIf(sb, "sectionId", sectionId);
                        pushIf(sb, "pageRecordId", options.pageRecordId);
                        pushIf(sb, "recordId", options.contextRecordId);
                        pushIf(sb, "userSettingsPath", options.userSettingsPath);
                        pushIf(sb, "saveUserSettings", "true", !!options.saveUserSettings);
                        pushIf(sb, "moreRowsRangeKey", options.moreRowsRangeKey);
                        pushIf(sb, "previousRowCount", options.previousRowCount);
                        pushIf(sb, "cancelId", options.cancelId);
                        pushIf(sb, "storeSettingsByContextRecordId", options.storeSettingsByContextRecordId);

                        url = sb.join("");

                        return url;
                    },

                    /**
                     * @return {promise}
                     */
                    listBuilderClearCachedResults: function (moreRowsRangeKey) {
                        var url,
                            svc = this;

                        url = buildBaseUrl(svc, "WebShellListBuilderService.ashx") +
                            "&moreRowsRangeKey=" + euc(moreRowsRangeKey) +
                            "&discardRows=true";

                        return doGet(svc, url);
                    },

                    /**
                     * @return {promise}
                     */
                    pageSectionDataListLoad: function (pageId, tabId, sectionId, dataListId, options) {
                        var url;

                        url = this.buildPageSectionDataListResultsUrl(pageId, tabId, sectionId, dataListId, options);

                        return doGet(this, url);
                    },

                    /**
                     * Gets the prompt to be displayed before the specified record operation is performed and passes the
                     * {@link BBUI.webshell.servicecontracts.RecordOperationPrompt reply object} to the promise.
                     *
                     * @param {String} recordOperationId
                     * The ID of the record operation.
                     *
                     * @param {String} [recordId]
                     * The ID of the context record for the record operation.
                     *
                     * @return {promise}
                     */
                    recordOperationGetPrompt: function (recordOperationId, recordId) {
                        var url;

                        url = buildSvcBaseUrl(this, "recordOperationGetPrompt") +
                            "&recordOperationId=" +
                            euc(recordOperationId);

                        if (recordId) {
                            url += "&recordId=" + euc(recordId);
                        }

                        return doGet(this, url);
                    },

                    /**
                     * Performs a record operation.
                     *
                     * @param {String} recordOperationId
                     * The ID of the record operation.
                     *
                     * @param {String} [recordId]
                     * The ID of the context record for the record operation.
                     *
                     * @param {Object} [options]
                     *
                     * @param {Object[]} options.parameters
                     * An array of objects containing <tt>name</tt> and <tt>value</tt> properties used to to pass as parameters to the record operation.
                     * @param {String} options.parameters.name
                     * @param {Object} options.parameters.value
                     *
                     * @return {promise}
                     */
                    recordOperationPerform: function (recordOperationId, recordId, options) {
                        var url,
                            sb,
                            data;

                        if (options && (options.parameters || options.recordIds)) {
                            data = {};

                            if (options.parameters) {
                                data.values = options.parameters;
                            }

                            if (options.recordIds) {
                                data.recordIds = options.recordIds;
                            }
                        }

                        sb = [buildSvcBaseUrl(this, "recordOperationPerform")];

                        pushIf(sb, "recordOperationId", recordOperationId);
                        pushIf(sb, "recordId", recordId);

                        url = sb.join("");

                        return doPost(this, url, data);
                    },

                    /**
                     * @return {promise}
                     */
                    searchListGetOutputDefinition: function (searchListId) {
                        var url;

                        url = buildSvcBaseUrl(this, "searchListGetOutputDefinition") +
                            "&searchListId=" +
                            euc(searchListId);

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    searchListQuickFind: function (searchListId, criteria, options) {
                        var url;

                        url = buildSearchListSvcBaseUrl(this, searchListId, criteria);

                        if (options) {
                            if (options.onlyReturnRows) {
                                url += "&onlyReturnRows=true";
                            }
                            if (options.maxRecords) {
                                url += "&maxRecords=" + euc(options.maxRecords);
                            }
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    codeTableEntrySave: function (codeTableName, codeTableEntryId, request) {
                        var url;

                        url = buildSvcBaseUrl(this, "codeTableEntrySave") +
                            "&codeTableName=" +
                            euc(codeTableName) +
                            "&codeTableEntryId=" +
                            euc(codeTableEntryId);

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    kpiDashboardGetDefinition: function (options) {
                        var url;

                        url = buildSvcBaseUrl(this, "kpiDashboardGetDefinition");

                        if (options.returnValues) {
                            url += "&returnValues=true";
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    queryViewGetFieldFindResults: function (request) {
                        var url;

                        url = buildSvcBaseUrl(this, "queryViewGetFieldFindResults");

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    queryViewGetTree: function (id, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "queryViewGetTree") +
                            "&id=" +
                            euc(id);

                        if (options && options.forExport === true) {
                            url += "&loadExportDefinitionViews=true";
                        } else {
                            url += "&loadExportDefinitionViews=false";
                        }

                        if (options && options.forReportModelGenerator === true) {
                            url += "&reportModelViewsOnly=true";
                        } else {
                            url += "&reportModelViewsOnly=false";
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    queryViewGetMetaData: function (id) {
                        var url;

                        url = buildSvcBaseUrl(this, "queryViewGetMetaData") +
                            "&id=" +
                            euc(id);

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    queryViewGetTreeNodeFields: function (node, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "queryViewGetTreeNodeFields") +
                            "&node=" +
                            euc(node);

                        if (options && options.forReportModelGenerator === true) {
                            url += "&reportModelViewsOnly=true";
                        } else {
                            url += "&reportModelViewsOnly=false";
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {String}
                     */
                    buildQueryViewGetTreeNodeChildrenUrl: function (queryViewId, forExport, forReportModelGenerator) {
                        var url;

                        url = buildSvcBaseUrl(this, "queryViewGetTreeNodeChildren");

                        if (BBUI.is(forExport) && forExport === true) {
                            url += "&loadExportDefinitionViews=true";
                        } else {
                            url += "&loadExportDefinitionViews=false";
                        }

                        if (BBUI.is(forReportModelGenerator) && forReportModelGenerator === true) {
                            url += "&reportModelViewsOnly=true";
                        } else {
                            url += "&reportModelViewsOnly=false";
                        }

                        return url;
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQueryProcess: function (request, options) {
                        //var cancelCallback,
                        //    requestObj,
                        //    scope,
                        //    state,
                        var svc,
                            url;

                        // TODO implement cancellation.
                        // See http://stackoverflow.com/questions/13928057/how-to-cancel-an-http-request-in-angularjs
                        //function cancelAdHocQueryProcess() {
                        //}

                        svc = this;

                        url = buildAdHocQuerySvcBaseUrl(svc);

                        if (options) {
                            if (options.returnFormattedValues) {
                                url += "&returnFormattedValues=true";
                            }
                            if (options.cancelId) {
                                url += "&cancelId=" + options.cancelId;
                            }
                        }

                        return doPost(svc, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQueryGetResults: function (request, options) {
                        var url;

                        url = buildAdHocQuerySvcBaseUrl(this);

                        if (options) {
                            if (options.returnFormattedValues) {
                                url += "&returnFormattedValues=true" + "&getResults=true";
                            }
                            if (options.cancelId) {
                                url += "&cancelId=" + euc(options.cancelId);
                            }
                        }

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    cancelAsyncOperation: function (cancelId) {
                        var url;

                        url = buildBaseUrl(this, "WebShellCancelAsyncOperation.ashx") +
                            "&cancelId=" +
                            euc(cancelId);

                        return doGet(this, url);
                    },

                    /**
                     * @return {String}
                     */
                    buildAdHocQueryExportUrl: function (options) {
                        var url;

                        options = options || {};

                        url = [];
                        url.push(buildAdHocQuerySvcBaseUrl(this));
                        url.push("&forExport=true");

                        pushIf(url, "getResults", "true", !!options.getResults);
                        pushIf(url, "queryViewId", options.queryViewId);

                        return url.join("");
                    },

                    /**
                     * @return {String}
                     */
                    buildListBuilderExportUrl: function (options) {
                        var url;

                        options = options || {};

                        url = [];
                        url.push(buildBaseUrl(this, "WebShellListBuilderService.ashx"));
                        url.push("&forExport=true");

                        pushIf(url, "queryViewId", options.queryViewId);
                        pushIf(url, "suppressPrimaryKeyField", "true", !!options.suppressPrimaryKeyField);
                        pushIf(url, "searchText", options.searchText);
                        pushIf(url, "parameterFormSessionId", options.parameterFormSessionId);

                        return url.join("");
                    },

                    /**
                     * @return {String}
                     */
                    buildAdHocQueryListExportUrl: function (options) {
                        var url;

                        options = options || {};

                        url = [];
                        url.push(buildBaseUrl(this, "WebShellAdHocQueryListService.ashx"));
                        url.push("&forExport=true");

                        pushIf(url, "adHocQueryId", options.adHocQueryId);
                        pushIf(url, "queryViewId", options.queryViewId);
                        pushIf(url, "suppressPrimaryKeyField", "true", !!options.suppressPrimaryKeyField);
                        pushIf(url, "searchText", options.searchText);
                        pushIf(url, "parameterFormSessionId", options.parameterFormSessionId);

                        return url.join("");
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQuerySave: function (request) {
                        var url;

                        url = buildSvcBaseUrl(this, "adHocQuerySave");

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQuerySaveDataList: function (request) {
                        var url;

                        url = buildSvcBaseUrl(this, "adHocQuerySaveDataList");

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQuerySaveReport: function (request) {
                        var url;

                        url = buildSvcBaseUrl(this, "adHocQuerySaveReport");

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQuerySaveSmartQuery: function (request) {
                        var url;

                        url = buildSvcBaseUrl(this, "adHocQuerySaveSmartQuery");

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQueryGetDefinition: function (id, options) {
                        var definitionType = options.definitionType,
                            throwOnInvalidFields = options.throwOnInvalidFields,
                            url;

                        url = buildSvcBaseUrl(this, "adHocQueryGetDefinition") +
                            "&id=" +
                            euc(id);

                        if (!BBUI.is(definitionType)) {
                            definitionType = 0; //ad-hoc query
                        }

                        url += "&definitionType=" + euc(definitionType);

                        if (BBUI.is(throwOnInvalidFields)) {
                            url += "&throwOnInvalidFields=" + euc(throwOnInvalidFields);
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    adHocQueryDelete: function (id) {
                        var url;

                        url = buildSvcBaseUrl(this, "adHocQueryDelete") +
                            "&id=" +
                            euc(id);

                        return doPost(this, url, null);
                    },

                    /**
                     * @return {promise}
                     */
                    exportDefinitionSave: function (request) {
                        var url;

                        url = buildSvcBaseUrl(this, "exportDefinitionSave");

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    exportDefinitionGetDefinition: function (id) {
                        var url;

                        url = buildSvcBaseUrl(this, "exportDefinitionGetDefinition") +
                            "&id=" +
                            euc(id);

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    smartQueryProcess: function (request, options) {
                        //var cancelCallback,
                        //    requestObj,
                        //    scope,
                        //    state,
                        var svc,
                            url;

                        // TODO implement cancellation.
                        // See http://stackoverflow.com/questions/13928057/how-to-cancel-an-http-request-in-angularjs
                        //function cancelSmartQueryProcess() {
                        //}

                        svc = this;

                        url = buildBaseUrl(svc, "WebShellSmartQueryService.ashx");

                        if (options) {
                            if (options.returnFormattedValues) {
                                url += "&returnFormattedValues=true";
                            }
                            if (options.cancelId) {
                                url += "&cancelId=" + euc(options.cancelId);
                            }
                        }

                        return doPost(svc, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    smartQueryGetResults: function (request, options) {
                        var url;

                        url = buildBaseUrl(this, "WebShellSmartQueryService.ashx");

                        if (options) {
                            if (options.returnFormattedValues) {
                                url += "&returnFormattedValues=true" + "&getResults=true";
                            }
                            if (options.cancelId) {
                                url += "&cancelId=" + euc(options.cancelId);
                            }
                        }

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {String}
                     */
                    buildSmartQueryExportUrl: function (options) {
                        var url;

                        url = [];
                        url.push(buildBaseUrl(this, "WebShellSmartQueryService.ashx"));
                        url.push("&forExport=true");

                        if (options && options.getResults) {
                            url.push("&getResults=true");
                        }

                        return url.join("");
                    },

                    /**
                     * @return {promise}
                     */
                    userGetFunctionalAreaHistory: function (functionalAreaId, options) {
                        var url;

                        url = buildSvcBaseUrl(this, "userGetFunctionalAreaHistory") +
                            "&functionalAreaId=" +
                            euc(functionalAreaId);

                        if (options) {
                            if (options.folderPath) {
                                url += "&folderPath=" +
                                    euc(options.folderPath);
                            }

                            if (options.includeSearchTasks) {
                                url += "&includeSearchTasks=true";
                            }

                            if (options.includeShortcuts) {
                                url += "&includeShortcuts=true";
                            }

                            if (!options.skipMru) {
                                url += "&includeMru=true";
                            }
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdateDataFormSettings: function (formSessionId, userSettingsPath) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdateDataFormSettings") +
                            "&formSessionId=" +
                            euc(formSessionId) +
                            "&userSettingsPath=" +
                            euc(userSettingsPath);

                        return doPost(this, url, null);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdateSelectedPervasiveSearchTask: function (pervasiveSearchTaskId) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdateSelectedPervasiveSearchTask");

                        if (pervasiveSearchTaskId) {
                            url += "&pervasiveSearchTaskId=" + euc(pervasiveSearchTaskId);
                        }

                        return doPost(this, url, null);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdateShortcuts: function (request, options) {
                        var url;

                        options = options || {};

                        url = buildSvcBaseUrl(this, "userUpdateShortcuts");

                        if (options.remove) {
                            url += "&remove=" + euc(options.remove);
                        }

                        if (options.replace) {
                            url += "&replace=" + euc(options.replace);
                        }

                        return doPost(this, url, request);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdatePageActionGroupSettings: function (pageId, actionGroups) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdatePageActionGroupSettings") +
                            "&pageId=" +
                            euc(pageId);

                        return doPost(this, url, actionGroups);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdateFunctionalAreaActionGroupSettings: function (functionalAreaId, actionGroups) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdateFunctionalAreaActionGroupSettings") +
                            "&functionalAreaId=" +
                            euc(functionalAreaId);

                        return doPost(this, url, actionGroups);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdatePageDataListSettings: function (pageId, sectionId, dataListId, settings) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdatePageDataListSettings", pageId, null, sectionId) +
                            "&dataListId=" +
                            euc(dataListId);

                        return doPost(this, url, settings);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdatePageListBuilderSettings: function (queryViewId, userSettingsPath, settings, options) {
                        var url;

                        options = options || {};

                        url = buildSvcBaseUrl(this, "userUpdatePageListBuilderSettings") +
                            "&queryViewId=" +
                            euc(queryViewId) +
                            "&userSettingsPath=" +
                            euc(userSettingsPath);

                        if (options.storeSettingsByContextRecordId) {
                            url += "&storeSettingsByContextRecordId=true";

                            if (options.contextRecordId) {
                                url += "&contextRecordId=" + euc(options.contextRecordId);
                            }
                        }

                        return doPost(this, url, settings);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdateAdHocQueryListBuilderSettings: function (queryViewId, adHocQueryId, userSettingsPath, settings) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdatePageListBuilderSettings") +
                            "&queryViewId=" +
                            euc(queryViewId) +
                            "&adHocQueryId=" +
                            euc(adHocQueryId) +
                            "&userSettingsPath=" +
                            euc(userSettingsPath);

                        return doPost(this, url, settings);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdatePageSectionSettings: function (pageId, sections) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdatePageSectionSettings") +
                            "&pageId=" +
                            euc(pageId);

                        return doPost(this, url, sections);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdatePageTabSettings: function (pageId, tabs) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdatePageTabSettings") +
                            "&pageId=" +
                            euc(pageId);

                        return doPost(this, url, tabs);
                    },

                    /**
                     * @return {promise}
                     */
                    userSetFeatureTipSeen: function (featureTipId, tipSeen) {
                        var url;

                        url = buildSvcBaseUrl(this, "userSetFeatureTipSeen");

                        return doPost(this, url, {featureTipId: featureTipId, tipSeen: tipSeen});
                    },

                    /**
                     * @return {promise}
                     */
                    userGetFeatureTipSeen: function (featureTipId, setTipAsSeen) {
                        var url;

                        url = buildSvcBaseUrl(this, "userGetFeatureTipSeen");

                        return doPost(this, url, {featureTipId: featureTipId, setTipAsSeen: setTipAsSeen});
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdateSearchListGridSettings: function (searchlistid, gridSettings) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdateSearchListGridSettings") +
                            "&searchlistid=" +
                            euc(searchlistid);

                        return doPost(this, url, gridSettings);
                    },

                    /**
                     * @return {promise}
                     */
                    userGetSearchListGridSettings: function (searchlistid) {
                        var url;

                        url = buildSvcBaseUrl(this, "userGetSearchListGridSettings") +
                            "&searchlistid=" +
                            euc(searchlistid);

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    userUpdateActionPanelSettings: function (settings) {
                        var url;

                        url = buildSvcBaseUrl(this, "userUpdateActionPanelSettings");

                        return doPost(this, url, settings);
                    },

                    /**
                     * @return {promise}
                     */
                    featureSearch: function (criteria, onlyRssFeeds) {
                        var url;

                        url = buildSvcBaseUrl(this, "featureSearch") +
                            "&criteria=" +
                            euc(criteria);

                        if (onlyRssFeeds) {
                            url += "&onlyRssFeeds=true";
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {String}
                     */
                    buildRssFeedUrl: function (dataListId, contextRecordId) {
                        var url;

                        url = BBUI.urlConcat(this.baseUrl, "rssfeed.ashx?WebShell=true&DBName=" +
                            euc(this.databaseName) +
                            "&DataListID=" +
                            euc(dataListId));

                        if (contextRecordId) {
                            url += "&ContextRecordID=" + contextRecordId;
                        }

                        return url;
                    },

                    /**
                     * Loads a data form from the server and passes the {@link BBUI.webshell.servicecontracts.DataFormLoadReply reply object} to the promise.
                     *
                     * @param {String} dataFormInstanceId
                     * The ID of the data form instance to load.
                     *
                     * @param {Object} [options]
                     *
                     * @param {String} [options.recordId]
                     * The ID of the record for the data form.
                     *
                     * @param {String} [options.contextRecordId]
                     * The ID of the record that provides context for the data form.
                     *
                     * @return {promise}
                     */
                    dataFormLoad: function (dataFormInstanceId, options) {
                        var url;

                        options = options || {};

                        url = buildSvcBaseUrl(this, "dataFormLoad") +
                            "&dataFormInstanceId=" +
                            euc(dataFormInstanceId);

                        if (options.recordId) {
                            url += "&recordId=" + euc(options.recordId);
                        }

                        if (options.contextRecordId) {
                            url += "&contextRecordId=" + euc(options.contextRecordId);
                        }

                        url = addSecurityContext(url, options);

                        return doGet(this, url);
                    },

                    /**
                     * Saves a data form on the server and passes the {@link BBUI.webshell.servicecontracts.DataFormSaveReply reply object} to the promise.
                     *
                     * <pre><code>
var svc = bbuiShellService.create(),
    constituentsValueCollection;

if (constituents && constituents.length) {
    constituentsValueCollection = [];
    constituents.forEach(function (constituent) {
        constituentsValueCollection.push([
            {
                name: "CONSTITUENTID",
                value: constituent.id
            },
            {
                name: "DISPLAYNAME",
                value: constituent.displayName
            }
        ]);
    });
}

svc.dataFormSave(
    MYFORM_ADD_ID,
    {
        contextRecordId: myContextRecordId,
        values: [
            {
                name: "FIELD1",
                value: field1Value
            },
            {
                name: "FIELD2",
                value: field2Value
            },
            {
                name: "CONSTITUENTS",
                collectionValue: constituentsValueCollection
            }
        ]
    }
).then(function (reply) {
    console.log("Record was created: " + reply.data.id);
}, function (reply) {
    console.err("Data form save error: " + reply.data.message);
})
.finally(function () {
});
                     * </code></pre>
                     *
                     *
                     * @param {String} dataFormInstanceId The ID of the data form instance to load.
                     *
                     * @param {Object} [options]
                     *
                     * @param {String} [options.recordId]
                     * The ID of the record for the data form.
                     *
                     * @param {String} [options.contextRecordId]
                     * The ID of the record that provides context for the data form.
                     *
                     * @param {BBUI.uimodeling.restservices.contracts.FieldValue[]} [options.values]
                     * Any form field default values for the form.
                     *
                     * @param {String} [options.securityContextFeatureId]
                     *
                     * @param {String} [options.securityContextFeatureType]
                     *
                     * @return {promise}
                     */
                    dataFormSave: function (dataFormInstanceId, options) {
                        var url,
                            data;

                        options = options || {};

                        data = {};

                        url = buildSvcBaseUrl(this, "dataFormSave") +
                            "&dataFormInstanceId=" +
                            euc(dataFormInstanceId);

                        if (options.recordId) {
                            url += "&recordId=" + euc(options.recordId);
                        }

                        if (options.contextRecordId) {
                            url += "&contextRecordId=" + euc(options.contextRecordId);
                        }

                        url = addSecurityContext(url, options);

                        if (options.values) {
                            data.values = options.values;
                        }

                        return doPost(this, url, data);
                    },

                    /**
                     * @return {promise}
                     */
                    taskWizardGetDefinition: function (taskWizardId) {
                        var url;

                        url = buildSvcBaseUrl(this, "taskwizardgetdefinition") +
                            "&taskWizardId=" +
                            euc(taskWizardId);

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    taskWizardGetTaskStatus: function (taskId) {
                        var url;

                        url = buildSvcBaseUrl(this, "taskwizardgettaskstatus") +
                            "&taskId=" +
                            euc(taskId);

                        return doGet(this, url);
                    },

                    /**
                     * @return {String}
                     */
                    buildReportExportUrl: function (reportId, historyId, exportType, deviceInfo, dataFormItemKey, fileName) {
                        var url;

                        url = buildSvcBaseUrl(this, "exportReport") +
                            "&reportId=" + euc(reportId);

                        if (historyId) {
                            url += "&historyId=" + euc(historyId);
                        }

                        if (!BBUI.is(exportType)) {
                            exportType = 2;
                        }

                        url += "&exportType=" + euc(exportType);

                        if (deviceInfo) {
                            url += "&deviceInfo=" + euc(deviceInfo);
                        }

                        if (dataFormItemKey) {
                            url += "&dataFormItemKey=" + euc(dataFormItemKey);
                        }

                        if (fileName) {
                            url += "&fileName=" + euc(fileName);
                        }

                        return url;
                    },

                    /**
                     * @return {promise}
                     */
                    cacheDataFormItem: function (values) {
                        var url,
                            data;

                        if (values) {
                            data = {
                                values: values
                            };
                        }

                        url = buildSvcBaseUrl(this, "cacheDataFormItem");

                        return doPost(this, url, data);
                    },

                    /**
                     * @return {promise}
                     */
                    idMap: function (idMapperId, sourceId) {
                        var url;

                        url = buildSvcBaseUrl(this, "idMap") +
                            "&idMapperId=" + euc(idMapperId);

                        if (sourceId) {
                            url += "&sourceId=" + euc(sourceId);
                        }

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    securityUserGrantedFeature: function (id, featureType) {
                        var url;

                        url = buildSvcBaseUrl(this, "securityUserGrantedFeature") +
                            "&id=" + euc(id) +
                            "&featureType=" + euc(featureType);

                        return doGet(this, url);
                    },

                    /**
                     * @return {promise}
                     */
                    loadCatalogItem: function (sourceType, sourceName, itemResourceName) {
                        var url;

                        url = buildSvcBaseUrl(this, "loadCatalogItem") +
                            "&sourceType=" + euc(sourceType) +
                            "&sourceName=" + euc(sourceName) +
                            "&itemResourceName=" + euc(itemResourceName);

                        return doPost(this, url, null);
                    },

                    /**
                     * @return {promise}
                     */
                    getPageHelpKey: function (pageId, tabId, sectionId, recordId) {
                        var url;

                        url = buildSvcBaseUrl(this, "getPageHelpkey", pageId, tabId, sectionId, null, recordId);

                        return doGet(this, url);
                    },

                    /**
                     * @return {String}
                     */
                    buildSvcBaseUrl: function (action) {
                        return buildSvcBaseUrl(this, action);
                    },

                    /**
                     * @return {promise}
                     */
                    doGet: function (url) {
                        return doRequest(this, "GET", url, null);
                    },

                    /**
                     * @return {promise}
                     */
                    doPost: function (url, data) {
                        return doRequest(this, "POST", url, data);
                    }
                };

            }());

            /**
             * @class bbui.shellservice.bbuiShellService
             */
            return {
                /**
                 *
                 * @return {bbui.shellservice.bbuiShellService.Service}
                 */
                create: function (baseUrl, databaseName, options) {
                    var svc;

                    baseUrl = baseUrl || bbuiShellServiceConfig.baseUrl;
                    databaseName = databaseName || bbuiShellServiceConfig.databaseName;

                    if (baseUrl === null || !databaseName) {
                        throw new Error('You must either provide a baseUrl and databaseName as parameters or set them globally using bbuiShellServiceConfig.');
                    }

                    svc = new Service(baseUrl, databaseName, options);
                    svc.$http = $http;

                    return svc;
                }
            };
        }]);
}());

/*global angular */

(function () {
    "use strict";

    angular.module('bbui.uimodelingservice', [])
        /**
         * @class bbui.uimodelingservice.bbuiUIModelingServiceConfig
         *
         * Configuration for {@link bbui.uimodelingservice.bbuiUIModelingService bbuiUIModelingService}.
         */
        .constant('bbuiUIModelingServiceConfig', {
            /**
             * @cfg {String} baseUrl
             */
            baseUrl: null,
            /**
             * @cfg {String} databaseName
             */
            databaseName: null
        })
        .factory('bbuiUIModelingService', ['$http', 'bbui', 'bbuiUIModelingServiceConfig', function ($http, BBUI, bbuiUIModelingServiceConfig) {
            var euc,
                formSessionServerIds,
                formSessionServerIdsBufferPos,
                formSessionServerIdsBufferSize,
                Service;

            // Since this is called many times in this file, create a shorter alias for it.
            euc = encodeURIComponent;

            formSessionServerIds = [];
            formSessionServerIdsBufferPos = 0;
            formSessionServerIdsBufferSize = 100;

            function buildSvcBaseUrl(svc, action, formSessionId, modelInstanceId, fieldId) {
                var url;

                url =
                    BBUI.urlConcat(svc.baseUrl, "uimodel/UIModelingService.ashx?action=") +
                    action +
                    "&databaseName=" + euc(svc.databaseName);

                if (svc.runAs) {
                    url += "&runAs=" + euc(svc.runAs);
                }

                if (formSessionId) {
                    url += "&formSessionId=" + euc(formSessionId);
                }

                if (modelInstanceId) {
                    url += "&modelInstanceId=" + euc(modelInstanceId);
                }

                if (fieldId) {
                    url += "&fieldId=" + euc(fieldId);
                }

                return url;
            }

            function doRequest(svc, method, url, data) {
                return svc.$http({
                    method: method,
                    url: url,
                    data: data,
                    cache: false
                });
            }

            function doGet(svc, url) {
                return doRequest(svc, "GET", url, null);
            }

            function doPost(svc, url, data) {
                return doRequest(svc, "POST", url, data);
            }

            /**
             * @private
             *
             * @param {String} url
             *
             * @param {Object} [options]
             *
             * @param {String} [options.recordId]
             *
             * @param {String} [options.contextRecordId]
             *
             * @param {String} [options.uiWidgetDashboardSystemId]
             *
             * @param {String} [options.uiWidgetDashboardWidgetId]
             *
             * @param {String} [options.userSettingsPath]
             *
             * @return {String}
             * The URL with query string parameters appended.
             */
            function addOptionalFormSessionArgs(url, options) {

                if (options) {
                    if (options.recordId) {
                        url += "&recordId=" + euc(options.recordId);
                    }

                    if (options.contextRecordId) {
                        url += "&contextRecordId=" + euc(options.contextRecordId);
                    }

                    if (options.uiWidgetDashboardSystemId) {
                        url += "&uiWidgetDashboardSystemId=" + euc(options.uiWidgetDashboardSystemId);
                    }

                    if (options.uiWidgetDashboardWidgetId) {
                        url += "&uiWidgetDashboardWidgetId=" + euc(options.uiWidgetDashboardWidgetId);
                    }

                    if (options.userSettingsPath) {
                        url += "&userSettingsPath=" + euc(options.userSettingsPath);
                    }
                }

                return url;
            }

            /**
             * @class bbui.uimodelingservice.bbuiUIModelingService.Service
             * Provides various methods for communicating changes to a UI model to the web server.
             *
             * @param {String} baseUrl
             * The base URL to the web server.
             *
             * @param {String} databaseName
             * The name of the database to which to connect.
             *
             * @param {Object} [options]
             *
             * @param {Object} options.runAs
             *
             * @param {Object} options.onRequestBegin
             *
             * @param {Object} options.onRequestEnd
             *
             * @param {Object} options.httpHeaders
             *
             * @param {Object} options.useEventQueue
             *
             */
            Service = function (baseUrl, databaseName, options) {

                var svc,
                    useEventQueue;

                svc = this;

                /**
                 * @readonly
                 * The base URL to the web server.
                 * @property baseUrl
                 * @type String
                 */
                svc.baseUrl = baseUrl;

                /**
                 * @readonly
                 * The name of the database to which to connect.
                 * @property databaseName
                 * @type String
                 */
                svc.databaseName = databaseName;

                if (options) {
                    svc.runAs = options.runAs;
                    svc.onRequestBegin = options.onRequestBegin;
                    svc.onRequestEnd = options.onRequestEnd;
                    svc.httpHeaders = options.httpHeaders;
                    svc.useEventQueue = useEventQueue = BBUI.is(options.useEventQueue) ? options.useEventQueue : true;

                    if (useEventQueue) {
                        svc._formSessionQueue = {};
                    }
                }

                /**
                 * @property handlers
                 * @type Object
                 */
                svc.handlers = {};
            };

            Service.prototype = {

                /**
                 */
                on: function (evt, fn, scope, formSessionId) {
                    var evtHandlers,
                        handlers;

                    handlers = this.handlers;

                    evtHandlers = handlers[evt];

                    if (!evtHandlers) {
                        evtHandlers = handlers[evt] = [];
                    }

                    evtHandlers.push({
                        fn: fn,
                        formSessionId: formSessionId,
                        scope: scope
                    });
                },

                /**
                 */
                un: function (evt, fn, formSessionId) {
                    var evtHandlers,
                        i;

                    evtHandlers = this.handlers[evt];

                    if (evtHandlers) {
                        i = evtHandlers.length;
                        while (i--) {
                            if (evtHandlers[i].fn === fn && evtHandlers[i].formSessionId === formSessionId) {
                                evtHandlers.splice(i, 1);
                                break;
                            }
                        }
                    }
                },

                /**
                 * Creates an instance of the form on the server.
                 *
                 * @param {String} assemblyName
                 * The assembly name containing the UI model class.
                 *
                 * @param {String} className
                 * The name of the UI model class.
                 *
                 * @param {BBUI.uimodeling.servicecontracts.CreateDataFormSessionArgs} [args]
                 * Arguments to pass to the form session.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {String} [options.recordId]
                 * The ID of the record being edited.
                 *
                 * @param {String} [options.contextRecordId]
                 * The ID of the record that provides the context for the record being added or edited.
                 *
                 * @param {String} [options.uiWidgetDashboardSystemId]
                 *
                 * @param {String} [options.uiWidgetDashboardWidgetId]
                 *
                 * @param {String} [options.userSettingsPath]
                 *
                 * @return {promise}
                 */
                createFormSession: function (assemblyName, className, args, options) {

                    var url;

                    options = options || {};

                    url = buildSvcBaseUrl(this, "createFormSession") +
                        "&assemblyName=" +
                        euc(assemblyName) +
                        "&className=" +
                        euc(className);

                    url = addOptionalFormSessionArgs(url, options);

                    return doPost(this, url, args);
                },

                /**
                 * Creates an instance of the form on the server.
                 *
                 * @param {String} mergeTaskId
                 * The Id of the merge task.
                 *
                 * @param {BBUI.uimodeling.servicecontracts.CreateDataFormSessionArgs} [args]
                 * Arguments to pass to the form session.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {String} [options.recordId]
                 * The ID of the record being edited.
                 *
                 * @param {String} [options.contextRecordId]
                 * The ID of the record that provides the context for the record being added or edited.
                 *
                 * @param {String} [options.uiWidgetDashboardSystemId]
                 *
                 * @param {String} [options.uiWidgetDashboardWidgetId]
                 *
                 * @param {String} [options.userSettingsPath]
                 *
                 * @return {promise}
                 */
                createMergeTaskFormSession: function (mergeTaskId, args, options) {

                    var url;

                    options = options || {};

                    url = buildSvcBaseUrl(this, "createMergeTaskFormSession") +
                        "&mergeTaskId=" +
                        euc(mergeTaskId);

                    url = addOptionalFormSessionArgs(url, options);

                    return doPost(this, url, args);
                },

                /**
                 * Creates an instance of the form on the server.
                 *
                 * @param {String} dataFormInstanceId
                 * The ID of the data form instance to interact with.
                 *
                 * @param {BBUI.uimodeling.servicecontracts.CreateDataFormSessionArgs} [args]
                 * Arguments to pass to the form session.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {String} [options.recordId]
                 * The ID of the record being edited.
                 *
                 * @param {String} [options.contextRecordId]
                 * The ID of the record that provides the context for the record being added or edited.
                 *
                 * @param {String} [options.uiWidgetDashboardSystemId]
                 *
                 * @param {String} [options.uiWidgetDashboardWidgetId]
                 *
                 * @param {String} [options.userSettingsPath]
                 *
                 * @return {promise}
                 */
                createDataFormSession: function (dataFormInstanceId, args, options) {

                    var url;

                    options = options || {};

                    url = buildSvcBaseUrl(this, "createDataFormSession") +
                        "&dataFormInstanceId=" +
                        euc(dataFormInstanceId);

                    url = addOptionalFormSessionArgs(url, options);

                    return doPost(this, url, args);
                },

                /**
                 * Creates an instance of the form on the server.
                 *
                 * @param {String} searchListId
                 * The ID of the search list to interact with.
                 *
                 * @param {BBUI.uimodeling.servicecontracts.CreateSearchListFormSessionArgs} [args]
                 * Arguments to pass to the search list session.
                 *
                 * @return {promise}
                 */
                createSearchListSession: function (searchListId, args) {

                    var url;

                    url = buildSvcBaseUrl(this, "createSearchListFormSession") +
                        "&searchListId=" +
                        euc(searchListId);

                    return doPost(this, url, args);
                },

                /**
                 * Creates an instance of the data list's filter form on the server.
                 *
                 * @param {String} dataFormInstanceId
                 * The ID of the data list to interact with.
                 *
                 * @param {BBUI.uimodeling.servicecontracts.CreateDataFormSessionArgs} [args]
                 * Arguments to pass to the form session.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {String} [options.recordId]
                 * The ID of the record being edited.
                 *
                 * @param {String} [options.contextRecordId]
                 * The ID of the record that provides the context for the record being added or edited.
                 *
                 * @param {String} [options.uiWidgetDashboardSystemId]
                 *
                 * @param {String} [options.uiWidgetDashboardWidgetId]
                 *
                 * @param {String} [options.userSettingsPath]
                 *
                 * @return {promise}
                 */
                createDataListFilterFormSession: function (dataListId, args, options) {

                    var url;

                    options = options || {};

                    url = buildSvcBaseUrl(this, "createDataListFilterFormSession") +
                        "&dataListId=" +
                        euc(dataListId);

                    url = addOptionalFormSessionArgs(url, options);

                    return doPost(this, url, args);
                },

                /**
                 * Creates an instance of the list builder filter form on the server.
                 *
                 * @param {String} queryViewId
                 * The ID of the query view used to render the list.
                 *
                 * @param {BBUI.uimodeling.servicecontracts.CreateDataFormSessionArgs} [args]
                 * Arguments to pass to the form session.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {String} [options.recordId]
                 * The ID of the record being edited.
                 *
                 * @param {String} [options.contextRecordId]
                 * The ID of the record that provides the context for the record being added or edited.
                 *
                 * @param {String} [options.uiWidgetDashboardSystemId]
                 *
                 * @param {String} [options.uiWidgetDashboardWidgetId]
                 *
                 * @param {String} [options.userSettingsPath]
                 *
                 * @return {promise}
                 */
                createListBuilderFilterFormSession: function (queryViewId, args, options) {

                    var url;

                    options = options || {};

                    url = buildSvcBaseUrl(this, "createListBuilderFilterFormSession") +
                        "&queryViewId=" +
                        euc(queryViewId);

                    url = addOptionalFormSessionArgs(url, options);

                    return doPost(this, url, args);
                },

                /**
                 * Creates an instance of the report's parameter form on the server.
                 *
                 * @param {String} reportId
                 * The ID of the report to interact with.
                 *
                 * @param {String} historyId
                 * The history ID of the report to interact with.
                 *
                 * @param {BBUI.uimodeling.servicecontracts.CreateDataFormSessionArgs} [args]
                 * Arguments to pass to the form session.
                 *
                 * @param {Object} [options]
                 *
                 * @param {Boolean} [options.showAllParameters]
                 *
                 * @return {promise}
                 */
                createReportParameterFormSession: function (reportId, historyId, args, options) {

                    var url;

                    options = options || {};

                    url = buildSvcBaseUrl(this, "createReportParameterFormSession") +
                        "&reportId=" +
                        euc(reportId);

                    if (historyId) {
                        url += "&historyId=" + euc(historyId);
                    }

                    if (options.showAllParameters) {
                        url += "&showAllParameters=true";
                    }

                    return doPost(this, url, args);
                },

                /**
                 * Creates an instance of the business process's parameter form on the server.
                 *
                 * @param {String} businessProcessId
                 * The ID of the data form instance to interact with.
                 *
                 * @param {BBUI.uimodeling.servicecontracts.CreateDataFormSessionArgs} [args]
                 * Arguments to pass to the form session.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {String} [options.recordId]
                 * The ID of the record being edited.
                 *
                 * @param {String} [options.contextRecordId]
                 * The ID of the record that provides the context for the record being added or edited.
                 *
                 * @param {String} [options.uiWidgetDashboardSystemId]
                 *
                 * @param {String} [options.uiWidgetDashboardWidgetId]
                 *
                 * @param {String} [options.userSettingsPath]
                 *
                 * @return {promise}
                 */
                createBusinessProcessFormSession: function (businessProcessId, args, options) {

                    var url;

                    options = options || {};

                    url = buildSvcBaseUrl(this, "createBusinessProcessFormSession") +
                        "&businessProcessId=" +
                        euc(businessProcessId);

                    url = addOptionalFormSessionArgs(url, options);

                    return doPost(this, url, args);
                },

                /**
                 */
                buildSearchListResultsUrl: function (formSessionId, modelInstanceId, htmlEncodeValues, returnFormattedValues, taskId, taskHistoryId, cancelId) {
                    var url;

                    url = BBUI.urlConcat(this.baseUrl, "uimodel/UIModelingSearchService.ashx?databaseName=") + euc(this.databaseName);

                    if (this.runAs) {
                        url += "&runAs=" + euc(this.runAs);
                    }

                    url +=
                        "&formSessionId=" + euc(formSessionId) +
                        "&modelInstanceId=" + euc(modelInstanceId);

                    if (htmlEncodeValues) {
                        url += "&htmlEncodeValues=true";
                    }

                    if (returnFormattedValues) {
                        url += "&returnFormattedValues=true";
                    }

                    if (taskId) {
                        url += "&taskId=" + euc(taskId);
                    }

                    if (taskHistoryId) {
                        url += "&taskHistoryId=" + euc(taskHistoryId);
                    }

                    if (cancelId) {
                        url += "&cancelId=" + euc(cancelId);
                    }

                    return url;
                },

                /**
                 */
                buildStartBusinessProcessUrl: function (businessProcessId, parameterSetId, dataFormItemKey, businessProcessStatusId) {
                    var url;

                    url =
                        BBUI.urlConcat(this.baseUrl, "uimodel/UIModelingBusinessProcessService.ashx?databaseName=") + euc(this.databaseName) +
                        "&businessProcessId=" + euc(businessProcessId);

                    if (BBUI.is(parameterSetId)) {
                        url += "&parameterSetId=" + euc(parameterSetId);
                    }

                    if (BBUI.is(dataFormItemKey)) {
                        url += "&dataFormItemKey=" + euc(dataFormItemKey);
                    }

                    if (BBUI.is(businessProcessStatusId)) {
                        url += "&businessProcessStatusId=" + euc(businessProcessStatusId);
                    }

                    if (this.runAs) {
                        url += "&runAs=" + euc(this.runAs);
                    }

                    return url;
                },

                /**
                 * Gets the output definition of a search.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the search list form model.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the search list form model.
                 *
                 * @param {Boolean} returnExistingResults
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {String} [options.taskHistoryId]
                 *
                 * @return {promise}
                 */
                searchListGetOutputDefinition: function (formSessionId, modelInstanceId, returnExistingResults, options) {

                    var url = buildSvcBaseUrl(this, "searchListGetOutputDefinition", formSessionId, modelInstanceId) +
                        "&returnExistingResults=" +
                        (returnExistingResults ? "true" : "false");

                    if (!options) {
                        options = {};
                    }

                    if (options.taskHistoryId) {
                        url += "&taskHistoryId=" + euc(options.taskHistoryId);
                    }

                    return doGet(this, url);
                },

                /**
                 * Gets the results of a search.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the search list form model.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the search list form model.
                 *
                 * @param {Object} htmlEncodeValues
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {Boolean} [options.returnFormattedValues]
                 *
                 * @param {String} [options.taskId]
                 *
                 * @param {String} [options.taskHistoryId]
                 *
                 * @param {String} [options.cancelId]
                 *
                 * @return {promise}
                 */
                getSearchListResults: function (formSessionId, modelInstanceId, htmlEncodeValues, options) {

                    var url;

                    if (!options) {
                        options = {};
                    }

                    // Append a timestamp to the end of the URL so the results aren't cached by the browser.
                    url = this.buildSearchListResultsUrl(formSessionId,
                        modelInstanceId,
                        htmlEncodeValues,
                        options.returnFormattedValues,
                        options.taskId,
                        options.taskHistoryId,
                        options.cancelId) +
                        "&_reqid=" + new Date().getTime();

                    return doGet(this, url);
                },

                /**
                 * Invokes the searchItemSelected event with the given search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the search form session.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the search model instance.
                 *
                 * @param {Number} selectedIndex
                 * The zero-based index of the selected search result row.
                 *
                 * @return {promise}
                 */
                invokeSearchItemSelected: function (formSessionId, modelInstanceId, selectedIndex) {

                    var url = buildSvcBaseUrl(this, "invokeSearchItemSelected", formSessionId, modelInstanceId);

                    return doPost(this, url, selectedIndex);
                },

                /**
                 * Invokes the search list associated with the given search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 * The name of the search field.
                 *
                 * @return {promise}
                 */
                invokeFieldSearch: function (formSessionId, modelInstanceId, fieldName) {

                    var url = buildSvcBaseUrl(this, "invokeFieldSearch", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url);
                },

                /**
                 * Invokes quick find on the given search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 * The name of the search field.
                 *
                 * @param {String} criteria
                 * The quick find criteria.
                 *
                 * @return {promise}
                 */
                invokeFieldQuickFind: function (formSessionId, modelInstanceId, fieldName, criteria) {

                    var url;

                    url = BBUI.urlConcat(this.baseUrl, "uimodel/UIModelingSearchService.ashx?databaseName=" +
                        euc(this.databaseName) +
                        "&formSessionId=" +
                        euc(formSessionId) +
                        "&modelInstanceId=" +
                        euc(modelInstanceId) +
                        "&fieldId=" +
                        euc(fieldName) +
                        "&quickFindCriteria=" +
                        euc(criteria));

                    if (this.runAs) {
                        url += "&runAs=" + euc(this.runAs);
                    }

                    return doPost(this, url);
                },

                /**
                 * Invokes the search list associated with the given search field and executes the search.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 * The name of the search field.
                 *
                 * @return {promise}
                 */
                invokeFieldAutoSearch: function (formSessionId, modelInstanceId, fieldName) {

                    var url;

                    url = BBUI.urlConcat(this.baseUrl, "uimodel/UIModelingSearchService.ashx?databaseName=" +
                        euc(this.databaseName) +
                        "&formSessionId=" +
                        euc(formSessionId) +
                        "&modelInstanceId=" +
                        euc(modelInstanceId) +
                        "&fieldId=" +
                        euc(fieldName) +
                        "&autoSearch=true");

                    if (this.runAs) {
                        url += "&runAs=" + euc(this.runAs);
                    }

                    return doPost(this, url);
                },

                /**
                 * Invokes quick find on the given search list.
                 *
                 * @param {String} searchListId
                 * The ID of the search list.
                 *
                 * @param {String} criteria
                 * The quick find criteria.
                 *
                 * @return {promise}
                 */
                invokeQuickFind: function (searchListId, criteria) {

                    var url;

                    url = BBUI.urlConcat(this.baseUrl, "uimodel/UIModelingSearchService.ashx?databaseName=" +
                        euc(this.databaseName) +
                        "&searchListId=" +
                        euc(searchListId) +
                        "&quickFindCriteria=" +
                        euc(criteria));

                    if (this.runAs) {
                        url += "&runAs=" + euc(this.runAs);
                    }

                    return doPost(this, url);
                },

                /**
                 * Checks the current values of a data form session's fields to see if there are matching records already in the database.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the data.
                 *
                 * @return {promise}
                 */
                checkForDuplicate: function (formSessionId, modelInstanceId) {

                    var url;

                    url = BBUI.urlConcat(this.baseUrl, "uimodel/UIModelingSearchService.ashx?databaseName=" +
                        euc(this.databaseName) +
                        "&formSessionId=" +
                        euc(formSessionId) +
                        "&modelInstanceId=" +
                        euc(modelInstanceId) +
                        "&duplicateCheck=true");

                    if (this.runAs) {
                        url += "&runAs=" + euc(this.runAs);
                    }

                    return doPost(this, url, null);
                },

                /**
                 * Selects a search list row to represent the value of the search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 * The name of the search field.
                 *
                 * @param {String} searchFormSessionId
                 * The ID of the search form session that was invoked.
                 *
                 * @param {Number} selectedIndex
                 * The zero-based index of the selected search result row.
                 *
                 * @return {promise}
                 */
                selectFieldSearchItem: function (formSessionId, modelInstanceId, fieldName, searchFormSessionId, selectedIndex) {

                    var url = buildSvcBaseUrl(this, "selectFieldSearchItem", formSessionId, modelInstanceId, fieldName) +
                        "&searchFormSessionId=" +
                        euc(searchFormSessionId);

                    return doPost(this, url, selectedIndex);
                },

                /**
                 * Selects a search list row to represent the value of the search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 * The name of the search field.
                 *
                 * @param {String} recordId
                 * The ID of the selected record.
                 *
                 * @return {promise}
                 */
                selectFieldSearchItemById: function (formSessionId, modelInstanceId, fieldName, recordId) {

                    var url = buildSvcBaseUrl(this, "selectFieldSearchItemById", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, recordId);
                },

                /**
                 * Selects a search list row to represent the value of the search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} actionName
                 * The name of the search action.
                 *
                 * @param {String} searchFormSessionId
                 * The ID of the search form session that was invoked.
                 *
                 * @param {Number} selectedIndex
                 * The zero-based index of the selected search result row.
                 *
                 * @return {promise}
                 */
                selectActionSearchItem: function (formSessionId, modelInstanceId, actionName, searchFormSessionId, selectedIndex) {

                    var url = buildSvcBaseUrl(this, "selectSearchItemAction", formSessionId, modelInstanceId) +
                        "&actionId=" + actionName +
                        "&searchFormSessionId=" +
                        euc(searchFormSessionId);

                    return doPost(this, url, selectedIndex);
                },

                /**
                 * Selects a search list row to represent the value of the search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} actionName
                 * The name of the search action.
                 *
                 * @param {String} recordId
                 * The ID of the selected record.
                 *
                 * @return {promise}
                 */
                selectActionSearchItemById: function (formSessionId, modelInstanceId, actionName, recordId) {

                    var url = buildSvcBaseUrl(this, "selectSearchItemActionById", formSessionId, modelInstanceId) +
                        "&actionId=" + actionName;

                    return doPost(this, url, recordId);
                },

                /**
                 * Updates a field on the form.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the field to be updated.
                 *
                 * @param {String|Number|Boolean|Object} value
                 * The field's value.
                 *
                 * @return {promise}
                 */
                updateField: function (formSessionId, modelInstanceId, fieldName, value) {

                    var url = buildSvcBaseUrl(this, "updateField", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, value);
                },

                /**
                 * Updates multiple fields on the form.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and fields to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the fields to be updated.
                 *
                 * @param {Object[]} fieldValues
                 * @param {String} fieldValues.name
                 * @param {Object} fieldValues.value
                 *
                 * @return {promise}
                 */
                updateMultipleFields: function (formSessionId, modelInstanceId, fieldValues) {

                    var url = buildSvcBaseUrl(this, "updateMultipleFields", formSessionId, modelInstanceId);

                    return doPost(this, url, fieldValues);
                },

                /**
                 * Updates one or more special properties on a relationship map field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the field to be updated.
                 *
                 * @param {Object[]} properties
                 * The properties on the relationship map field to update.
                 * @param {String} properties.name
                 * @param {Object} properties.value
                 *
                 * @return {promise}
                 */
                updateRelationshipMapFieldProperties: function (formSessionId, modelInstanceId, fieldName, properties) {

                    var url = buildSvcBaseUrl(this, "updateRelationshipMapFieldProperties", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, properties);
                },

                /**
                 * Selects or de-selects the given tree view node.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the field to be updated.
                 *
                 * @param {String} nodePath
                 * The fully qualified path of the node to select.
                 *
                 * @return {promise}
                 */
                selectTreeViewNode: function (formSessionId, modelInstanceId, fieldName, nodePath) {

                    var url = buildSvcBaseUrl(this, "selectTreeViewNode", formSessionId, modelInstanceId, fieldName) +
                        "&nodePath=" +
                        euc(nodePath);

                    return doPost(this, url, null);
                },

                /**
                 * Selects or de-selects the given tree view nodes.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the field to be updated.
                 *
                 * @param {String} nodePaths
                 * The fully qualified path of each node to select.
                 *
                 * @return {promise}
                 */
                selectTreeViewNodes: function (formSessionId, modelInstanceId, fieldName, nodePaths) {

                    var url = buildSvcBaseUrl(this, "selectTreeViewNodes", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, nodePaths);
                },

                /**
                 * Sets the expanded property on a tree view node.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the field to be updated.
                 *
                 * @param {String} nodePath
                 * The fully qualified path of the node.
                 *
                 * @param {Boolean} expanded
                 * A flag indicating whether the node is expanded.
                 *
                 * @return {promise}
                 */
                setTreeViewNodeExpanded: function (formSessionId, modelInstanceId, fieldName, nodePath, expanded) {

                    var url = buildSvcBaseUrl(this, "setTreeViewNodeExpanded", formSessionId, modelInstanceId, fieldName) +
                        "&nodePath=" +
                        euc(nodePath) +
                        "&expanded=" +
                        euc(expanded);

                    return doPost(this, url, null);
                },

                /**
                 * Adds a code table entry and sets the specified field's value to the new code table entry.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the field to be updated.
                 *
                 * @param {String|Number|Boolean|Object} codeTableEntryDescription
                 * The description of the code table entry to add.
                 *
                 * @return {promise}
                 */
                addCodeTableEntry: function (formSessionId, modelInstanceId, fieldName, codeTableEntryDescription) {

                    var url = buildSvcBaseUrl(this, "addCodeTableEntry", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, codeTableEntryDescription);
                },

                /**
                 * Deletes an item from a collection field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the collection field containing the item to be deleted.
                 *
                 * @param {String} itemInstanceId
                 * The ID of the item to be deleted.
                 *
                 * @return {promise}
                 */
                deleteCollectionItem: function (formSessionId, modelInstanceId, fieldName, itemInstanceId) {

                    var url = buildSvcBaseUrl(this, "deleteCollectionItem", formSessionId, modelInstanceId, fieldName) +
                        "&itemInstanceId=" +
                        euc(itemInstanceId);

                    return doPost(this, url, null);
                },

                /**
                 * Deletes items from a collection field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the collection field containing the item to be deleted.
                 *
                 * @param {String[]} itemInstanceIds
                 * The items to be deleted.
                 *
                 * @return {promise}
                 */
                deleteCollectionItems: function (formSessionId, modelInstanceId, fieldName, itemInstanceIds) {

                    var url = buildSvcBaseUrl(this, "deleteCollectionItems", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, itemInstanceIds);
                },

                /**
                 * Deletes all selected items from a collection field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the collection field containing the item to be deleted.
                 *
                 * @return {promise}
                 */
                deleteSelectedCollectionItems: function (formSessionId, modelInstanceId, fieldName) {

                    var url = buildSvcBaseUrl(this, "deleteSelectedCollectionItems", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, null);
                },

                /**
                 * Selects or de-selects an item in a collection field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the collection field to be updated.
                 *
                 * @param {String} itemInstanceId
                 * The ID of the item.
                 *
                 * @param {Boolean} selected
                 * The selected state of the item.
                 *
                 * @return {promise}
                 */
                setCollectionItemSelected: function (formSessionId, modelInstanceId, fieldName, itemInstanceId, selected) {

                    var url = buildSvcBaseUrl(this, "selectCollectionItem", formSessionId, modelInstanceId, fieldName) +
                        "&itemInstanceId=" +
                        euc(itemInstanceId) +
                        "&selected=" +
                        (selected ? "true" : "false");

                    return doPost(this, url, null);
                },

                /**
                 * Moves an item to a different position in the collection.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and field to be updated.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the field to be updated.
                 *
                 * @param {String} fieldName
                 * The name of the collection field to be updated.
                 *
                 * @param {String} itemInstanceId
                 * The ID of the item.
                 *
                 * @param {Number} newIndex
                 * The new index (zero-based) for the item.
                 *
                 * @return {promise}
                 */
                moveCollectionItem: function (formSessionId, modelInstanceId, fieldName, itemInstanceId, newIndex) {

                    var url = buildSvcBaseUrl(this, "moveCollectionItem", formSessionId, modelInstanceId, fieldName) +
                        "&itemInstanceId=" +
                        euc(itemInstanceId) +
                        "&newindex=" +
                        euc(newIndex);

                    return doPost(this, url, null);
                },

                /**
                 * Saves the form instance on the server.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session to save.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {Boolean} [options.returnDataFormItem]
                 * Flag indicating whether the data form item XML should be returned with the save result.  For backwards compatibility with the Windows ClickOnce shell.
                 *
                 * @param {Boolean} [options.storeDataFormItem]
                 *
                 * @param {Boolean} [options.skipValidate]
                 *
                 * @return {promise}
                 */
                confirmForm: function (formSessionId, options) {

                    var url;

                    if (!BBUI.is(options)) {
                        options = {};
                    }

                    url = buildSvcBaseUrl(this, "confirmFormSession", formSessionId);

                    if (options.returnDataFormItem) {
                        url += "&returnDataFormItem=true";
                    }

                    if (options.storeDataFormItem) {
                        url += "&storeDataFormItem=true";
                    }

                    if (options.skipValidate) {
                        url += "&skipValidate=true";
                    }

                    return doPost(this, url, null);
                },

                /**
                 * Cancels the form instance on the server and removes it from the session.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session to cancel.
                 *
                 * @param {Boolean} overrideDirty
                 * Flag indicating whether to cancel the form even if its values have changed since it was created.
                 *
                 * @return {promise}
                 */
                cancelSession: function (formSessionId, overrideDirty) {

                    var url;

                    url = buildSvcBaseUrl(this, "closeFormSession", formSessionId);
                    url += "&canceling=true";

                    if (overrideDirty) {
                        url += "&overridedirty=true";
                    }

                    return doPost(this, url, null);
                },

                /**
                 * Sends a response to a prompt to the server.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that caused the prompt.
                 *
                 * @param {String} modelInstanceId
                 * ID of the model instance that caused the prompt.
                 *
                 * @param {String} promptId
                 * The ID of the prompt being responded to.
                 *
                 * @param {String|Number|Boolean|Object} response
                 * The prompt response.
                 *
                 * @return {promise}
                 */
                handlePrompt: function (formSessionId, modelInstanceId, promptId, response) {

                    var url = buildSvcBaseUrl(this, "handlePrompt", formSessionId, modelInstanceId) +
                        "&promptId=" +
                        euc(promptId);

                    return doPost(this, url, response);
                },

                /**
                 * Invokes an action on the server.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the action.
                 *
                 * @param {String} modelInstanceId
                 * ID of the model instance that contains the action.
                 *
                 * @param {String} actionName
                 * Name of the action to invoke.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {Object} [options.parameters]
                 *
                 * @param {Object} [options.defaultValues]
                 *
                 * @param {String} [options.cancelId]
                 *
                 * @return {promise}
                 */
                invokeAction: function (formSessionId, modelInstanceId, actionName, options) {

                    var data,
                        url;

                    url = buildSvcBaseUrl(this, "invokeAction", formSessionId, modelInstanceId) +
                        "&actionId=" +
                        euc(actionName);

                    if (options) {
                        if (options.parameters || options.defaultValues) {
                            data = {};
                            if (options.parameters) {
                                data.parameters = options.parameters;
                            }
                            if (options.defaultValues) {
                                data.defaultValues = options.defaultValues;
                            }
                        }
                        if (options.cancelId) {
                            url += "&cancelId=" + euc(options.cancelId);
                        }
                    } else {
                        data = null;
                    }

                    return doPost(this, url, data);
                },

                /**
                 * Confirms a child form that was shown as a result of a form action.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session.
                 *
                 * @param {String} modelInstanceId
                 * ID of the model instance that invoked the action.
                 *
                 * @param {String} actionName
                 * Name of the invoked action.
                 *
                 * @param {String} confirmFormSessionId
                 * The ID of the child form session.
                 *
                 * @return {promise}
                 */
                confirmFormAction: function (formSessionId, modelInstanceId, actionName, confirmFormSessionId) {

                    var url = buildSvcBaseUrl(this, "confirmFormAction", formSessionId, modelInstanceId) +
                        "&actionId=" +
                        euc(actionName) +
                        "&confirmFormSessionId=" +
                        euc(confirmFormSessionId);

                    return doPost(this, url, null);
                },

                /**
                 * Cancels a child form that was shown as a result of a form action.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session.
                 *
                 * @param {String} modelInstanceId
                 * ID of the model instance that invoked the action.
                 *
                 * @param {String} actionName
                 * Name of the invoked action.
                 *
                 * @return {promise}
                 */
                cancelFormAction: function (formSessionId, modelInstanceId, actionName) {

                    var url = buildSvcBaseUrl(this, "cancelFormAction", formSessionId, modelInstanceId) +
                        "&actionId=" +
                        euc(actionName);

                    return doPost(this, url, null);

                },

                /**
                 * Server side notification that a close form request is being made.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session.
                 *
                 * @return {promise}
                 */
                notifyFormHidden: function (formSessionId) {

                    var url = buildSvcBaseUrl(this, "notifyFormHidden", formSessionId);

                    return doPost(this, url, null);
                },

                /**
                 * Server side notification that a close form request is being made.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session.
                 *
                 * @return {promise}
                 */
                notifyFormShown: function (formSessionId) {

                    var url = buildSvcBaseUrl(this, "notifyFormShown", formSessionId);

                    return doPost(this, url, null);
                },

                /**
                 * Selects a search list row to represent the value of the search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 *
                 * @param {String} start
                 * The starting row which is being requested.  Start + paging size number of rows should be returned.
                 *
                 * @return {promise}
                 */
                invokeCollectionPageChange: function (formSessionId, modelInstanceId, fieldName, start) {

                    var url = buildSvcBaseUrl(this, "invokeCollectionPageChange", formSessionId, modelInstanceId, fieldName) +
                        "&start=" + start;

                    return doPost(this, url, null);
                },

                /**
                 * Selects a search list row to represent the value of the search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 *
                 * @param {Object} selectionData
                 * The selection data to be sent to the server. Conforms to the CollectionSelectionModel contract.
                 *
                 * @return {promise}
                 */
                invokeCollectionSelectionUpdate: function (formSessionId, modelInstanceId, fieldName, selectionData) {

                    var url = buildSvcBaseUrl(this, "collectionSelectionUpdate", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, selectionData);
                },

                /**
                 * Selects a search list row to represent the value of the search field.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 *
                 * @param {String} actionName
                 * The grid field special action name.
                 *
                 * @return {promise}
                 */
                invokeCollectionSpecialAction: function (formSessionId, modelInstanceId, fieldName, actionName) {

                    var url = buildSvcBaseUrl(this, "invokeCollectionSpecialAction", formSessionId, modelInstanceId, fieldName) +
                        "&actionname=" + actionName;

                    return doPost(this, url, null);
                },

                /**
                 * Notifies the UIModel that a file has been selected in the file picker dialog.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldName
                 *
                 * @param {String} fileName
                 * The name of the newly selected file.
                 *
                 * @return {promise}
                 */
                invokeFileChanged: function (formSessionId, modelInstanceId, fieldName, fileName) {

                    var url = buildSvcBaseUrl(this, "selectFile", formSessionId, modelInstanceId, fieldName);

                    return doPost(this, url, fileName);
                },

                /**
                 * Cancels an action on the server.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the model and search field.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the model instance containing the search field.
                 *
                 * @param {String} fieldId
                 *
                 * @param {String} cancelId
                 * Uniquely identifies the running action on the server.
                 *
                 * @return {promise}
                 */
                cancelAction: function (formSessionId, modelInstanceId, fieldId, cancelId) {

                    var url = buildSvcBaseUrl(this, "cancelAction", formSessionId, modelInstanceId, fieldId) +
                        "&cancelId=" + euc(cancelId);

                    return doPost(this, url, null);
                },

                /**
                 */
                getFieldDataSourceUrl: function (formSessionId, modelInstanceId, fieldName) {
                    return buildSvcBaseUrl(this, "getFieldDataSource", formSessionId, modelInstanceId, fieldName);
                },

                /**
                 */
                getFieldDataSource: function (formSessionId, modelInstanceId, fieldName) {
                    var url = buildSvcBaseUrl(this, "getFieldDataSource", formSessionId, modelInstanceId, fieldName);
                    return doGet(this, url);
                },

                /**
                 */
                getFieldImageUrl: function (formSessionId, modelInstanceId, fieldName) {
                    return buildSvcBaseUrl(this, "getFieldImage", formSessionId, modelInstanceId, fieldName);
                },

                /**
                 */
                getFieldFileUrl: function (formSessionId, modelInstanceId, fieldName, options) {
                    var url;

                    url = buildSvcBaseUrl(this, "getFieldFile", formSessionId, modelInstanceId, fieldName);

                    if (options && options.fileName) {
                        url += "&fileName=" + euc(options.fileName);
                    }

                    return url;
                },

                /**
                 */
                getCustomFileUrl: function (formSessionId, modelInstanceId, key, fileName) {
                    var url;

                    url = buildSvcBaseUrl(this, "getCustomFile", formSessionId, modelInstanceId) +
                        "&key=" +
                        euc(key) +
                        "&fileName=" + euc(fileName);

                    return url;
                },

                /**
                 */
                getUploadFieldImageUrl: function (formSessionId, modelInstanceId, fieldName, thumbnailFieldName) {
                    var url;

                    url = buildSvcBaseUrl(this, "uploadFieldImage", formSessionId, modelInstanceId, fieldName);

                    if (thumbnailFieldName) {
                        url += "&thumbnailFieldId=" + euc(thumbnailFieldName);
                    }

                    return url;
                },

                /**
                 * Gets the upload url for a file field.
                 *
                 * @param {String} fieldName
                 * The name of the file field.
                 *
                 * @param {String} fileUploadKey
                 * A unique ID to identify this upload instance.
                 *
                 * @param {Boolean} useChunkingUrl
                 * Whether or not to return a base url that can be used for breaking up a file into multiple smaller uploads.
                 *
                 * @return {String}
                 */
                getUploadFieldFileUrl: function (fieldName, fileUploadKey, useChunkingUrl) {

                    var url;

                    useChunkingUrl = useChunkingUrl || false;

                    url = BBUI.urlConcat(this.baseUrl, "Upload/FileUpload.ashx?DBName=" +
                        euc(this.databaseName) +
                        "&FieldID=" +
                        euc(fieldName) +
                        "&FileUploadKey=" +
                        euc(fileUploadKey) +
                        (useChunkingUrl === true ? "" : "&InitialRequest=true"));

                    if (this.runAs) {
                        url += "&runAs=" + euc(this.runAs);
                    }

                    return url;
                },

                /**
                 */
                createSearchListAddFormSession: function (dataFormSessionId,
                    dataFormModelInstanceId,
                    dataFormFieldName,
                    searchFormSessionId,
                    searchModelInstanceId,
                    dataFormInstanceId) {

                    var url = buildSvcBaseUrl(this, "searchListAddFormInvoke", dataFormSessionId, dataFormModelInstanceId, dataFormFieldName) +
                        "&dataFormInstanceId=" + euc(dataFormInstanceId) +
                        "&searchFormSessionId=" + euc(searchFormSessionId) +
                        "&searchModelInstanceId=" + euc(searchModelInstanceId);

                    return doPost(this, url, null);
                },

                /**
                 */
                createSearchListActionAddFormSession: function (dataFormSessionId,
                    dataFormModelInstanceId,
                    dataFormActionName,
                    searchFormSessionId,
                    searchModelInstanceId,
                    dataFormInstanceId) {

                    var url = buildSvcBaseUrl(this, "actionSearchListAddFormInvoke", dataFormSessionId, dataFormModelInstanceId) +
                        "&actionId=" + euc(dataFormActionName) +
                        "&dataFormInstanceId=" + euc(dataFormInstanceId) +
                        "&searchFormSessionId=" + euc(searchFormSessionId) +
                        "&searchModelInstanceId=" + euc(searchModelInstanceId);

                    return doPost(this, url, null);
                },

                /**
                 */
                confirmSearchListAddForm: function (formSessionId,
                    modelInstanceId,
                    fieldName,
                    confirmFormSessionId,
                    ignoreConcurrency) {

                    var url = buildSvcBaseUrl(this, "searchListAddFormConfirm", formSessionId, modelInstanceId, fieldName) +
                        "&confirmFormSessionId=" + euc(confirmFormSessionId) +
                        "&ignoreConcurrency=" + euc(ignoreConcurrency);

                    return doPost(this, url, null);
                },

                /**
                 */
                confirmSearchListActionAddForm: function (formSessionId,
                    modelInstanceId,
                    actionName,
                    confirmFormSessionId,
                    ignoreConcurrency) {

                    var url = buildSvcBaseUrl(this, "actionSearchListAddFormConfirm", formSessionId, modelInstanceId) +
                        "&actionId=" + euc(actionName) +
                        "&confirmFormSessionId=" + euc(confirmFormSessionId) +
                        "&ignoreConcurrency=" + euc(ignoreConcurrency);

                    return doPost(this, url, null);
                },

                /**
                 */
                confirmSearchListAddQuery: function (formSessionId, modelInstanceId, fieldName, queryInstanceId, selectionId) {
                    var url = buildSvcBaseUrl(this, "searchListAddQueryConfirm", formSessionId, modelInstanceId) +
                        "&fieldId=" +
                        euc(fieldName) +
                        "&queryInstanceId=" +
                        euc(queryInstanceId) +
                        "&selectionId=" +
                        euc(selectionId);

                    return doPost(this, url, null);
                },

                /**
                 */
                confirmQueryAction: function (formSessionId, modelInstanceId, actionName, queryInstanceId, selectionId, queryType) {
                    var url = buildSvcBaseUrl(this, "confirmQueryAction", formSessionId, modelInstanceId) +
                        "&actionId=" +
                        euc(actionName) +
                        "&queryInstanceId=" +
                        euc(queryInstanceId) +
                        "&selectionId=" +
                        euc(selectionId) +
                        "&queryType=" +
                        euc(queryType);

                    return doPost(this, url, null);
                },

                /**
                 */
                confirmSearchListAddExportDefinition: function (formSessionId, modelInstanceId, fieldName, exportDefinitionId) {
                    var url = buildSvcBaseUrl(this, "searchListAddExportDefinitionConfirm", formSessionId, modelInstanceId) +
                        "&fieldId=" +
                        euc(fieldName) +
                        "&exportDefinitionId=" +
                        euc(exportDefinitionId);

                    return doPost(this, url, null);
                },

                /**
                 */
                confirmExportDefinitionAction: function (formSessionId, modelInstanceId, actionName, exportDefinitionId) {
                    var url = buildSvcBaseUrl(this, "confirmExportDefinitionAction", formSessionId, modelInstanceId) +
                        "&actionId=" +
                        euc(actionName) +
                        "&exportDefinitionId=" +
                        euc(exportDefinitionId);

                    return doPost(this, url, null);
                },

                /**
                 * Resets the values in the form instance.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the form instance.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the form model.
                 *
                 * @return {promise}
                 */
                resetFormSession: function (formSessionId, modelInstanceId) {

                    var url = buildSvcBaseUrl(this, "resetFormSession", formSessionId, modelInstanceId);

                    return doPost(this, url, null);
                },

                /**
                 * Refreshes the form with the latest data.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the form instance.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the form model.
                 *
                 * @return {promise}
                 */
                refreshFormSession: function (formSessionId, modelInstanceId) {

                    var url = buildSvcBaseUrl(this, "refreshFormSession", formSessionId, modelInstanceId);

                    return doPost(this, url, null);
                },

                /**
                 * Notifies the server that a duplicate record has been selected in the context of a form session instead of creating a new record.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session that contains the form instance.
                 *
                 * @param {String} modelInstanceId
                 * The ID of the form model.
                 *
                 * @param {String} recordId
                 * The ID of the duplicate record.
                 *
                 * @return {promise}
                 */
                selectDuplicateRecord: function (formSessionId, modelInstanceId, recordId) {

                    var url = buildSvcBaseUrl(this, "selectDuplicateRecord", formSessionId, modelInstanceId) +
                        "&selectedRecordId=" + euc(recordId);

                    return doPost(this, url, null);
                },

                /**
                 * Starts a business process on the server with the information contained in the form session.
                 *
                 * @param {String} businessProcessId
                 * The ID of the business process to start.
                 *
                 * @param {String} parameterSetId
                 * The ID of the parameter set for the business process.
                 *
                 * @param {String} dataFormItemKey
                 * The key of the data form item stored on the server.
                 *
                 * @param {Object} [options]
                 * An object literal that may contain any of the following properties:
                 *
                 * @param {String} [options.businessProcessStatusId]
                 *
                 * @param {Object} [options.values]
                 *
                 * @return {promise}
                 */
                startBusinessProcess: function (businessProcessId, parameterSetId, dataFormItemKey, options) {

                    var url,
                        data,
                        businessProcessStatusId;

                    options = options || {};

                    businessProcessStatusId = options.businessProcessStatusId;

                    url = this.buildStartBusinessProcessUrl(businessProcessId, parameterSetId, dataFormItemKey, businessProcessStatusId);

                    if (!dataFormItemKey && options.values) {
                        data = {
                            values: options.values
                        };
                    }

                    return doPost(this, url, data);
                },

                /**
                 */
                selectDuplicateRecordAction: function (formSessionId, modelInstanceId, actionName, duplicateFormSessionId, recordId) {
                    var url = buildSvcBaseUrl(this, "selectDuplicateRecordAction", formSessionId, modelInstanceId) +
                        "&duplicateFormSessionId=" + euc(duplicateFormSessionId) +
                        "&actionId=" + euc(actionName) +
                        "&selectedRecordId=" + euc(recordId);

                    return doPost(this, url, null);
                },

                /**
                 */
                invokeRelationshipMapNodeAction: function (formSessionId, modelInstanceId, fieldId, nodeId, actionName) {
                    var url = buildSvcBaseUrl(this, "relationshipMapNodeInvokeAction", formSessionId, modelInstanceId, fieldId) +
                        "&nodeId=" + euc(nodeId) +
                        "&actionName=" + euc(actionName);

                    return doPost(this, url, null);
                },

                /**
                 */
                buildReportHostUrl: function (reportId, options) {
                    var url;

                    url = BBUI.urlConcat(this.baseUrl, "uimodel/ReportHost.aspx?databaseName=") +
                        euc(this.databaseName) +
                        "&reportId=" +
                        euc(reportId);

                    options = options || {};

                    if (options.historyId) {
                        url += "&historyId=" + euc(options.historyId);
                    }

                    if (options.formSessionId) {
                        url += "&formSessionId=" + euc(options.formSessionId);
                    }

                    if (options.modelInstanceId) {
                        url += "&modelInstanceId=" + euc(options.modelInstanceId);
                    }

                    if (BBUI.is(options.showToolbar)) {
                        url += "&showToolbar=" + euc(options.showToolbar);
                    }

                    if (BBUI.is(options.runAs)) {
                        url += "&runAs=" + euc(options.runAs);
                    }

                    if (options.showParameterPrompts) {
                        url += "&showParameterPrompts=true";
                    }

                    if (options.showPromptAreaButton) {
                        url += "&showPromptAreaButton=true";
                    }

                    if (options.displayPromptArea) {
                        url += "&displayPromptArea=" + euc(options.displayPromptArea);
                    }

                    url += BBUI.arrayToQueryString(options.parameters, "p_", true);

                    return url;
                },

                /**
                 * Performs validation on a form session.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session to validate.
                 *
                 * @return {promise}
                 */
                validateFormSession: function (formSessionId) {

                    var url;

                    url = buildSvcBaseUrl(this, "validateformsession", formSessionId);

                    return doPost(this, url, null);
                },

                /**
                 */
                removeFromQueue: function (formSessionId, modelInstanceId, options) {
                    var i,
                        n,
                        event,
                        eventQueue,
                        queue;

                    if (!this._formSessionQueue) {
                        return;
                    }

                    queue = this._formSessionQueue[formSessionId];

                    if (queue && queue.eventQueue && queue.eventQueue.length) {
                        eventQueue = queue.eventQueue;
                        for (i = 0, n = eventQueue.length; i < n; ++i) {
                            // find the url connection string in this entity, and attempt match. It is always at [2]
                            event = eventQueue[i][2].toLowerCase();

                            if (!(options.action && event.indexOf(options.action.toLowerCase()) === -1) &&
                                    !(options.fieldName && event.indexOf(options.fieldName.toLowerCase()) === -1)) {
                                eventQueue.splice(i, 1);
                                break;
                            }
                        }
                    }
                },

                /**
                 * returns dataform item for a given form session and model instance.
                 *
                 * @param {String} formSessionId
                 * The ID of the form session to validate.
                 *
                 * @param {String} modelInstanceId
                 *
                 * @return {promise}
                 */
                getFormSessionDataFormItemXml: function (formSessionId, modelInstanceId) {

                    var url = buildSvcBaseUrl(this, "getFormSessionDataFormItemXml", formSessionId, modelInstanceId);

                    return doGet(this, url);
                },

                /**
                 */
                reportActionFormSaved: function (formSessionId, modelInstanceId, actionName) {

                    var url = buildSvcBaseUrl(this, "reportActionFormSaved", formSessionId, modelInstanceId) +
                        "&actionId=" + euc(actionName);

                    return doPost(this, url, null);
                },

                /**
                 */
                clearParameterDetail: function (formSessionId, modelInstanceId, parameterDetailName) {
                    var url;

                    url = buildSvcBaseUrl(this, "clearParameterDetail") +
                        "&formSessionId=" + euc(formSessionId) +
                        "&modelInstanceId=" + euc(modelInstanceId) +
                        "&parameterDetailName=" + euc(parameterDetailName);

                    return doPost(this, url, null);
                },

                /**
                 */
                cancelAsyncOperation: function (cancelId) {

                    var url = BBUI.urlConcat(this.baseUrl, "uimodel/UIModelingCancelAsyncOperation.ashx?databaseName=") +
                        euc(this.databaseName) +
                        "&cancelId=" +
                        euc(cancelId);

                    return doGet(this, url);
                }
            };

            /**
             * @class bbui.uimodelingservice.bbuiUIModelingService
             *
             */
            return {
                /**
                 * Create an instance of the UIModeling service.
                 *
                 * @param {String} [baseUrl=bbuiUIModelingServiceConfig.baseUrl]
                 *
                 * @param {String} [databaseName=bbuiUIModelingServiceConfig.databaseName]
                 *
                 * @param {Object} [options]
                 *
                 * @param {Object} options.runAs
                 *
                 * @param {Object} options.onRequestBegin
                 *
                 * @param {Object} options.onRequestEnd
                 *
                 * @param {Object} options.httpHeaders
                 *
                 * @param {Object} options.useEventQueue
                 *
                 * @return {bbui.uimodelingservice.bbuiUIModelingService.Service}
                 * @return {Object} return.http
                 * $http TODO this property is referenced via `$http`, not `http`. Need to get docs to render properly.
                 */
                create: function (baseUrl, databaseName, options) {
                    var svc;

                    baseUrl = baseUrl || bbuiUIModelingServiceConfig.baseUrl;
                    databaseName = databaseName || bbuiUIModelingServiceConfig.databaseName;

                    if (baseUrl === null || !databaseName) {
                        throw new Error('You must either provide a baseUrl and databaseName as parameters or set them globally using bbuiShellServiceConfig.');
                    }

                    svc = new Service(baseUrl, databaseName, options);
                    svc.$http = $http;

                    return svc;
                }
            };
        }]);

}(this));

//# sourceMappingURL=bbui.js.map