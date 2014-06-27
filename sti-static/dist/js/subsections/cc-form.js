(function() {
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

}).call(this);
