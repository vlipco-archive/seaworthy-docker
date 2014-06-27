(function() {
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

}).call(this);
