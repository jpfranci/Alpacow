import React from "react";
import { Comment as CommentType } from "../../../redux/slices/post-slice";

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return <div>{comment.body}</div>;
};

export default Comment;
