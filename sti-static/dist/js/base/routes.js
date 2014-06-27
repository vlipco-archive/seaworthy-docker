(function() {
  angular.module('app').config([
    '$routeProvider', '$provide', '$httpProvider', function($routeProvider, $provide, $httpProvider) {
      $routeProvider.when("/intro", {
        templateUrl: "sections/intro",
        controller: "IntroCtrl"
      });
      $routeProvider.when("/shipping", {
        templateUrl: "sections/shipping",
        controller: "ShippingCtrl"
      });
      $routeProvider.when("/credit", {
        templateUrl: "sections/credit",
        controller: "CreditCtrl"
      });
      $routeProvider.when("/payment", {
        templateUrl: "sections/payment",
        controller: "PaymentCtrl"
      });
      $routeProvider.when("/confirmation", {
        templateUrl: "sections/confirmation",
        controller: "ConfirmationCtrl"
      });
      $routeProvider.when("/error", {
        templateUrl: "sections/error",
        controller: "ErrorCtrl"
      });
      $routeProvider.otherwise({
        redirectTo: "/intro"
      });
      $provide.factory("tokenInjector", [
        '$rootScope', (function(_this) {
          return function($rootScope) {
            return {
              'request': function(request) {
                if (request.url.match(/payments.staging.vlipco.co/)) {
                  if (request.method !== "GET") {
                    if (_.isUndefined($rootScope.txn_token)) {
                      request.headers["X-Auth-Token"] = "pub_test_demo";
                    } else {
                      request.headers["X-Auth-Token"] = $rootScope.txn_token;
                    }
                  }
                }
                return request;
              }
            };
          };
        })(this)
      ]);
      return $httpProvider.interceptors.push('tokenInjector');
    }
  ]);

}).call(this);
