(function() {
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

}).call(this);
