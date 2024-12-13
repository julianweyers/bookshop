
const { sayHello, calculateDiscount } = require("../srv/helper");

// unit tests

describe("Helper functions", () => {
  test('sayHello should return "Hello"', () => {
    const result = sayHello();
    expect(result).toBe("Hello");
  });

  test("calculateDiscount should add discount to title if stock is greater than 111", () => {
    const book = { title: "Book Title", stock: 112 };
    calculateDiscount(book);
    expect(book.title).toBe("Book Title -- 11% discount!");
  });

  test("calculateDiscount should not add discount to title if stock is 111 or less", () => {
    const book = { title: "Book Title", stock: 111 };
    calculateDiscount(book);
    expect(book.title).toBe("Book Title");
  });
});
