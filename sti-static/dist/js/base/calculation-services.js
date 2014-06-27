(function() {
  var aC,
    __slice = [].slice;

  aC = angular.module('calculationServices', []);

  aC.constant('defaultTaxRate', 0.16);

  aC.factory("getPriceBeforeTaxes", [
    'getTransactionRate', function(getTransactionRate) {
      return function() {
        var priceAfterTaxes, _taxRate;
        priceAfterTaxes = arguments[0], _taxRate = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return priceAfterTaxes / (1 + getTransactionRate(_taxRate));
      };
    }
  ]);

  aC.factory("getTaxValue", [
    'getTransactionRate', 'getPriceBeforeTaxes', function(getTransactionRate, getPriceBeforeTaxes) {
      return function() {
        var priceAfterTaxes, _taxRate;
        priceAfterTaxes = arguments[0], _taxRate = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return priceAfterTaxes - getPriceBeforeTaxes(priceAfterTaxes, _taxRate);
      };
    }
  ]);

  aC.factory("isAValidRate", function() {
    return function(taxRate) {
      if (!_.isUndefined(taxRate)) {
        if (_.isNumber(parseFloat(taxRate))) {
          taxRate = parseFloat(taxRate);
        }
        if (!_.isNumber(taxRate)) {
          throw Error("calculationServices::getPriceBeforeTaxes: taxRate must be a number but received " + taxRate);
        } else {
          if (taxRate < 0 || taxRate >= 1) {
            throw Error("calculationServices::getPriceBeforeTaxes: taxRate must be between 0 and 1.");
          } else {
            return true;
          }
        }
      }
      return false;
    };
  });

  aC.factory("getTransactionRate", [
    'defaultTaxRate', 'isAValidRate', function(defaultTaxRate, isAValidRate) {
      return function(_taxRate) {
        if (isAValidRate(_taxRate[0])) {
          return parseFloat(_taxRate[0]);
        }
        return defaultTaxRate;
      };
    }
  ]);

  aC.factory("calculateCartTotal", function() {
    return function(cart) {
      return _.reduce(cart, function(memo, current) {
        return memo += current.quantity * current.unit_price_cents;
      }, 0);
    };
  });

  aC.factory("calculateCartTotalTaxBase", [
    'getPriceBeforeTaxes', function(getPriceBeforeTaxes) {
      return function(cart) {
        return _.reduce(cart, function(memo, current) {
          var result;
          result = getPriceBeforeTaxes(current.unit_price_cents, current.tax_rate);
          return memo += current.quantity * getPriceBeforeTaxes(current.unit_price_cents, current.tax_rate);
        }, 0);
      };
    }
  ]);

  aC.factory("calculateCartTotalTaxes", [
    'getTaxValue', function(getTaxValue) {
      return function(cart) {
        return _.reduce(cart, function(memo, current) {
          var result;
          result = getTaxValue(current.unit_price_cents, current.tax_rate);
          return memo += current.quantity * getTaxValue(current.unit_price_cents, current.tax_rate);
        }, 0);
      };
    }
  ]);

  aC.filter("centsToUnits", function() {
    return function(input) {
      return parseInt(input, 10) / 100;
    };
  });

}).call(this);
