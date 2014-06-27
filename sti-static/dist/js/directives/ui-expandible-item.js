(function() {
  angular.module('app').directive('expandibleItem', (function(_this) {
    return function() {
      return {
        restrict: 'E',
        link: function($scope, $element, $attrs) {
          window.scop = $scope;
          $scope.$attrs = $attrs;
          return $scope.toggle = function() {
            if (!$scope.item.visibility) {
              return $scope.item.visibility = true;
            } else {
              return $scope.item.visibility = !$scope.item.visibility;
            }
          };
        },
        templateUrl: 'directives/ui-expandible-item'
      };
    };
  })(this));

}).call(this);
