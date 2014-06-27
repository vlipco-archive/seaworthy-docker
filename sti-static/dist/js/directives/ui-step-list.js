(function() {
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

}).call(this);
