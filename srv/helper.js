function sayHello() {
    return "Hello";
}

function calculateDiscount(each) {
    if (each.stock > 111) {
        each.title += ` -- 11% discount!`
      }
}

module.exports = {
    sayHello,
    calculateDiscount
};