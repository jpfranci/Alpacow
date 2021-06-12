import React from "react";
import { Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import { Post } from "../../../redux/slices/postSlice";
import UpvoteIcon from "@material-ui/icons/Details";
import DownvoteIcon from "@material-ui/icons/ChangeHistory";

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 1em 0;
  padding: 1.5em 2em 1em 2em;
  background-color: ${(props) => props.theme.palette.secondary.main};
`;

const TitleText = styled.h3`
  margin-top: 0.5em;
  margin-bottom: 1em;
  font-size: 1em;
`;

const BodyText = styled.p`
  margin-top: 0;
  margin-bottom: 3em;
  font-size: 0.9em;
`;

const PostFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75em;
`;

const PostFooterSection = styled.div`
  display: flex;
  align-items: center;
`;

const DateText = styled.div`
  margin-right: 2em;
`;

interface PostProps {
  post: Post;
}

const PostListItem: React.FC<PostProps> = ({ post }) => {
  const voteCount = post.upvotes - post.downvotes;

  return (
    <PostContainer>
      <TitleText>{post.title}</TitleText>
      <BodyText>{post.bodyText}</BodyText>
      <PostFooter>
        <PostFooterSection>
          {/* TODO change this once createdAt props exists */}
          <DateText>{new Date(post.createdAt).toDateString()}</DateText>
          <Button variant="contained" color="primary" size="small">
            {post.tag}
          </Button>
        </PostFooterSection>
        <PostFooterSection>
          <IconButton>
            <UpvoteIcon />
          </IconButton>
          {`${voteCount > 0 ? "+" : ""}${voteCount}`}
          <IconButton>
            <DownvoteIcon />
          </IconButton>
        </PostFooterSection>
      </PostFooter>
    </PostContainer>
  );
};

export default PostListItem;
