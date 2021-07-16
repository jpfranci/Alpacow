const TagDb = require("../data/db/db-operations/tag-ops");

const getTagsBySearchString = (searchString) => {
  return TagDb.getTagBySearchString(searchString);
};

module.exports = {
  getTagsBySearchString,
};
