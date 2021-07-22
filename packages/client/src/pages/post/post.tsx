import React, { useEffect } from "react";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import styled from "styled-components";
import { POST_PAGE } from "../../common/links";
import { Post } from "../../redux/slices/post-slice";
import { useAppSelector } from "../../redux/store";
import postService from "../../services/posts";
import PostView from "./post-view/post-view";

const StyledContainer = styled.div`
  margin: 7.5vh 10vw;
`;

const PostPage = () => {
  const [serverPost, setServerPost] = useState<Post | undefined>(undefined);
  const storePost = useAppSelector((state) =>
    state.post.currPostIndex === -1
      ? undefined
      : state.post.posts[state.post.currPostIndex],
  );

  const match = useRouteMatch<{ id: string }>(POST_PAGE);

  // Fetch post data from server if user naved to post page via url (vs client-side nav)
  // We do this b/c post data is only loaded into store if user opens home page first
  // TODO kinda jank, can do better with server side rendering ??
  useEffect(() => {
    if (match && !storePost && !serverPost) {
      postService
        .getByID(match.params.id)
        .then((res) => setServerPost(res.data))
        .catch((error) => console.error(error));
    }
  }, [match, storePost, serverPost, setServerPost]);

  const post = storePost || serverPost;

  return (
    <StyledContainer>
      {post ? (
        <PostView post={post} />
      ) : (
        <div>The post you're looking for doesn't exist...</div>
      )}
    </StyledContainer>
  );
};

export default PostPage;
