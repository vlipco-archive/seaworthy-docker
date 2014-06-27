(function() {
  angular.module('app').run([
    '$rootScope', 'nextSection', 'fakeCreditTransaction', 'preFillCartInfo', function($rootScope, nextSection, fakeCreditTransaction, preFillCartInfo) {
      var prefillTransaction;
      prefillTransaction = false;
      if (_.isUndefined(window.jasmine) && !prefillTransaction) {
        $rootScope.transaction = preFillCartInfo(window.checkout_data_transaction);
      } else {
        $rootScope.transaction = preFillCartInfo(fakeCreditTransaction());
      }
      $rootScope.nextSection = function(current) {
        return nextSection().changeSection(current, $rootScope.transaction);
      };
      $rootScope.goBack = function(current) {
        return nextSection().changeSection(current, $rootScope.transaction, "backward");
      };
      $rootScope.shouldErrorTooltipBeVisible = function(fieldSelector, showErrors) {
        return $(fieldSelector).hasClass('ng-invalid') && showErrors;
      };
      return window.rootScope = $rootScope;
    }
  ]);

  angular.module('app').factory('preFillCartInfo', [
    'calculateCartTotalTaxBase', 'calculateCartTotal', 'calculateCartTotalTaxes', (function(_this) {
      return function(calculateCartTotalTaxBase, calculateCartTotal, calculateCartTotalTaxes) {
        return function(transaction) {
          transaction.amount_cents = parseInt(calculateCartTotal(transaction.items), 10);
          transaction.vat_taxable_income_cents = parseInt(calculateCartTotalTaxBase(transaction.items), 10);
          transaction.vat_cents = parseInt(calculateCartTotalTaxes(transaction.items), 10);
          return transaction;
        };
      };
    })(this)
  ]);

}).call(this);
