import React from "react";
import { useAppSelector } from "../../redux/store";

const Post = () => {
  console.log("render");
  const post = useAppSelector(
    (state) => state.post.posts[state.post.currPostIndex],
  );

  return <div>{post.title}</div>;
};

export default Post;
