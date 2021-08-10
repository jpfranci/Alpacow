import React from "react";
import { Button, IconButton } from "@material-ui/core";
import DownvoteIcon from "@material-ui/icons/Details";
import UpvoteIcon from "@material-ui/icons/ChangeHistory";
import moment from "moment";
import styled from "styled-components";
import { downvote, Post, upvote } from "../../../redux/slices/post-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { StyledHR } from "../../common/common";
import Comments from "./comments";
import CircularProgress from "@material-ui/core/CircularProgress";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const PostViewContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleText = styled.h2`
  margin-top: 0;
  margin-bottom: 0.4em;
`;

const SubTitleText = styled.p`
  margin-top: 0;
  margin-bottom: 0.5em;
  font-size: 0.8em;
`;

const BodyText = styled.p`
  line-height: 1.6;
`;

const PostContentFooter = styled.div`
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

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3em;
`;

interface PostViewProps {
  post: Post;
}

const PostView: React.FC<PostViewProps> = ({ post }) => {
  const dispatch = useAppDispatch();

  const voteCount = post.numUpvotes - post.numDownvotes;
  const date = moment(post.date).format("MM-DD-YYYY @ hh:mm A");
  const shouldDisableUpvote = post.isUpvoted;
  const shouldDisableDownvote = post.isDownvoted;

  // TODO implement upvote/downvote logic
  return (
    <div>
      <PostViewContainer>
        <PostContent>
          <TitleText>{post.title}</TitleText>
          <SubTitleText>
            Posted on {date} by <b>{post.username ?? "anonymous"}</b>
          </SubTitleText>
          <BodyText>{post.body}</BodyText>
          <PostContentFooter>
            <Button variant="contained" color="primary" size="small">
              {post.tag}
            </Button>
            <VoteButtonSection>
              <IconButton
                onClick={() =>
                  dispatch(upvote({ post }))
                    .then(unwrapResult)
                    .catch((err) => toast.error(err.message))
                }
                disabled={shouldDisableUpvote}>
                <UpvoteIcon />
              </IconButton>
              {`${voteCount > 0 ? "+" : ""}${voteCount}`}
              <IconButton
                onClick={() =>
                  dispatch(downvote({ post }))
                    .then(unwrapResult)
                    .catch((err) => toast.error(err.message))
                }
                disabled={shouldDisableDownvote}>
                <DownvoteIcon />
              </IconButton>
            </VoteButtonSection>
          </PostContentFooter>
        </PostContent>
        <StyledHR />
        {post.comments ? (
          <Comments comments={post.comments} />
        ) : (
          <LoaderContainer>
            <CircularProgress />
          </LoaderContainer>
        )}
      </PostViewContainer>
    </div>
  );
};

export default PostView;
