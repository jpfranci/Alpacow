import React from "react";
import { Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import {
  downvote,
  Post,
  setCurrPostIndex,
  setTagFilter,
  upvote,
} from "../../../redux/slices/post-slice";
import DownvoteIcon from "@material-ui/icons/Details";
import UpvoteIcon from "@material-ui/icons/ChangeHistory";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import moment from "moment";
import { useHistory } from "react-router-dom";

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

interface PostProps {
  post: Post;
  index: number;
}

const PostListItem: React.FC<PostProps> = ({ post, index }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const history = useHistory();

  const voteCount = post.numUpvotes - post.numDownvotes;
  const didUserUpvote: boolean | undefined = user.votedPosts[post._id]?.upvoted;
  const shouldDisableUpvote = didUserUpvote !== undefined && didUserUpvote;
  const shouldDisableDownvote = didUserUpvote !== undefined && !didUserUpvote;
  const date = moment(post.date).format("MM-DD-YYYY @ hh:mm A");

  const handleTagClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    dispatch(setTagFilter(post.tag));
  };

  const handlePostClick = () => {
    dispatch(setCurrPostIndex(index));
    history.push(`/posts/${post._id}`);
  };

  const handleUpvoteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    dispatch(upvote({ post, user }));
  };

  const handleDownvoteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    dispatch(downvote({ post, user }));
  };

  return (
    <PostContainer onClick={handlePostClick}>
      <TitleText>{post.title}</TitleText>
      <BodyText>
        {post.body.length > 1000 ? `${post.body.substr(0, 500)}...` : post.body}
      </BodyText>
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
          {/* TODO disable voting for non-logged in users */}

          <IconButton
            onClick={handleUpvoteClick}
            disabled={shouldDisableUpvote}>
            <UpvoteIcon />
          </IconButton>

          {`${voteCount > 0 ? "+" : ""}${voteCount}`}

          <IconButton
            onClick={handleDownvoteClick}
            disabled={shouldDisableDownvote}>
            <DownvoteIcon />
          </IconButton>
        </PostFooterSection>
      </PostFooter>
    </PostContainer>
  );
};

export default PostListItem;
