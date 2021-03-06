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

const emailAndUsernameUpdateSchema = Joi.object().keys({
  email: Joi.string().email(),
  username: Joi.string(),
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

const emailAndUsernameUpdateValidationFn = celebrate({
  [Segments.BODY]: emailAndUsernameUpdateSchema,
});

const getPostByUserIdValidationFn = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().min(1).required(),
  }),
  [Segments.QUERY]: Joi.object().keys({
    sortType: Joi.string().valid("popular", "new").default("new"),
    showMatureContent: Joi.boolean().default(false),
  }),
});

const getVotedPostsByUserIdValidationFn = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().min(1).required(),
  }),
  [Segments.QUERY]: Joi.object().keys({
    sortType: Joi.string().valid("popular", "new").default("new"),
    isUpvoted: Joi.boolean().default(false),
    showMatureContent: Joi.boolean().default(false),
  }),
});

module.exports = {
  loginValidationFn,
  createUserValidationFn,
  emailAndUsernameValidationFn,
  emailAndUsernameUpdateValidationFn,
  getPostByUserIdValidationFn,
  getVotedPostsByUserIdValidationFn,
};
