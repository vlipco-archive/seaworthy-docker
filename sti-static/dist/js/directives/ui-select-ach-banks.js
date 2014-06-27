(function() {
  angular.module('app').directive('selectAchBanks', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'E',
        scope: {
          innerModel: '='
        },
        link: function($scope, $element, $attrs) {
          $scope.$attrs = $attrs;
          $scope.bankList = $rootScope.bankList;
          return $($element).attr("ng-model", $attrs.ngModel);
        },
        templateUrl: 'directives/ui-select-ach-banks'
      };
    }
  ]);

}).call(this);
