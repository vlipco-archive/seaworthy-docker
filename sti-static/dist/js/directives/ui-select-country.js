(function() {
  angular.module('app').directive('selectCountry', [
    'countries', function(countries) {
      return {
        restrict: 'E',
        scope: {
          innerModel: '=',
          disabled: '='
        },
        link: function($scope, $element, $attrs) {
          window.uiSelectCountryScope = $scope;
          $scope.innerModel = "CO";
          $scope.country_codes = _.keys(countries);
          return _.defer(function() {
            return $("#ui-select-country").chosen().change(function(evt) {
              return $(evt.target).trigger("chosen:updated");
            });
          });
        },
        templateUrl: 'directives/ui-select-country'
      };
    }
  ]);

}).call(this);
