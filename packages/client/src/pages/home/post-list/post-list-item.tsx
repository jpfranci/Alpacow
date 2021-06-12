import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { useAppSelector } from "../../../redux/store";
import { Post } from "../../../redux/slices/postSlice";

const PostListItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 1em 0;
  padding: 1.5em 2em;
  background-color: ${(props) => props.theme.palette.secondary.main};
`;

const TitleText = styled.h3`
  margin-top: 0.5em;
  margin-bottom: 1em;
  font-size: 1em;
`;

const BodyText = styled.p`
  margin-top: 0;
  margin-bottom: 1em;
  font-size: 0.9em;
`;

interface PostProps {
  post: Post;
}

const PostListItem: React.FC<PostProps> = ({ post }) => {
  return (
    <PostListItemContainer>
      <TitleText>{post.title}</TitleText>
      <BodyText>{post.bodyText}</BodyText>
    </PostListItemContainer>
  );
};

export default PostListItem;
