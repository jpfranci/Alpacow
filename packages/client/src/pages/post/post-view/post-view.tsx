import React from "react";
import { Button, IconButton } from "@material-ui/core";
import DownvoteIcon from "@material-ui/icons/Details";
import UpvoteIcon from "@material-ui/icons/ChangeHistory";
import moment from "moment";
import styled from "styled-components";
import { downvote, Post, upvote } from "../../../redux/slices/post-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Comment from "./comment";

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

const Comments = styled.div`
  display: flex;
  flex-direction: column;
`;

// hr tags inside flex parent els need this to display properly
const Line = styled.hr`
  margin-left: 0;
  margin-right: 0;
`;

interface PostViewProps {
  post: Post;
}

const PostView: React.FC<PostViewProps> = ({ post }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const voteCount = post.numUpvotes - post.numDownvotes;
  const date = moment(post.date).format("MM-DD-YYYY @ hh:mm A");
  const didUserUpvote: boolean | undefined = user.votedPosts[post._id]?.upvoted;
  const shouldDisableUpvote = didUserUpvote !== undefined && didUserUpvote;
  const shouldDisableDownvote = didUserUpvote !== undefined && !didUserUpvote;

  // TODO implement upvote/downvote logic
  return (
    <div>
      <PostViewContainer>
        <PostContent>
          <TitleText>{post.title}</TitleText>
          <SubTitleText>
            Posted on {date} by <b>{post.username}</b>
          </SubTitleText>
          <BodyText>{post.body}</BodyText>
          <PostContentFooter>
            <Button variant="contained" color="primary" size="small">
              {post.tag}
            </Button>
            <VoteButtonSection>
              <IconButton
                onClick={() => dispatch(upvote({ post, user }))}
                disabled={shouldDisableUpvote}>
                <UpvoteIcon />
              </IconButton>
              {`${voteCount > 0 ? "+" : ""}${voteCount}`}
              <IconButton
                onClick={() => dispatch(downvote({ post, user }))}
                disabled={shouldDisableDownvote}>
                <DownvoteIcon />
              </IconButton>
            </VoteButtonSection>
          </PostContentFooter>
        </PostContent>
        <Line />
        <Comments>
          <h3>Comments ({post.comments.length})</h3>
          {post.comments.map((comment, i) => (
            <Comment key={i} comment={comment} />
          ))}
        </Comments>
      </PostViewContainer>
    </div>
  );
};

export default PostView;