(function() {
  beforeEach(module('calculationServices'));

  describe("calculationServices", function() {
    return describe("#getPriceBeforeTaxes", function() {
      it("should return a value when receives one argument", inject(function(getPriceBeforeTaxes) {
        var value;
        value = getPriceBeforeTaxes(116);
        expect(value).not.toBeNull();
        return expect(value).not.toBeUndefined();
      }));
      it("should return a value when receives two arguments", inject(function(getPriceBeforeTaxes) {
        var value;
        value = getPriceBeforeTaxes(116);
        expect(value).not.toBeNull();
        return expect(value).not.toBeUndefined();
      }));
      it("should calculate the price correctly with a custom taxRate", inject(function(getPriceBeforeTaxes) {
        var priceBeforeTaxes;
        priceBeforeTaxes = getPriceBeforeTaxes(118, 0.18);
        return expect(priceBeforeTaxes).toBe(100);
      }));
      it("should calculate the price correctly with a taxRate of 0", inject(function(getPriceBeforeTaxes) {
        var priceBeforeTaxes;
        priceBeforeTaxes = getPriceBeforeTaxes(100, 0);
        return expect(priceBeforeTaxes).toBe(100);
      }));
      it("should use the 'defaultTaxRate' constant as the default taxRate", inject(function(getPriceBeforeTaxes, defaultTaxRate) {
        var priceBeforeTaxes1, priceBeforeTaxes2;
        priceBeforeTaxes1 = getPriceBeforeTaxes(100, defaultTaxRate);
        priceBeforeTaxes2 = getPriceBeforeTaxes(100);
        console.log(defaultTaxRate);
        return expect(priceBeforeTaxes1).toEqual(priceBeforeTaxes2);
      }));
      xit("should throw an error if the custom taxRate isn't a number", inject(function(getPriceBeforeTaxes) {
        var wrongTaxRate;
        wrongTaxRate = "lol";
        return expect(function() {
          return getPriceBeforeTaxes(100, wrongTaxRate);
        }).toThrow(new Error("calculationServices::getPriceBeforeTaxes: taxRate must be a number but received " + wrongTaxRate));
      }));
      return xit("should throw an error if the custom taxRate isn't between 0 and 1", inject(function(getPriceBeforeTaxes) {
        var wrongTaxRate;
        wrongTaxRate = 2.0;
        return expect(function() {
          return getPriceBeforeTaxes(100, wrongTaxRate);
        }).toThrow(new Error("calculationServices::getPriceBeforeTaxes: taxRate must be between 0 and 1."));
      }));
    });
  });

}).call(this);
