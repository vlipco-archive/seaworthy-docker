(function() {
  describe("A suite is just a function", function() {
    var a;
    a = void 0;
    return it("and so is a spec", function() {
      a = true;
      return expect(a).toBe(true);
    });
  });

}).call(this);
