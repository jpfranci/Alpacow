import { IconButton } from "@material-ui/core";
import moment from "moment";
import React, { useState } from "react";
import styled from "styled-components";
import {
  Comment as CommentType,
  Post as PostType,
} from "../../../redux/slices/post-slice";
import { StyledHR } from "../../common/common";
import DownvoteIcon from "@material-ui/icons/Details";
import UpvoteIcon from "@material-ui/icons/ChangeHistory";
import UsernameButton from "./username-button";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  downvoteComment,
  upvoteComment,
} from "../../../redux/slices/post-slice";
import { toast } from "react-toastify";

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
  font-size: 0.9em;
`;

const Header = styled.div`
  margin-bottom: 0.5em;
`;

const Body = styled.div`
  margin-bottom: 1em;
  line-height: 1.6;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75em;
`;

const VoteButtonSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [upvoteDisabled, setUpvoteDisabled] = useState(comment.isUpvoted);
  const [downvoteDisabled, setDownvoteDisabled] = useState(comment.isDownvoted);

  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.post.activePost) as PostType;
  const showMatureContent = useAppSelector(
    (state) => state.post.showMatureContent,
  );
  const user = useAppSelector((state) => state.user);

  const voteCount = comment.numUpvotes - comment.numDownvotes;
  const date = moment(comment.date).fromNow();

  const handleUpvoteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    dispatch(upvoteComment({ postId: post?._id, commentId: comment._id }))
      .then((result) => {
        unwrapResult(result);
        setUpvoteDisabled(true);
        setDownvoteDisabled(false);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleDownvoteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    dispatch(downvoteComment({ postId: post?._id, commentId: comment._id }))
      .then((result) => {
        unwrapResult(result);
        setDownvoteDisabled(true);
        setUpvoteDisabled(false);
      })
      .catch((err) => toast.error(err.message));
  };

  if (!showMatureContent && comment.isMature) return null;
  return (
    <CommentContainer>
      <Header>
        <UsernameButton
          username={comment.username}
          userId={comment.userId}
          shouldHighlight={user._id === comment.userId}
        />
        {} - {date}
      </Header>
      <Body>{comment.body}</Body>
      <Footer>
        <VoteButtonSection>
          <IconButton onClick={handleUpvoteClick} disabled={upvoteDisabled}>
            <UpvoteIcon />
          </IconButton>
          {`${voteCount > 0 ? "+" : ""}${voteCount}`}
          <IconButton onClick={handleDownvoteClick} disabled={downvoteDisabled}>
            <DownvoteIcon />
          </IconButton>
        </VoteButtonSection>
      </Footer>
      <StyledHR />
    </CommentContainer>
  );
};

export default Comment;
