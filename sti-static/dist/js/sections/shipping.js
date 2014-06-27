(function() {
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

}).call(this);
