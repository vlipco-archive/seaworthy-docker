(function() {
  angular.module('app').filter('franchiseFromCc', function() {
    return function(ccNumber) {
      var franchise, franchise_first_word;
      if (_.isUndefined(ccNumber) || _.isNull(ccNumber)) {
        return '';
      } else {
        franchise = Stripe.cardType(ccNumber.substr(0, 4) + "0000 0000 0000");
        franchise_first_word = franchise.toLowerCase().split(" ")[0];
        if (franchise_first_word === "american") {
          return "amex";
        } else {
          return franchise_first_word;
        }
      }
    };
  });

  angular.module('app').filter('printableCC', [
    '$filter', function($filter) {
      return function(ccNumber) {
        if (_.isUndefined(ccNumber) || _.isNull(ccNumber)) {
          return '';
        } else {
          return "" + ($filter('franchiseFromCc')(ccNumber)) + "-" + (ccNumber.substr(0, 4));
        }
      };
    }
  ]);

}).call(this);
