(function() {
  angular.module("app").constant("ENV", function() {
    return {
      name: "TEST",
      prefill_transaction: true,
      animations: false
    };
  });

}).call(this);
