import { IconButton } from "@material-ui/core";
import moment from "moment";
import React from "react";
import styled from "styled-components";
import {
  Comment as CommentType,
  downvote,
  upvote,
} from "../../../redux/slices/post-slice";
import { StyledHR } from "../../common/common";
import DownvoteIcon from "@material-ui/icons/Details";
import UpvoteIcon from "@material-ui/icons/ChangeHistory";

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
  const voteCount = comment.numUpvotes - comment.numDownvotes;
  const date = moment(comment.date).fromNow();

  return (
    <CommentContainer>
      <Header>
        <b>{comment.username}</b> - {date}
      </Header>
      <Body>{comment.body}</Body>
      <Footer>
        <VoteButtonSection>
          <IconButton
          // onClick={() => dispatch(upvote({ post, user }))}
          // disabled={shouldDisableUpvote}
          >
            <UpvoteIcon />
          </IconButton>
          {`${voteCount > 0 ? "+" : ""}${voteCount}`}
          <IconButton
          // onClick={() => dispatch(downvote({ post, user }))}
          // disabled={shouldDisableDownvote}
          >
            <DownvoteIcon />
          </IconButton>
        </VoteButtonSection>
      </Footer>
      <StyledHR />
    </CommentContainer>
  );
};

export default Comment;
