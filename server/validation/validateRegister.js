var validator = require('validator');

const validateInputForRegistration = (data) => {

  let errors = {};

  // validate name
  if ( !validator.isLength(data.name, { min: 7 }) ) {
    errors.nameMessage = "Your name must be at least 7 characters.";
  }

  // validate email
  if ( !validator.isLength(data.email, { min: 6 }) || !validator.isEmail(data.email)) {
    errors.emailMessage = "Please enter a valid email.";
  }

  // validate password
  if ( !validator.isLength(data.password, { min: 7 }) || !validator.isLength(data.confirm, { min: 7 }) ) {
    errors.passwordMessage = "Your password must be at least 7 characters.";
  }

  if ( data.password !== data.confirm ) {
    errors.passwordMessage = "Your passwords must match.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = validateInputForRegistration;
