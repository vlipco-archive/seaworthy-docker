(function() {
  var appServices,
    __slice = [].slice;

  appServices = angular.module('appServices', ['ngResource']);

  appServices.factory('txnResource', [
    '$resource', function($resource) {
      return $resource("https://payments.staging.vlipco.co/v1/transactions/:number", {}, {
        create: {
          method: 'POST'
        },
        update: {
          method: 'PUT'
        }
      });
    }
  ]);

  appServices.factory('apiTokenizer', [
    '$resource', function($resource) {
      return $resource("https://tokenizer.staging.vlipco.co/tokens", {}, {
        tokenize: {
          method: 'POST'
        }
      });
    }
  ]);

  appServices.factory('apiBankList', [
    '$resource', function($resource) {
      return $resource("https://payments.staging.vlipco.co/v1/pse/banks", {});
    }
  ]);

  appServices.factory("stepList", function() {
    return function(current, transaction) {
      var steps;
      steps = ["intro", "shipping", "credit", "payment", "confirmation"];
      if (transaction.payment_method === "ACCOUNT_DEBIT") {
        steps = _.without(steps, "credit");
      }
      if (transaction.shipping === false) {
        steps = _.without(steps, "shipping");
      }
      transaction.steps = steps;
      return steps;
    };
  });

  appServices.factory("preloadBankList", [
    'apiBankList', '$rootScope', '$timeout', function(apiBankList, $rootScope, $timeout) {
      var preload;
      return preload = (function(_this) {
        return function() {
          var tries, _tries;
          _tries = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          tries = _tries[0] || 0;
          if (_.isUndefined($rootScope.bankList)) {
            if (tries < 3) {
              return $timeout(function() {
                var data;
                return data = apiBankList.get(function() {
                  $rootScope.bankList = data.banks;
                  if (_.isUndefined($rootScope.bankList)) {
                    return preload(tries + 1);
                  } else {
                    return $rootScope.$broadcast("XHR_FINISHED: bankList loaded");
                  }
                });
              });
            } else {

            }
          }
        };
      })(this);
    }
  ]);

  appServices.factory("nextSection", [
    '$location', 'stepList', 'txnResource', 'preloadBankList', '$rootScope', 'pollPaymentLink', 'resetTransactionRequest', function($location, stepList, txnResource, preloadBankList, $rootScope, pollPaymentLink, resetTransactionRequest) {

      /*
      	1. constants that represent sections. Intro=intro
      	2. list of steps by type of transaction
       */
      return function() {
        return {
          changeSection: function() {
            var currentStep, goBack, nextStep, transaction, _direction;
            currentStep = arguments[0], transaction = arguments[1], _direction = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
            goBack = _direction[0] === "backward";
            nextStep = this.nextStep(currentStep, transaction, goBack);
            if (currentStep === 'intro') {
              resetTransactionRequest();
              if (transaction.payment_method === "ACCOUNT_DEBIT") {
                preloadBankList();
              }
            }
            if (!goBack) {
              $rootScope.xhr_loading = true;
              this.updateBackend(transaction, currentStep);
            } else {
              $location.path(nextStep);
            }
            $rootScope.$on("XHR_FINISHED: " + currentStep, (function(_this) {
              return function() {
                return _this.xhr_finished(currentStep, nextStep, transaction.payment_method);
              };
            })(this));
            return nextStep;
          },
          xhr_finished: function(currentStep, nextStep, payment_method) {
            if (nextStep === 'payment' && payment_method === "ACCOUNT_DEBIT" && _.isUndefined($rootScope.bankList)) {
              return $rootScope.$on("XHR_FINISHED: bankList loaded", function() {
                $rootScope.xhr_loading = false;
                return $location.path(nextStep);
              });
            } else if (currentStep === 'payment') {
              return pollPaymentLink().request();
            } else {
              $rootScope.xhr_loading = false;
              return $location.path(nextStep);
            }
          },
          nextStep: function(currentStep, transaction, goBack) {
            var currentIndex, nextStep, nextStepIndex, steps;
            steps = stepList(currentStep, transaction);
            nextStepIndex = "";
            currentIndex = _.indexOf(steps, currentStep);
            if ((currentIndex === 0 && goBack) || (currentIndex === steps.length && !goBack)) {
              nextStepIndex = currentIndex;
            } else {
              if (goBack) {
                nextStepIndex = currentIndex - 1;
              } else {
                nextStepIndex = currentIndex + 1;
              }
            }
            return nextStep = steps[nextStepIndex];
          },
          updateBackend: function(transaction, currentStep) {
            var data;
            if (_.isUndefined($rootScope.txn_token)) {
              return data = txnResource.create(transaction, (function(_this) {
                return function() {
                  $rootScope.txn_token = data.transaction.token;
                  transaction.number = data.transaction.number;
                  return $rootScope.$broadcast("XHR_FINISHED: " + currentStep);
                };
              })(this));
            } else {
              return txnResource.update({
                number: transaction.number
              }, transaction, (function(_this) {
                return function() {
                  return $rootScope.$broadcast("XHR_FINISHED: " + currentStep);
                };
              })(this));
            }
          }
        };
      };
    }
  ]);

  appServices.factory('pollPaymentLink', [
    'txnResource', '$rootScope', '$timeout', '$location', (function(_this) {
      return function(txnResource, $rootScope, $timeout, $location) {
        return function() {
          return {
            times: 0,
            private_request: function() {
              if (this.times < 10) {
                return $timeout((function(_this) {
                  return function() {
                    var data;
                    _this.times = _this.times + 1;
                    return data = txnResource.get({
                      number: $rootScope.transaction.number
                    }, function() {
                      $rootScope.xhr_loading = false;
                      switch (data.transaction.status) {
                        case "PENDING":
                          $rootScope.xhr_loading = true;
                          if (data.transaction.payment_link != null) {
                            return top.window.location.href = data.transaction.payment_link;
                          } else {
                            return _this.request();
                          }
                          break;
                        case "DENIED":
                          $rootScope.transaction.error = data.transaction.localized_upstream_code;
                          return $location.path("/error");
                        case "ERROR":
                          $rootScope.transaction.error = data.transaction.localized_upstream_code;
                          return $location.path("/error");
                        case "APPROVED":
                          return $location.path("/confirmation");
                      }
                    });
                  };
                })(this));
              } else {

              }
            },
            request: function() {
              if (_.isUndefined(this.throttled_request)) {
                this.throttled_request = _.throttle(this.private_request, 7500);
              }
              return this.throttled_request();
            }
          };
        };
      };
    })(this)
  ]);

  appServices.factory('resetTransactionRequest', [
    '$rootScope', (function(_this) {
      return function($rootScope) {
        return function() {
          if (!_.isUndefined($rootScope.transaction)) {
            delete $rootScope.transaction.data_attributes;
            delete $rootScope.transaction.status;
            return delete $rootScope.transaction.error;
          }
        };
      };
    })(this)
  ]);

}).call(this);
