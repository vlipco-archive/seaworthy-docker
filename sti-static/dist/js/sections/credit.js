(function() {
  angular.module('app').controller('CreditCtrl', [
    '$scope', 'nextSection', 'txnResource', 'apiTokenizer', '$filter', function($scope, nextSection, txnResource, apiTokenizer, $filter) {
      window.scope = $scope;
      $scope.transaction.step = 'credit';
      $scope.showErrors = false;
      $scope.tokenize = function() {
        var result;
        return result = apiTokenizer.tokenize({
          cc: $scope.transaction.data_attributes.number
        }, (function(_this) {
          return function() {
            $scope.$root.isCcObfuscated = true;
            $scope.transaction.data_attributes.token = result.token;
            $scope.transaction.data_attributes.number = $filter('printableCC')($scope.transaction.data_attributes.number);
            return $scope.nextSection($scope.transaction.step, $scope.transaction);
          };
        })(this));
      };
      $scope.isValid = function() {
        var isAddressFormValid, isCcFormValid, useDefaultAddress, wasAddressFormTouched;
        isCcFormValid = !$("#ccForm").hasClass("ng-invalid");
        wasAddressFormTouched = $("#uiAddress").not(".ng-pristine").length;
        isAddressFormValid = $("#uiAddress.ng-valid").length;
        useDefaultAddress = $("#usingDefaultAddress").prop("checked");
        if (isCcFormValid) {
          if (useDefaultAddress && !wasAddressFormTouched) {
            return true;
          } else if (isAddressFormValid) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      return $scope.goToNextSection = function() {
        var isValid;
        isValid = $scope.isValid();
        if (isValid) {
          if (!$scope.transaction.data_attributes.token) {
            return $scope.tokenize();
          } else {
            return $scope.nextSection($scope.transaction.step, $scope.transaction);
          }
        } else {
          return $scope.showErrors = true;
        }
      };
    }
  ]);

}).call(this);
