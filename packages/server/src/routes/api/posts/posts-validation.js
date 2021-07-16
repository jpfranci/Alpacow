const { celebrate, Joi, Segments } = require("celebrate");

const createPostSchema = Joi.object({
  username: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  title: Joi.string().min(1).required(),
  body: Joi.string().min(1).required(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  isAnonymous: Joi.boolean().required(),
  tag: Joi.string().min(1).required(),
});

exports.createPostValidationFn = celebrate({
  [Segments.BODY]: createPostSchema,
});
