var validator = require('validator');

const validateInputForLogin = (data) => {

  let errors = {};

  // validate email
  if ( !validator.isLength(data.email, { min: 7 }) || !validator.isEmail(data.email) ) {
    errors.emailMessage = "Your email must be at least 7 characters.";
  }

  // validate password
  if ( !validator.isLength(data.password, { min: 7 }) ) {
    errors.passwordMessage = "Your password must be at least 7 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = validateInputForLogin;
