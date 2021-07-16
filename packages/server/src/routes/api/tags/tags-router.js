const express = require("express");
const router = express.Router();
const { filterTagsValidationFn } = require("./tags-validation");
const nocache = require("nocache");
const { getTagsBySearchString } = require("../../../services/tags-service");

router.get("/", [filterTagsValidationFn, nocache()], async (req, res, next) => {
  try {
    const { searchString } = req.query;
    const fetchedTags = await getTagsBySearchString(searchString);
    res.json(fetchedTags);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
