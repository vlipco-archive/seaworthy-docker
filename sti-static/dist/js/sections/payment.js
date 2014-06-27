(function() {
  angular.module('app').controller('PaymentCtrl', [
    '$scope', 'nextSection', 'txnResource', function($scope, nextSection, txnResource) {
      $scope.transaction.step = "payment";
      return window.payment_scope = $scope;
    }
  ]);

}).call(this);
