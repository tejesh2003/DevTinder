const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is non Valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is non Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is non Valid");
  }
};

module.exports = {
  validateSignUpData,
};
