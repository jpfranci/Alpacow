const { celebrate, Joi, Segments } = require("celebrate");

const createUserSchema = Joi.object().keys({
  idToken: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
});

const loginSchema = Joi.object().keys({
  idToken: Joi.string().min(1).required(),
});

const emailAndUsernameExistsSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
});

const loginValidationFn = celebrate({
  [Segments.BODY]: loginSchema,
});

const createUserValidationFn = celebrate({
  [Segments.BODY]: createUserSchema,
});

const emailAndUsernameValidationFn = celebrate({
  [Segments.BODY]: emailAndUsernameExistsSchema,
});

module.exports = {
  loginValidationFn,
  createUserValidationFn,
  emailAndUsernameValidationFn,
};
