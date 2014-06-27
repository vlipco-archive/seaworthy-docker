(function() {
  beforeEach(module('appServices'));

  describe("nextSection", function() {
    it("should return correctly the steps of the no shipping - debit case", inject(function(nextSection) {
      var transaction;
      transaction = {
        shipping: false,
        paymentMethod: 'debit'
      };
      expect(nextSection().changeSection('intro', transaction)).toEqual('payment');
      return expect(nextSection().changeSection('payment', transaction)).toEqual('confirmation');
    }));
    it("should return correctly the steps of the  shipping - debit case", inject(function(nextSection) {
      var transaction;
      transaction = {
        shipping: true,
        paymentMethod: 'debit'
      };
      expect(nextSection().changeSection('intro', transaction)).toEqual('shipping');
      expect(nextSection().changeSection('shipping', transaction)).toEqual('payment');
      return expect(nextSection().changeSection('payment', transaction)).toEqual('confirmation');
    }));
    it("should return correctly the steps of the  no shipping - credit case", inject(function(nextSection) {
      var transaction;
      transaction = {
        shipping: false,
        paymentMethod: 'credit'
      };
      expect(nextSection().changeSection('intro', transaction)).toEqual('credit');
      expect(nextSection().changeSection('credit', transaction)).toEqual('payment');
      return expect(nextSection().changeSection('payment', transaction)).toEqual('confirmation');
    }));
    return it("should return correctly the steps of the shipping - credit case", inject(function(nextSection) {
      var transaction;
      transaction = {
        shipping: true,
        paymentMethod: 'credit'
      };
      expect(nextSection().changeSection('intro', transaction)).toEqual('shipping');
      expect(nextSection().changeSection('shipping', transaction)).toEqual('credit');
      expect(nextSection().changeSection('credit', transaction)).toEqual('payment');
      return expect(nextSection().changeSection('payment', transaction)).toEqual('confirmation');
    }));
  });

}).call(this);
