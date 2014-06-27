(function() {
  angular.module('app', ['appServices', 'calculationServices', 'templates']);

  angular.element(document).ready(function() {
    var bootstrap;
    return bootstrap = function(data) {
      return window.checkout_data_transaction = data;
    };
  });

  $("#app_modal").on("closeModal", function() {
    var transaction;
    $("#app_modal").addClass("closing");
    transaction = {};
    return _.delay(function() {
      return parent.postMessage('vlipco:checkout:finished', '*');
    }, 1000);
  });

}).call(this);
