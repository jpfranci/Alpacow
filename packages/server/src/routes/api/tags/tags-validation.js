const { celebrate, Joi, Segments } = require("celebrate");

const filterTagsSchema = Joi.object().keys({
  searchString: Joi.string().min(1).required(),
});

const filterTagsValidationFn = celebrate({
  [Segments.QUERY]: filterTagsSchema,
});

module.exports = {
  filterTagsValidationFn,
};
