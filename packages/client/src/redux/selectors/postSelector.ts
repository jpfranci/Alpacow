import { createSelector } from "reselect";
import { RootState } from "../store";

// we can create selectors to help us compute derived data from state

const getPosts = (state: RootState) => state.post.posts;
const getTagFilter = (state: RootState) => state.post.tagFilter;

export const getPostsFilteredByTag = createSelector(
  [getPosts, getTagFilter],
  (posts, tagFilter) => {
    return tagFilter ? posts.filter((post) => post.tag === tagFilter) : posts;
  },
);
