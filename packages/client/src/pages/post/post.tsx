import React, { useEffect } from "react";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import styled from "styled-components";
import { POST_PAGE } from "../../common/links";
import { Post } from "../../redux/slices/post-slice";
import { useAppSelector } from "../../redux/store";
import postService from "../../services/posts";
import PostView from "./post-view/post-view";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyledContainer = styled.div`
  margin: 7.5vh 10vw;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3em;
`;

const PostPage = () => {
  const [serverPost, setServerPost] = useState<Post | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const storePost = useAppSelector((state) =>
    state.post.currPostIndex === -1
      ? undefined
      : state.post.posts[state.post.currPostIndex],
  );

  const match = useRouteMatch<{ id: string }>(POST_PAGE);

  // Fetch thicc post data from server (contains comments)
  // We do this b/c posts in redux store don't have comments
  useEffect(() => {
    if (match && !serverPost) {
      postService
        .getByID(match.params.id)
        .then((res) => setServerPost(res.data))
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  }, [match, serverPost]);

  const post = serverPost || storePost;

  return (
    <StyledContainer>
      {post ? (
        <PostView post={post} />
      ) : isLoading ? (
        // this branch is only hit if we've naved to page via URL
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      ) : (
        <div>The post you're looking for doesn't exist...</div>
      )}
    </StyledContainer>
  );
};

export default PostPage;
