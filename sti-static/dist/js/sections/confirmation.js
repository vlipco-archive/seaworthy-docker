(function() {
  angular.module('app').controller('ConfirmationCtrl', [
    '$scope', '$route', 'txnResource', function($scope, $route, txnResource) {
      $scope.transaction.step = 'confirmation';
      return $scope.transaction.approbationNumber = Math.floor(Math.random() * 100000000);
    }
  ]);

}).call(this);
