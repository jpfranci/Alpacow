import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { setTagFilter } from "../../../redux/slices/post-slice";
import TagSearch from "./tag-search";

const TagFilterGroup = () => {
  const selectedTagFilter = useAppSelector((state) => state.post.tagFilter);
  const dispatch = useAppDispatch();
  const handleTagSelect = (newTagFilter: string) => {
    dispatch(setTagFilter(newTagFilter));
  };

  return (
    <TagSearch selectedTag={selectedTagFilter} onTagSelect={handleTagSelect} />
  );
};

export default TagFilterGroup;
