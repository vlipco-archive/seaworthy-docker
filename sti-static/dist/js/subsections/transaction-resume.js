(function() {
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
