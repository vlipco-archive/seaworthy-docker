(function() {
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

}).call(this);
