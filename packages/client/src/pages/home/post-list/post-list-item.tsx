import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { useAppSelector } from "../../../redux/store";
import { Post } from "../../../redux/slices/postSlice";

const PostContainer = styled.div`
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

const PostFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75em;
`;

const DateText = styled.div`
  // margin: 0.5em;
`;

interface PostProps {
  post: Post;
}

const PostListItem: React.FC<PostProps> = ({ post }) => {
  return (
    <PostContainer>
      <TitleText>{post.title}</TitleText>
      <BodyText>{post.bodyText}</BodyText>
      <PostFooter>
        {/* TODO change this once createdAt props exists */}
        <DateText>May 4, 2020</DateText>
        <Button variant="contained" color="primary" size="small">
          {post.tag}
        </Button>
      </PostFooter>
    </PostContainer>
  );
};

export default PostListItem;
