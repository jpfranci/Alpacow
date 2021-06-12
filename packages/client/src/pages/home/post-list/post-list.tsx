import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { useAppSelector } from "../../../redux/store";
import PostListItem from "./post-list-item";
import { PostSortType } from "../../../redux/slices/post-slice";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 10vw;
`;

// TODO rename file to component name?
const PostList: React.FC = () => {
  const posts = useAppSelector((state) => {
    // TODO make a custom selector / decide how post sorting will work
    const result = [...state.post.posts];
    switch (state.post.sortType) {
      case PostSortType.NEW:
        result.sort((p1, p2) => p2.createdAt - p1.createdAt);
        break;
      case PostSortType.POPULAR:
        result.sort((p1, p2) => p2.upvotes - p1.upvotes);
        break;
      default:
        console.log("damn wtf");
    }

    return result;
  });

  return (
    <StyledContainer>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </StyledContainer>
  );
};

export default PostList;
