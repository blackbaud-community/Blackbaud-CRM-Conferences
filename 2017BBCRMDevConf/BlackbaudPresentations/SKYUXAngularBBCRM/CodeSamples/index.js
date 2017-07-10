(function () {
  'use strict';

  angular.module('skytutorial', ['sky', 'bbui']);
  
 var WebShellLoginUrl = "http://CHS6TONYKNO02.blackbaud.global/CRMSPDEV/webui/WebShellLogin.aspx?databaseName=BBInfinity"

    angular
        .module("skytutorial", ["bbui", "sky"])
        .config(authInterceptorConfig)
        .config(appConfig);
    
    authInterceptorConfig.$inject = ["$httpProvider"];

    function authInterceptorConfig($httpProvider) {
        $httpProvider.interceptors.push(["$q", function ($q) {
            return {
                "responseError": function (response) {
                    var redirectUrl,
                        status = response.status,
                        FORMS_AUTH_HEADER = "X-BB-FormsAuth",
                        authHeader = response.headers(FORMS_AUTH_HEADER);

                    if (status === 401 || status === 404) {
                        redirectUrl = WebShellLoginUrl + "&url=" + encodeURI(location.href);
                        
                        if (authHeader) {
                            redirectUrl += "&status=" + encodeURI(authHeader);
                        }
                        
                        location.replace(redirectUrl);
                    }

                    return $q.reject(response);
                }
            };
        }]);
    }
    
    appConfig.$inject = ["$httpProvider", "bbuiShellServiceConfig"];

    function appConfig($httpProvider, bbuiShellServiceConfig) {
        bbuiShellServiceConfig.baseUrl = "http://CHS6TONYKNO02.blackbaud.global/CRMSPDEV"
        bbuiShellServiceConfig.databaseName = "BBInfinity";
	    $httpProvider.defaults.withCredentials = true;
    }

  angular.module('skytutorial')
    .factory('bbAuth', ['bbuiShellService', 'bbuiShellServiceConfig', function (bbuiShellService, bbuiShellServiceConfig) {

        var authenticateSuccessCallback,
            authenticateFailureCallback,
            authenticateFinallyCallback,
            svc,
            FORMS_AUTH_HEADER = "X-BB-FormsAuth";

        function getWebShellLoginUrl(databaseName, status) {

            var url,
                redirectUrl = window.location.href;

            url = bbuiShellServiceConfig.baseUrl + "/webui/WebShellLogin.aspx?databaseName=" + euc(databaseName);

            url += "&url=" + euc(redirectUrl);

            if (status) {
                url += "&status=" + euc(status);
            }

            return url;
        }

        function sessionStartSuccess(reply) {
            authenticateSuccessCallback(reply.data);
            authenticateFinallyCallback();
        }

        function sessionStartFailure(data, status, headers) {

            var redirectUrl;

            // Unathorized (401)
            // NotFound (404) implies WSFederation Authenticated but unable to match to AppUser
            if ((status === 401) || (status === 404)) {

                redirectUrl = getWebShellLoginUrl(svc.databaseName, headers(FORMS_AUTH_HEADER));
                window.location.replace(redirectUrl);
                authenticateFinallyCallback();
                // Don't call failure callback because we're just redirecting anyway.
            } else {
                if (!data || !data.message) {
                    data = {
                        message: data
                    };
                }
                authenticateFailureCallback(data);
                authenticateFinallyCallback();
            }

        }

        function startSession() {

            // Need to save HTTP object since we need to do both .then and .error,
            // which are not supported together.
            var http = svc.sessionStart();

            http.then(sessionStartSuccess);

            http.error(sessionStartFailure);

        }

        function authenticateAsync(successCallback, failureCallback, finallyCallback) {

            authenticateSuccessCallback = successCallback || function () { };
            authenticateFailureCallback = failureCallback || function () { };
            authenticateFinallyCallback = finallyCallback || function () { };

            var httpHeaders = {};

            // Add a custom HTTP header to all requests so the server will send back a 401 response without a challenge
            // header when the user logs in unsuccessfully.  This will keep the user from being prompted for credentials
            // by the browser.
            httpHeaders[FORMS_AUTH_HEADER] = "true";

            svc = bbuiShellService.create(null, null, {
                httpHeaders: httpHeaders
            });

            startSession();

        }

        return {
            authenticateAsync: authenticateAsync
        };

    }]);



angular.module('skytutorial')
    .controller('MainController', ['bbAuth', 'bbWait', '$scope', function (bbAuth, bbWait, $scope) {

        bbWait.beginPageWait();

        bbAuth.authenticateAsync(function (sessionInfo) {
            // Authentication success!
            $scope.sessionInfo = sessionInfo;
        }, function (error) {
            // Authentication failure :(
            alert("Something went wrong!");
            console.error(JSON.stringify(error));
        }, function () {
            // Finally
            bbWait.endPageWait();
        });

    }]);

}());