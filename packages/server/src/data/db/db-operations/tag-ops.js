const Tag = require("../../models/tag-model");

const tagExists = async (tag) => {
  const optTag = await Tag.find({ tag }).limit(1);
  return optTag.length > 0;
};

const createTag = async (tag) => {
  await Tag.create({ tag });
};

const getTagBySearchString = async (searchString) => {
  return Tag.find({
    tag: { $regex: searchString, $options: "i" },
  }).limit(20);
};

module.exports = {
  tagExists,
  createTag,
  getTagBySearchString,
};
