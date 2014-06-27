(function() {
  angular.module('app').directive('debitPayment', [
    'nextSection', 'txnResource', function(nextSection, txnResource) {
      return {
        restrict: 'E',
        templateUrl: 'subsections/debit-payment',
        link: function($scope, $element, $attrs) {
          $scope.isBankValid = function() {
            return !_.isUndefined($scope.transaction.data_attributes.bank_code);
          };
          $scope.debitPayment = function() {
            $scope.showErrors = true;
            if ($scope.debitForm.$valid && $scope.isBankValid()) {
              $scope.transaction.status = "PROCESSING";
              return $scope.nextSection($scope.transaction.step, $scope.transaction);
            }
          };
          $scope.showBankErrorTooltip = function() {
            return $scope.showErrors && !$scope.isBankValid();
          };
          $scope.chosen_hack = function(evt) {
            return $(evt.target).trigger("chosen:updated");
          };
          if ($scope.transaction.payment_method === "ACCOUNT_DEBIT") {
            $scope.$parent.pay = $scope.debitPayment;
            $scope.transaction.data_attributes = {};
            $scope.transaction.data_attributes.person_type = "0";
            $scope.transaction.data_attributes.person_id_type = "CC";
            $scope.document_types = [
              {
                code: "CC",
                name: "Cédula de Ciudadanía",
                selected: true
              }, {
                code: "CE",
                name: "Cédula de Extranjería"
              }, {
                code: "NIT",
                name: "NIT"
              }, {
                code: "TI",
                name: "Tarjeta de Identidad"
              }, {
                code: "PP",
                name: "Pasaporte"
              }, {
                code: "IDC",
                name: "Identificador único de cliente"
              }, {
                code: "CEL",
                name: "Número de Celular"
              }, {
                code: "RC",
                name: "Registro Cívil"
              }, {
                code: "DE",
                name: "Identificación Extranjera"
              }
            ];
            $scope.person_types = [
              {
                code: "0",
                name: "Persona Natural",
                selected: true
              }, {
                code: "1",
                name: "Persona Jurídica"
              }
            ];
            return _.defer(function() {
              $("#select-ach-banks").chosen().change($scope.chosen_hack);
              $("#person_id_type").chosen({
                disable_search_threshold: 100
              }).change($scope.chosen_hack);
              return $("#person_type").chosen({
                disable_search_threshold: 100
              }).change($scope.chosen_hack);
            });
          }
        }
      };
    }
  ]);

}).call(this);
