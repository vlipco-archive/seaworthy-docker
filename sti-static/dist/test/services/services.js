(function() {
  beforeEach(module('app'));

  describe("txnResource", function() {
    var $httpBackend, checkout;
    $httpBackend = {};
    checkout = {};
    beforeEach(inject(function(_$httpBackend_, $injector) {
      $httpBackend = _$httpBackend_;
      checkout = $injector.get('txnResource');
      return $httpBackend.whenPOST('api/0.1.0/checkout').respond([200, "id: 500"]);
    }));
    xit("shouldn't be an empty service", function() {
      expect(checkout).not.toBeNull();
      return expect(checkout).not.toBeUndefined();
    });
    return xit("should load txnResource", function() {
      var error, result, success;
      success = function(result) {
        console.log(result);
        return expect(0).toBe(0);
      };
      error = function(result) {
        console.log(result);
        return expect(1).toBe(0);
      };
      $httpBackend.expectPOST('api/0.1.0/checkout');
      result = checkout.create(success, error);
      $httpBackend.flush();
      return console.log("Result", result);
    });
  });

}).call(this);
