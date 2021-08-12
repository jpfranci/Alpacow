import { Select, MenuItem, IconButton } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import {
  Comment as CommentType,
  CommentSortType,
  Post,
  setCommentSortType,
} from "../../../redux/slices/post-slice";
import Comment from "./comment";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import { useState } from "react";
import CommentDialog from "./comment-dialog";

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentsHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CommentsHeaderText = styled.h3`
  margin-right: 1em;
`;

interface CommentsProps {
  comments: CommentType[];
  post: Post;
}

const Comments: React.FC<CommentsProps> = ({ comments, post }) => {
  const [showCommentDialog, setShowCommentDialog] = useState(false);

  const dispatch = useAppDispatch();
  const commentSortType = useAppSelector((state) => state.post.commentSortType);
  const showMatureContent = useAppSelector(
    (state) => state.post.showMatureContent,
  );
  const user = useAppSelector((state) => state.user);

  const handleCommentSortSelect = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    dispatch(setCommentSortType(e.target.value as CommentSortType));
  };

  const filteredComments = showMatureContent
    ? [...comments]
    : comments.filter((comment) => !comment.isMature);
  const sortedComments = filteredComments.sort((comment1, comment2) => {
    if (commentSortType === CommentSortType.POPULAR) {
      const netVotes1 = comment1.numUpvotes - comment1.numDownvotes;
      const netVotes2 = comment2.numUpvotes - comment2.numDownvotes;
      if (netVotes1 !== netVotes2) return netVotes1 <= netVotes2 ? 1 : -1;

      // use date for ties
      return moment(comment1.date).isBefore(comment2.date) ? 1 : -1;
    }

    if (commentSortType === CommentSortType.NEW) {
      return moment(comment1.date).isBefore(comment2.date) ? 1 : -1;
    }

    // should never hit this
    return 1;
  });

  return (
    <CommentsContainer>
      <CommentsHeader>
        <CommentsHeaderText>
          Comments ({sortedComments.length})
        </CommentsHeaderText>
        <Select value={commentSortType} onChange={handleCommentSortSelect}>
          <MenuItem value={CommentSortType.NEW}>New</MenuItem>
          <MenuItem value={CommentSortType.POPULAR}>Popular</MenuItem>
        </Select>
        <IconButton
          onClick={() => setShowCommentDialog(true)}
          disabled={!user._id}>
          <AddIcon />
        </IconButton>
      </CommentsHeader>
      {sortedComments.map((comment, i) => (
        <Comment key={i} comment={comment} />
      ))}
      {showCommentDialog && (
        <CommentDialog
          open={showCommentDialog}
          onClose={() => setShowCommentDialog(false)}
          post={post}
        />
      )}
    </CommentsContainer>
  );
};

export default Comments;
