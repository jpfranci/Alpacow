const express = require("express");
const router = express.Router();
const { filterTagsValidationFn } = require("./tags-validation");
const { getTagsBySearchString } = require("../../../services/tags-service");
const escapeStringRegexp = require("escape-string-regexp");

router.get("/", filterTagsValidationFn, async (req, res, next) => {
  try {
    const { searchString } = req.query;
    const escapedString = escapeStringRegexp(searchString);
    const fetchedTags = await getTagsBySearchString(escapedString);
    res.json(fetchedTags);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
