import React, { useEffect } from "react";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import styled from "styled-components";
import { POST_PAGE } from "../../common/links";
import { updateActivePost } from "../../redux/slices/post-slice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import postService from "../../services/posts";
import PostView from "./post-view/post-view";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyledContainer = styled.div`
  margin: 7.5vh 10vw;
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3em;
`;

const PostPage = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const post = useAppSelector((state) => state.post.activePost);

  const match = useRouteMatch<{ id: string }>(POST_PAGE);

  // Fetch thicc post data from server
  // We do this b/c posts in redux store don't have comments
  // This also handles workflow where user naved here via url and store is empty
  useEffect(() => {
    if (!match) return;
    setIsLoading(true);
    postService
      .getByID(match.params.id)
      .then((res) => dispatch(updateActivePost(res.data)))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));

    // removes active post on unmount
    return () => {
      dispatch(updateActivePost(undefined));
    };
  }, [match?.params.id]);

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
