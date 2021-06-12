import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { useAppSelector } from "../../../redux/store";
import PostListItem from "./post-list-item";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 10vw;
`;

// TODO rename file to component name?
const PostList: React.FC = () => {
  const posts = useAppSelector((state) => state.post.posts);

  return (
    <StyledContainer>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </StyledContainer>
  );
};

export default PostList;
