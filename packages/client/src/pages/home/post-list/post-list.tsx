import React, { useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import PostListItem from "./post-list-item";
import { getPostsByFilter } from "../../../redux/slices/post-slice";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 10vw;
`;

const PostList: React.FC = () => {
  const dispatch = useAppDispatch();

  const postState = useAppSelector((state) => {
    return state.post;
  });
  const { locationFilter, sortType, tagFilter, showMatureContent, posts } =
    postState;
  const userId = useAppSelector((state) => {
    return state.user._id;
  });

  useEffect(() => {
    dispatch(getPostsByFilter());
  }, [locationFilter, sortType, tagFilter, showMatureContent, userId]);

  return (
    <StyledContainer>
      {posts.map((post, i) => (
        <PostListItem
          key={post._id}
          post={post}
          index={i}
          showPostBody={true}
        />
      ))}
    </StyledContainer>
  );
};

export default PostList;
