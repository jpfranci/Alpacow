const { celebrate, Joi, Segments } = require("celebrate");

const createPostSchema = Joi.object().keys({
  title: Joi.string().min(1).required(),
  body: Joi.string().min(1).max(1024).required(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  isAnonymous: Joi.boolean().required(),
  tag: Joi.string().min(1).required(),
});

const getPostSchema = Joi.object().keys({
  tagFilter: Joi.string().min(1),
  lon: Joi.number().required(),
  lat: Joi.number().required(),
  sortType: Joi.string().valid("popular", "new").required(),
  currentPostId: Joi.string().min(24).max(24),
  showMatureContent: Joi.boolean().required(),
});

const createCommentSchema = Joi.object().keys({
  body: Joi.string().min(1).max(1024).required(),
});

const createPostValidationFn = celebrate({
  [Segments.BODY]: createPostSchema,
});

const getPostValidationFn = celebrate({
  [Segments.QUERY]: getPostSchema,
});

const createCommentValidationFn = celebrate({
  [Segments.BODY]: createCommentSchema,
});

module.exports = {
  createPostValidationFn,
  getPostValidationFn,
  createCommentValidationFn,
};
