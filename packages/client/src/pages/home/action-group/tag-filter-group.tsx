import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { setTagFilter, setTagInput } from "../../../redux/slices/post-slice";
import TagSearch from "./tag-search";

const TagFilterGroup = () => {
  const selectedTagFilter = useAppSelector((state) => state.post.tagFilter);
  const tagInput = useAppSelector((state) => state.post.tagInput);
  const dispatch = useAppDispatch();
  const handleTagSelect = (newTagFilter: string) => {
    dispatch(setTagFilter(newTagFilter));
  };
  const handleTagInput = (newTagInput: string) => {
    dispatch(setTagInput(newTagInput));
  };

  return (
    <TagSearch
      selectedTag={selectedTagFilter}
      onTagSelect={handleTagSelect}
      inputValue={tagInput}
      onInputChange={handleTagInput}
    />
  );
};

export default TagFilterGroup;
