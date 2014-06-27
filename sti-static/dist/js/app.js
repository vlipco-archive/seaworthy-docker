(function() {
  var aC, appServices, lp,
    __slice = [].slice;

  angular.module('app', ['appServices', 'calculationServices', 'templates']);

  angular.element(document).ready(function() {
    var bootstrap;
    return bootstrap = function(data) {
      return window.checkout_data_transaction = data;
    };
  });

  $("#app_modal").on("closeModal", function() {
    var transaction;
    $("#app_modal").addClass("closing");
    transaction = {};
    return _.delay(function() {
      return parent.postMessage('vlipco:checkout:finished', '*');
    }, 1000);
  });

  aC = angular.module('calculationServices', []);

  aC.constant('defaultTaxRate', 0.16);

  aC.factory("getPriceBeforeTaxes", [
    'getTransactionRate', function(getTransactionRate) {
      return function() {
        var priceAfterTaxes, _taxRate;
        priceAfterTaxes = arguments[0], _taxRate = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return priceAfterTaxes / (1 + getTransactionRate(_taxRate));
      };
    }
  ]);

  aC.factory("getTaxValue", [
    'getTransactionRate', 'getPriceBeforeTaxes', function(getTransactionRate, getPriceBeforeTaxes) {
      return function() {
        var priceAfterTaxes, _taxRate;
        priceAfterTaxes = arguments[0], _taxRate = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return priceAfterTaxes - getPriceBeforeTaxes(priceAfterTaxes, _taxRate);
      };
    }
  ]);

  aC.factory("isAValidRate", function() {
    return function(taxRate) {
      if (!_.isUndefined(taxRate)) {
        if (_.isNumber(parseFloat(taxRate))) {
          taxRate = parseFloat(taxRate);
        }
        if (!_.isNumber(taxRate)) {
          throw Error("calculationServices::getPriceBeforeTaxes: taxRate must be a number but received " + taxRate);
        } else {
          if (taxRate < 0 || taxRate >= 1) {
            throw Error("calculationServices::getPriceBeforeTaxes: taxRate must be between 0 and 1.");
          } else {
            return true;
          }
        }
      }
      return false;
    };
  });

  aC.factory("getTransactionRate", [
    'defaultTaxRate', 'isAValidRate', function(defaultTaxRate, isAValidRate) {
      return function(_taxRate) {
        if (isAValidRate(_taxRate[0])) {
          return parseFloat(_taxRate[0]);
        }
        return defaultTaxRate;
      };
    }
  ]);

  aC.factory("calculateCartTotal", function() {
    return function(cart) {
      return _.reduce(cart, function(memo, current) {
        return memo += current.quantity * current.unit_price_cents;
      }, 0);
    };
  });

  aC.factory("calculateCartTotalTaxBase", [
    'getPriceBeforeTaxes', function(getPriceBeforeTaxes) {
      return function(cart) {
        return _.reduce(cart, function(memo, current) {
          var result;
          result = getPriceBeforeTaxes(current.unit_price_cents, current.tax_rate);
          return memo += current.quantity * getPriceBeforeTaxes(current.unit_price_cents, current.tax_rate);
        }, 0);
      };
    }
  ]);

  aC.factory("calculateCartTotalTaxes", [
    'getTaxValue', function(getTaxValue) {
      return function(cart) {
        return _.reduce(cart, function(memo, current) {
          var result;
          result = getTaxValue(current.unit_price_cents, current.tax_rate);
          return memo += current.quantity * getTaxValue(current.unit_price_cents, current.tax_rate);
        }, 0);
      };
    }
  ]);

  aC.filter("centsToUnits", function() {
    return function(input) {
      return parseInt(input, 10) / 100;
    };
  });

  angular.module('app').filter('franchiseFromCc', function() {
    return function(ccNumber) {
      var franchise, franchise_first_word;
      if (_.isUndefined(ccNumber) || _.isNull(ccNumber)) {
        return '';
      } else {
        franchise = Stripe.cardType(ccNumber.substr(0, 4) + "0000 0000 0000");
        franchise_first_word = franchise.toLowerCase().split(" ")[0];
        if (franchise_first_word === "american") {
          return "amex";
        } else {
          return franchise_first_word;
        }
      }
    };
  });

  angular.module('app').filter('printableCC', [
    '$filter', function($filter) {
      return function(ccNumber) {
        if (_.isUndefined(ccNumber) || _.isNull(ccNumber)) {
          return '';
        } else {
          return "" + ($filter('franchiseFromCc')(ccNumber)) + "-" + (ccNumber.substr(0, 4));
        }
      };
    }
  ]);

  angular.module('app').constant('countries', {
    "AF": "Afganist\u00e1n",
    "AL": "Albania",
    "DE": "Alemania",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguila",
    "AG": "Antigua y Barbuda",
    "AN": "Antillas Neerlandesas",
    "AQ": "Ant\u00e1rtida",
    "SA": "Arabia Saud\u00ed",
    "DZ": "Argelia",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaiy\u00e1n",
    "BS": "Bahamas",
    "BH": "Bahr\u00e9in",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BZ": "Belice",
    "BJ": "Ben\u00edn",
    "BM": "Bermudas",
    "BY": "Bielorrusia",
    "BO": "Bolivia",
    "BQ": "Bonaire, San Eustaquio y Saba",
    "BA": "Bosnia-Herzegovina",
    "BW": "Botsuana",
    "BR": "Brasil",
    "BN": "Brun\u00e9i",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "BT": "But\u00e1n",
    "BE": "B\u00e9lgica",
    "CV": "Cabo Verde",
    "CW": "Curaçao",
    "KH": "Camboya",
    "CM": "Camer\u00fan",
    "CA": "Canad\u00e1",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CY": "Chipre",
    "VA": "Ciudad del Vaticano",
    "CO": "Colombia",
    "KM": "Comoras",
    "CG": "Congo",
    "KP": "Corea del Norte",
    "KR": "Corea del Sur",
    "CR": "Costa Rica",
    "CI": "Costa de Marfil",
    "HR": "Croacia",
    "CU": "Cuba",
    "DK": "Dinamarca",
    "DM": "Dominica",
    "EC": "Ecuador",
    "EG": "Egipto",
    "SV": "El Salvador",
    "AE": "Emiratos \u00c1rabes Unidos",
    "ER": "Eritrea",
    "SK": "Eslovaquia",
    "SI": "Eslovenia",
    "ES": "Espa\u00f1a",
    "US": "Estados Unidos",
    "EE": "Estonia",
    "ET": "Etiop\u00eda",
    "PH": "Filipinas",
    "FI": "Finlandia",
    "FJ": "Fiyi",
    "FR": "Francia",
    "GA": "Gab\u00f3n",
    "GM": "Gambia",
    "GE": "Georgia",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GD": "Granada",
    "GR": "Grecia",
    "GL": "Groenlandia",
    "GP": "Guadalupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GF": "Guayana Francesa",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GQ": "Guinea Ecuatorial",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Hait\u00ed",
    "HN": "Honduras",
    "HU": "Hungr\u00eda",
    "IN": "India",
    "ID": "Indonesia",
    "IQ": "Iraq",
    "IE": "Irlanda",
    "IR": "Ir\u00e1n",
    "BV": "Isla Bouvet",
    "CX": "Isla Christmas",
    "NU": "Isla Niue",
    "NF": "Isla Norfolk",
    "IM": "Isla de Man",
    "IS": "Islandia",
    "KY": "Islas Caim\u00e1n",
    "CC": "Islas Cocos",
    "CK": "Islas Cook",
    "FO": "Islas Feroe",
    "GS": "Islas Georgia del Sur y Sandwich del Sur",
    "HM": "Islas Heard y McDonald",
    "FK": "Islas Malvinas",
    "MP": "Islas Marianas del Norte",
    "MH": "Islas Marshall",
    "SB": "Islas Salom\u00f3n",
    "TC": "Islas Turcas y Caicos",
    "VG": "Islas V\u00edrgenes Brit\u00e1nicas",
    "VI": "Islas V\u00edrgenes de los Estados Unidos",
    "UM": "Islas menores alejadas de los Estados Unidos",
    "AX": "Islas \u00c5land",
    "IL": "Israel",
    "IT": "Italia",
    "JM": "Jamaica",
    "JP": "Jap\u00f3n",
    "JE": "Jersey",
    "JO": "Jordania",
    "KZ": "Kazajist\u00e1n",
    "KE": "Kenia",
    "KG": "Kirguist\u00e1n",
    "KI": "Kiribati",
    "KW": "Kuwait",
    "LA": "Laos",
    "LS": "Lesoto",
    "LV": "Letonia",
    "LR": "Liberia",
    "LY": "Libia",
    "LI": "Liechtenstein",
    "LT": "Lituania",
    "LU": "Luxemburgo",
    "LB": "L\u00edbano",
    "MK": "Macedonia",
    "MG": "Madagascar",
    "MY": "Malasia",
    "MW": "Malaui",
    "MV": "Maldivas",
    "ML": "Mali",
    "MT": "Malta",
    "MA": "Marruecos",
    "MQ": "Martinica",
    "MU": "Mauricio",
    "MR": "Mauritania",
    "YT": "Mayotte",
    "FM": "Micronesia",
    "MD": "Moldavia",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "MX": "M\u00e9xico",
    "MC": "M\u00f3naco",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NI": "Nicaragua",
    "NG": "Nigeria",
    "NO": "Noruega",
    "NC": "Nueva Caledonia",
    "NZ": "Nueva Zelanda",
    "NE": "N\u00edger",
    "OM": "Om\u00e1n",
    "PK": "Pakist\u00e1n",
    "PW": "Palau",
    "PS": "Palestina",
    "PA": "Panam\u00e1",
    "PG": "Pap\u00faa Nueva Guinea",
    "PY": "Paraguay",
    "NL": "Pa\u00edses Bajos",
    "PE": "Per\u00fa",
    "PN": "Pitcairn",
    "PF": "Polinesia Francesa",
    "PL": "Polonia",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "HK": "Regi\u00f3n Administrativa Especial de Hong Kong de la Rep\u00fablica Popular China",
    "MO": "Regi\u00f3n Administrativa Especial de Macao de la Rep\u00fablica Popular China",
    "ZZ": "Regi\u00f3n desconocida o no v\u00e1lida",
    "GB": "Reino Unido",
    "CF": "Rep\u00fablica Centroafricana",
    "CZ": "Rep\u00fablica Checa",
    "CD": "Rep\u00fablica Democr\u00e1tica del Congo",
    "DO": "Rep\u00fablica Dominicana",
    "RE": "Reuni\u00f3n",
    "RW": "Ruanda",
    "RO": "Ruman\u00eda",
    "RU": "Rusia",
    "WS": "Samoa",
    "AS": "Samoa Americana",
    "BL": "San Bartolom\u00e9",
    "KN": "San Crist\u00f3bal y Nieves",
    "SM": "San Marino",
    "MF": "San Mart\u00edn",
    "PM": "San Pedro y Miquel\u00f3n",
    "VC": "San Vicente y las Granadinas",
    "SH": "Santa Elena",
    "LC": "Santa Luc\u00eda",
    "ST": "Santo Tom\u00e9 y Pr\u00edncipe",
    "SN": "Senegal",
    "RS": "Serbia",
    "CS": "Serbia y Montenegro",
    "SC": "Seychelles",
    "SL": "Sierra Leona",
    "SG": "Singapur",
    "SY": "Siria",
    "SO": "Somalia",
    "LK": "Sri Lanka",
    "SZ": "Suazilandia",
    "ZA": "Sud\u00e1frica",
    "SD": "Sud\u00e1n",
    "SS": "Sud\u00e1n del Sur",
    "SE": "Suecia",
    "CH": "Suiza",
    "SR": "Surinam",
    "SJ": "Svalbard y Jan Mayen",
    "EH": "S\u00e1hara Occidental",
    "TH": "Tailandia",
    "TW": "Taiw\u00e1n",
    "TZ": "Tanzania",
    "TJ": "Tayikist\u00e1n",
    "IO": "Territorio Brit\u00e1nico del Oc\u00e9ano \u00cdndico",
    "TF": "Territorios Australes Franceses",
    "TL": "Timor Oriental",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad y Tobago",
    "TM": "Turkmenist\u00e1n",
    "TR": "Turqu\u00eda",
    "TV": "Tuvalu",
    "TN": "T\u00fanez",
    "UA": "Ucrania",
    "UG": "Uganda",
    "UY": "Uruguay",
    "UZ": "Uzbekist\u00e1n",
    "VU": "Vanuatu",
    "VE": "Venezuela",
    "VN": "Vietnam",
    "WF": "Wallis y Futuna",
    "YE": "Yemen",
    "DJ": "Yibuti",
    "ZM": "Zambia",
    "ZW": "Zimbabue"
  });

  angular.module('app').filter('code2country', [
    'countries', (function(_this) {
      return function(countries) {
        return function(input) {
          var country;
          country = countries[input];
          if (_.isUndefined(country)) {
            throw new Error("No country with code: " + input);
          }
          return country;
        };
      };
    })(this)
  ]);

  lp = angular.module('vlLongPoll', []);

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

  angular.module('app').run([
    '$rootScope', 'nextSection', 'fakeCreditTransaction', 'preFillCartInfo', function($rootScope, nextSection, fakeCreditTransaction, preFillCartInfo) {
      var prefillTransaction;
      prefillTransaction = false;
      if (_.isUndefined(window.jasmine) && !prefillTransaction) {
        $rootScope.transaction = preFillCartInfo(window.checkout_data_transaction);
      } else {
        $rootScope.transaction = preFillCartInfo(fakeCreditTransaction());
      }
      $rootScope.nextSection = function(current) {
        return nextSection().changeSection(current, $rootScope.transaction);
      };
      $rootScope.goBack = function(current) {
        return nextSection().changeSection(current, $rootScope.transaction, "backward");
      };
      $rootScope.shouldErrorTooltipBeVisible = function(fieldSelector, showErrors) {
        return $(fieldSelector).hasClass('ng-invalid') && showErrors;
      };
      return window.rootScope = $rootScope;
    }
  ]);

  angular.module('app').factory('preFillCartInfo', [
    'calculateCartTotalTaxBase', 'calculateCartTotal', 'calculateCartTotalTaxes', (function(_this) {
      return function(calculateCartTotalTaxBase, calculateCartTotal, calculateCartTotalTaxes) {
        return function(transaction) {
          transaction.amount_cents = parseInt(calculateCartTotal(transaction.items), 10);
          transaction.vat_taxable_income_cents = parseInt(calculateCartTotalTaxBase(transaction.items), 10);
          transaction.vat_cents = parseInt(calculateCartTotalTaxes(transaction.items), 10);
          return transaction;
        };
      };
    })(this)
  ]);

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

  angular.module("app").constant("ENV", function() {
    var name, prefill_transaction;
    name = "DEV";
    return prefill_transaction = true;
  });

  angular.module("app").constant("ENV", function() {
    var api_root, name, prefill_transaction;
    api_root = "";
    name = "PRODUCTION";
    return prefill_transaction = true;
  });

  angular.module("app").constant("ENV", function() {
    return {
      name: "TEST",
      prefill_transaction: true,
      animations: false
    };
  });

  angular.module('app').directive('uiAddress', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'E',
        scope: {
          innerModel: '=',
          defaultAddress: '=',
          showErrors: '='
        },
        link: function($scope, $element, $attrs) {
          if ($scope.innerModel == null) {
            $scope.innerModel = {};
          }
          $scope.userEnteredAddress = {};
          window.ascope = $scope;
          $scope.shouldErrorTooltipBeVisible = $rootScope.shouldErrorTooltipBeVisible;
          $scope.$attrs = $attrs;
          $scope.$watch((function(_this) {
            return function() {
              return $rootScope.xhr_loading;
            };
          })(this), (function(_this) {
            return function(newVal, oldVal) {
              return $scope.xhr_loading = newVal;
            };
          })(this));
          $scope.init = function() {
            if (_.isUndefined($scope.defaultAddress)) {
              return $scope.usingDefaultAddress = false;
            } else {
              $scope.usingDefaultAddress = true;
              $scope.setPrefilledValues();
              return $scope.disableCountry();
            }
          };
          $scope.updateAddress = function(selector) {
            if (!$scope.usingDefaultAddress) {
              $scope.userEnteredAddress = _.clone($scope.innerModel);
            }
            return _.defer((function(_this) {
              return function() {
                if ($scope.usingDefaultAddress) {
                  $scope.setPrefilledValues();
                  $scope.disableCountry();
                } else {
                  $scope.setEnteredValues();
                  $scope.enableCountry();
                }
                return $scope.$apply();
              };
            })(this));
          };
          $scope.disableCountry = function() {
            return $(".disabledIfUsingDefaultAddress").attr("disabled", "disabled");
          };
          $scope.enableCountry = function() {
            return $(".disabledIfUsingDefaultAddress").removeAttr("disabled");
          };
          $scope.showZipCode = function() {
            if (!(_.isUndefined($scope.innerModel))) {
              if (!(_.isUndefined($scope.innerModel.country))) {
                if (!($scope.innerModel.country === "CO")) {
                  return true;
                }
                return false;
              }
              return true;
            }
            return true;
          };
          $scope.setPrefilledValues = function() {
            $scope.innerModel = _.clone($scope.defaultAddress);
            _.defaults($scope.innerModel, {
              country: "CO"
            });
            return $scope.refreshCountry();
          };
          $scope.setEnteredValues = function() {
            $scope.innerModel = _.clone($scope.userEnteredAddress);
            _.defaults($scope.innerModel, {
              country: "CO"
            });
            return $scope.refreshCountry();
          };
          $scope.refreshCountry = function() {
            return _.defer(function() {
              return $("#ui-select-country").trigger("chosen:updated");
            });
          };
          return $scope.init();
        },
        templateUrl: 'directives/ui-address'
      };
    }
  ]);

  angular.module('app').directive('uiCreditCard', [
    '$rootScope', '$filter', '$compile', '$templateCache', function($rootScope, $filter, $compile, $templateCache) {
      return {
        restrict: 'E',
        require: 'ngModel',
        compile: function($element, $attrs) {
          $element.children("input").attr("ng-model", $attrs.ngModel);
          return function($scope, $element, $attrs, ngModel) {
            window.cc_scope = $scope;
            $scope.validate = (function(_this) {
              return function(value) {
                var isValid;
                isValid = Stripe.card.validateCardNumber(value) || $scope.$root.isCcObfuscated;
                ngModel.$setValidity('luhnCheck', isValid);
                return isValid;
              };
            })(this);
            $scope.parse = (function(_this) {
              return function(value) {
                var isValid;
                isValid = $scope.validate(value);
                if ($scope.$root.isCcObfuscated) {
                  $scope.franchise = value.split("-")[0].toLowerCase();
                } else {
                  $scope.franchise = $filter('franchiseFromCc')(value);
                }
                if (isValid) {
                  return value;
                } else {
                  return void 0;
                }
              };
            })(this);
            ngModel.$render = (function(_this) {
              return function() {
                return $scope.parse(ngModel.$viewValue);
              };
            })(this);
            return ngModel.$formatters.push((function(_this) {
              return function(value) {
                var isValid;
                isValid = $scope.validate(value);
                return value;
              };
            })(this));
          };
        },
        templateUrl: 'directives/ui-credit-card'
      };
    }
  ]);

  angular.module('app').directive('expandibleItem', (function(_this) {
    return function() {
      return {
        restrict: 'E',
        link: function($scope, $element, $attrs) {
          window.scop = $scope;
          $scope.$attrs = $attrs;
          return $scope.toggle = function() {
            if (!$scope.item.visibility) {
              return $scope.item.visibility = true;
            } else {
              return $scope.item.visibility = !$scope.item.visibility;
            }
          };
        },
        templateUrl: 'directives/ui-expandible-item'
      };
    };
  })(this));

  angular.module('app').directive('selectAchBanks', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'E',
        scope: {
          innerModel: '='
        },
        link: function($scope, $element, $attrs) {
          $scope.$attrs = $attrs;
          $scope.bankList = $rootScope.bankList;
          return $($element).attr("ng-model", $attrs.ngModel);
        },
        templateUrl: 'directives/ui-select-ach-banks'
      };
    }
  ]);

  angular.module('app').directive('selectCountry', [
    'countries', function(countries) {
      return {
        restrict: 'E',
        scope: {
          innerModel: '=',
          disabled: '='
        },
        link: function($scope, $element, $attrs) {
          window.uiSelectCountryScope = $scope;
          $scope.innerModel = "CO";
          $scope.country_codes = _.keys(countries);
          return _.defer(function() {
            return $("#ui-select-country").chosen().change(function(evt) {
              return $(evt.target).trigger("chosen:updated");
            });
          });
        },
        templateUrl: 'directives/ui-select-country'
      };
    }
  ]);

  angular.module('app').directive('stepList', function() {
    return {
      restrict: 'E',
      link: (function(_this) {
        return function($scope, $element, $attrs) {
          $scope.$attrs = $attrs;
          $scope.titles = {
            intro: 'Datos del Comprador',
            payment: 'Pago',
            credit: 'Datos de la tarjeta',
            confirmation: 'Confirmación',
            shipping: 'Dirección de envio'
          };
          $scope.$on('transaction.steps::changed', function() {
            if (!(_.isUndefined($scope.transaction))) {
              if (!(_.isUndefined($scope.transaction.steps))) {
                return $scope.printable = true;
              }
            }
          });
          $scope.getStepTitle = function(step) {
            if ($scope.printable) {
              return $scope.titles[step];
            }
          };
          $scope.getNextStepTitle = function(step) {
            var nextStepIndex, nextStepKey;
            if ($scope.printable) {
              nextStepIndex = _.indexOf($scope.transaction.steps, step) + 1;
              if (nextStepIndex >= $scope.transaction.steps.length) {
                return "";
              } else {
                nextStepKey = $scope.transaction.steps[nextStepIndex];
                return $scope.getStepTitle(nextStepKey);
              }
            }
          };
          $scope.getNumberOfSteps = function() {
            if ($scope.printable) {
              return $scope.transaction.steps.length;
            }
          };
          return $scope.getStepNumber = function(step) {
            if ($scope.printable) {
              return _.indexOf($scope.transaction.steps, step) + 1;
            }
          };
        };
      })(this),
      templateUrl: 'directives/ui-step-list'
    };
  });

  angular.module('app').controller('ConfirmationCtrl', [
    '$scope', '$route', 'txnResource', function($scope, $route, txnResource) {
      $scope.transaction.step = 'confirmation';
      return $scope.transaction.approbationNumber = Math.floor(Math.random() * 100000000);
    }
  ]);

  angular.module('app').controller('CreditCtrl', [
    '$scope', 'nextSection', 'txnResource', 'apiTokenizer', '$filter', function($scope, nextSection, txnResource, apiTokenizer, $filter) {
      window.scope = $scope;
      $scope.transaction.step = 'credit';
      $scope.showErrors = false;
      $scope.tokenize = function() {
        var result;
        return result = apiTokenizer.tokenize({
          cc: $scope.transaction.data_attributes.number
        }, (function(_this) {
          return function() {
            $scope.$root.isCcObfuscated = true;
            $scope.transaction.data_attributes.token = result.token;
            $scope.transaction.data_attributes.number = $filter('printableCC')($scope.transaction.data_attributes.number);
            return $scope.nextSection($scope.transaction.step, $scope.transaction);
          };
        })(this));
      };
      $scope.isValid = function() {
        var isAddressFormValid, isCcFormValid, useDefaultAddress, wasAddressFormTouched;
        isCcFormValid = !$("#ccForm").hasClass("ng-invalid");
        wasAddressFormTouched = $("#uiAddress").not(".ng-pristine").length;
        isAddressFormValid = $("#uiAddress.ng-valid").length;
        useDefaultAddress = $("#usingDefaultAddress").prop("checked");
        if (isCcFormValid) {
          if (useDefaultAddress && !wasAddressFormTouched) {
            return true;
          } else if (isAddressFormValid) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      return $scope.goToNextSection = function() {
        var isValid;
        isValid = $scope.isValid();
        if (isValid) {
          if (!$scope.transaction.data_attributes.token) {
            return $scope.tokenize();
          } else {
            return $scope.nextSection($scope.transaction.step, $scope.transaction);
          }
        } else {
          return $scope.showErrors = true;
        }
      };
    }
  ]);

  angular.module('app').controller('ErrorCtrl', [
    '$scope', '$rootScope', '$location', 'txnResource', 'resetTransactionRequest', function($scope, $rootScope, $location, txnResource, resetTransactionRequest) {
      $scope.error_msg = $rootScope.transaction.error;
      $scope.use_another_bank = (function(_this) {
        return function() {
          var data;
          $rootScope.xhr_loading = true;
          resetTransactionRequest();
          return data = txnResource.create($rootScope.transaction, function() {
            transaction.number = data.transaction.number;
            $rootScope.txn_token = data.transaction.token;
            $rootScope.xhr_loading = false;
            return $location.path("/payment");
          });
        };
      })(this);
      return $scope.use_credit_card = (function(_this) {
        return function() {
          resetTransactionRequest();
          return $location.path("/intro");
        };
      })(this);
    }
  ]);

  angular.module('app').controller('IntroCtrl', [
    '$scope', '$rootScope', 'nextSection', 'txnResource', '$templateCache', function($scope, $rootScope, nextSection, txnResource, $templateCache) {
      $rootScope.transaction.step = 'intro';
      $scope.$templateCache = $templateCache;
      window.scope = $scope;
      $scope.showErrors = false;
      $scope.goToNextSection = function(payment_method) {
        var phoneIsNumeric;
        $scope.showErrors = true;
        phoneIsNumeric = parseInt($("#phone").val(), 10);
        if (_.isNaN(phoneIsNumeric && $("#phone").val().length > 5)) {
          $("#phone").addClass("ng-invalid");
          phoneIsNumeric = false;
        } else {
          $("#phone").removeClass("ng-invalid");
        }
        if ($scope.buyersForm.$valid && phoneIsNumeric) {
          $scope.nextSection($scope.transaction.step, $rootScope.transaction);
          return $rootScope.$broadcast('transaction.steps::changed');
        }
      };
      return $scope.setPaymentMethod = (function(_this) {
        return function(method) {
          return $rootScope.transaction.payment_method = method;
        };
      })(this);
    }
  ]);

  angular.module('app').controller('PaymentCtrl', [
    '$scope', 'nextSection', 'txnResource', function($scope, nextSection, txnResource) {
      $scope.transaction.step = "payment";
      return window.payment_scope = $scope;
    }
  ]);

  angular.module('app').controller('ShippingCtrl', [
    '$scope', '$rootScope', 'txnResource', function($scope, $rootScope, txnResource) {
      window.scope = $scope;
      $scope.transaction.step = 'shipping';
      $scope.showErrors = false;
      $rootScope.$broadcast('transaction.steps::changed');
      return $scope.goToNextSection = function() {
        $scope.showErrors = true;
        if (($("#uiAddress.ng-valid").not("ng-pristine").length)) {
          return $scope.nextSection($scope.transaction.step, $scope.transaction);
        }
      };
    }
  ]);

  angular.module('app').directive('ccForm', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'E',
        scope: {
          innerModel: '=',
          showErrors: '=',
          name: '='
        },
        link: function($scope, $element, $attrs) {
          if ($scope.innerModel == null) {
            $scope.innerModel = {};
          }
          $scope.shouldErrorTooltipBeVisible = $rootScope.shouldErrorTooltipBeVisible;
          $scope.$attrs = $attrs;
          $scope.checkExpirationDateValidity = function() {
            var month, year;
            if (_.isUndefined($scope.innerModel.exp_month || _.isUndefined($scope.innerModel.exp_year))) {
              return false;
            } else {
              month = $scope.innerModel.exp_month;
              year = "20" + $scope.innerModel.exp_year;
              return Stripe.validateExpiry(month, year);
            }
          };
          $scope.checkCvv2Validity = function() {
            return Stripe.validateCVC($scope.innerModel.cvv2);
          };
          return $scope.$watch("$scope.innerModel.exp_month", $scope.checkExpirationDateValidity);
        },
        templateUrl: 'subsections/cc-form'
      };
    }
  ]);

  angular.module('app').directive('creditPayment', [
    'nextSection', 'txnResource', function(nextSection, txnResource) {
      return {
        restrict: 'E',
        templateUrl: 'subsections/credit-payment',
        link: function($scope, $element, $attrs) {
          var billing_address, shipping_address, ta;
          $scope.creditPayment = function() {
            $scope.transaction.status = "PROCESSING";
            $scope.nextSection($scope.transaction.step, $scope.transaction);
            debugger;
          };
          $scope.objectify_address = (function(_this) {
            return function(address) {
              return {
                address: "" + address.line1 + " " + address.line2,
                city: address.city,
                state: address.state,
                country: address.country,
                name: address.name
              };
            };
          })(this);
          ta = $scope.transaction;
          if (ta.payment_method === "CREDIT_CARD" && !_.isUndefined(ta)) {
            $scope.$parent.pay = $scope.creditPayment;
            billing_address = ta.billing_address_attributes;
            shipping_address = ta.shipping_address_attributes;
            $scope.dd = {};
            $scope.dd.cc = ta.data_attributes.number;
            $scope.dd.cc_name = ta.data_attributes.name;
            $scope.dd.expiration_date = "" + ta.data_attributes.exp_month + "/20" + ta.data_attributes.exp_year;
            $scope.dd.email = ta.notification_email;
            $scope.dd.phone = ta.buyer_attributes.telephone;
            $scope.dd.billing = $scope.objectify_address(billing_address);
            if (!_.isUndefined(shipping_address)) {
              return $scope.dd.shipping = $scope.objectify_address(shipping_address);
            }
          }
        }
      };
    }
  ]);

  angular.module('app').directive('debitPayment', [
    'nextSection', 'txnResource', function(nextSection, txnResource) {
      return {
        restrict: 'E',
        templateUrl: 'subsections/debit-payment',
        link: function($scope, $element, $attrs) {
          $scope.isBankValid = function() {
            return !_.isUndefined($scope.transaction.data_attributes.bank_code);
          };
          $scope.debitPayment = function() {
            $scope.showErrors = true;
            if ($scope.debitForm.$valid && $scope.isBankValid()) {
              $scope.transaction.status = "PROCESSING";
              return $scope.nextSection($scope.transaction.step, $scope.transaction);
            }
          };
          $scope.showBankErrorTooltip = function() {
            return $scope.showErrors && !$scope.isBankValid();
          };
          $scope.chosen_hack = function(evt) {
            return $(evt.target).trigger("chosen:updated");
          };
          if ($scope.transaction.payment_method === "ACCOUNT_DEBIT") {
            $scope.$parent.pay = $scope.debitPayment;
            $scope.transaction.data_attributes = {};
            $scope.transaction.data_attributes.person_type = "0";
            $scope.transaction.data_attributes.person_id_type = "CC";
            $scope.document_types = [
              {
                code: "CC",
                name: "Cédula de Ciudadanía",
                selected: true
              }, {
                code: "CE",
                name: "Cédula de Extranjería"
              }, {
                code: "NIT",
                name: "NIT"
              }, {
                code: "TI",
                name: "Tarjeta de Identidad"
              }, {
                code: "PP",
                name: "Pasaporte"
              }, {
                code: "IDC",
                name: "Identificador único de cliente"
              }, {
                code: "CEL",
                name: "Número de Celular"
              }, {
                code: "RC",
                name: "Registro Cívil"
              }, {
                code: "DE",
                name: "Identificación Extranjera"
              }
            ];
            $scope.person_types = [
              {
                code: "0",
                name: "Persona Natural",
                selected: true
              }, {
                code: "1",
                name: "Persona Jurídica"
              }
            ];
            return _.defer(function() {
              $("#select-ach-banks").chosen().change($scope.chosen_hack);
              $("#person_id_type").chosen({
                disable_search_threshold: 100
              }).change($scope.chosen_hack);
              return $("#person_type").chosen({
                disable_search_threshold: 100
              }).change($scope.chosen_hack);
            });
          }
        }
      };
    }
  ]);

  angular.module('app').directive('transactionResume', function() {
    return {
      restrict: 'E',
      link: function($scope, $element, $attrs) {
        $($element).attr("ng-model", $attrs.ngModel);
        return window.transaction = $scope.transaction;
      },
      templateUrl: 'subsections/transaction-resume'
    };
  });

}).call(this);
