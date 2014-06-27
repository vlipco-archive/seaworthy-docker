(function() {
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

}).call(this);
