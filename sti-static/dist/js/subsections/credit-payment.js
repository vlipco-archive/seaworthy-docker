(function() {
  angular.module('app').directive('creditPayment', [
    'nextSection', 'txnResource', function(nextSection, txnResource) {
      return {
        restrict: 'E',
        templateUrl: 'subsections/credit-payment',
        link: function($scope, $element, $attrs) {
          var billing_address, shipping_address, ta;
          $scope.creditPayment = function() {
            $scope.transaction.status = "PROCESSING";
            $scope.nextSection($scope.transaction.step, $scope.transaction);
            debugger;
          };
          $scope.objectify_address = (function(_this) {
            return function(address) {
              return {
                address: "" + address.line1 + " " + address.line2,
                city: address.city,
                state: address.state,
                country: address.country,
                name: address.name
              };
            };
          })(this);
          ta = $scope.transaction;
          if (ta.payment_method === "CREDIT_CARD" && !_.isUndefined(ta)) {
            $scope.$parent.pay = $scope.creditPayment;
            billing_address = ta.billing_address_attributes;
            shipping_address = ta.shipping_address_attributes;
            $scope.dd = {};
            $scope.dd.cc = ta.data_attributes.number;
            $scope.dd.cc_name = ta.data_attributes.name;
            $scope.dd.expiration_date = "" + ta.data_attributes.exp_month + "/20" + ta.data_attributes.exp_year;
            $scope.dd.email = ta.notification_email;
            $scope.dd.phone = ta.buyer_attributes.telephone;
            $scope.dd.billing = $scope.objectify_address(billing_address);
            if (!_.isUndefined(shipping_address)) {
              return $scope.dd.shipping = $scope.objectify_address(shipping_address);
            }
          }
        }
      };
    }
  ]);

}).call(this);
