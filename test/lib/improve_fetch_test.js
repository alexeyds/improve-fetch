import test from "enhanced-tape";

test("My library lib test", function(t) {
  t.test("thing", function(t) {
    t.test("does something", function(t) {
      t.true(true);

      t.end();
    });
  });

  t.end();
});