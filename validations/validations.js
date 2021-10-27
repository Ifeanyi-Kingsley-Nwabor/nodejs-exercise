const { check } = require("express-validator");

const userValidation = [
    check("first_name", "Please enter a valid name.").not().isEmpty().isAlpha().isLength({ min: 2 }),
    check("last_name", "Please enter a valid name.").not().isEmpty().isAlpha().isLength({ min: 2 }),
    check("age").not().isEmpty().isInt(),
    check("active").not().isEmpty(),
];

const orderValidation = [
    check("price").not().isEmpty().isInt(),
    check("date").not().isEmpty(),
    check("user_id").not().isEmpty().isInt(),
];

module.exports = {
    userValidation,
    orderValidation,
  }