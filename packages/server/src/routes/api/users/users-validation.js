const { celebrate, Joi, Segments } = require("celebrate");

const createUserSchema = Joi.object().keys({
  idToken: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  userId: Joi.string().min(1).required(),
});

const loginSchema = Joi.object().keys({
  idToken: Joi.string().min(1).required(),
});

const loginValidationFn = celebrate({
  [Segments.BODY]: loginSchema,
});

const createUserValidationFn = celebrate({
  [Segments.BODY]: createUserSchema,
});

module.exports = {
  loginValidationFn,
  createUserValidationFn,
};
