import React, { useState } from "react";
import { Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import {
  downvote,
  Post,
  setTagFilter,
  upvote,
} from "../../../redux/slices/post-slice";
import DownvoteIcon from "@material-ui/icons/Details";
import UpvoteIcon from "@material-ui/icons/ChangeHistory";
import { useAppDispatch } from "../../../redux/store";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 1em 0;
  padding: 1.5em 2em 1em 2em;
  background-color: ${(props) => props.theme.palette.secondary.main};
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #bbbbbb;
    cursor: pointer;
  }
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

export interface VoteUpdateParams {
  post: Post;
}

interface PostProps {
  post: Post;
  index: number;
  showPostBody: boolean;
  postClickCallback?: () => void;
  voteClickCallback?: (params: VoteUpdateParams) => void;
}

const PostListItem: React.FC<PostProps> = ({
  post,
  showPostBody,
  postClickCallback,
  voteClickCallback,
}) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const voteCount = post.numUpvotes - post.numDownvotes;
  const date = moment(post.date).format("MM-DD-YYYY @ hh:mm A");

  const handleTagClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    dispatch(setTagFilter(post.tag));
  };

  const handlePostClick = () => {
    if (postClickCallback) {
      postClickCallback();
    }
    history.push(`/posts/${post._id}`);
    window.scrollTo({ top: 0 }); // we need this o/w scroll position doesn't change when page view changes
  };

  const handleUpvoteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    dispatch(upvote({ post }))
      .then((result) => {
        const updatedVotes = unwrapResult(result);
        try {
          if (voteClickCallback) {
            voteClickCallback({
              post: { ...post, ...updatedVotes },
            });
          }
        } catch (err) {
          throw err;
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDownvoteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    dispatch(downvote({ post }))
      .then((result) => {
        const updatedVotes = unwrapResult(result);
        try {
          if (voteClickCallback) {
            voteClickCallback({
              post: { ...post, ...updatedVotes },
            });
          }
        } catch (err) {
          throw err;
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const postBodyText = () => {
    if (showPostBody) {
      return (
        <BodyText>
          {post.body.length > 1000
            ? `${post.body.substr(0, 500)}...`
            : post.body}
        </BodyText>
      );
    }
  };

  return (
    <PostContainer onClick={handlePostClick}>
      <TitleText>{post.title}</TitleText>
      {postBodyText()}
      <PostFooter>
        <PostFooterSection>
          <DateText>{date}</DateText>
          <Button
            onClick={handleTagClick}
            variant="contained"
            color="primary"
            size="small">
            {post.tag}
          </Button>
        </PostFooterSection>
        <PostFooterSection>
          <IconButton onClick={handleUpvoteClick} disabled={post.isUpvoted}>
            <UpvoteIcon />
          </IconButton>

          {`${voteCount > 0 ? "+" : ""}${voteCount}`}

          <IconButton onClick={handleDownvoteClick} disabled={post.isDownvoted}>
            <DownvoteIcon />
          </IconButton>
        </PostFooterSection>
      </PostFooter>
    </PostContainer>
  );
};

export default PostListItem;
