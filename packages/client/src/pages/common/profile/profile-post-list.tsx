import React, { useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import PostListItem from "../../home/post-list/post-list-item";
import { getPostsByUser } from "../../../redux/slices/user-slice";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

interface ProfilePostListProps {
  showCreatedPosts: boolean;
}

const ProfilePostList = ({ showCreatedPosts }: ProfilePostListProps) => {
  const dispatch = useAppDispatch();

  const userState = useAppSelector((state) => state.user);
  const posts = useAppSelector((state) => {
    return state.user.posts;
  });

  useEffect(() => {
    //TODO get upvoted posts if !showCreatedPosts
    dispatch(getPostsByUser(userState));
  }, [showCreatedPosts]);

  return (
    <StyledContainer>
      {posts.slice(0, Math.min(2, posts.length)).map((post, i) => (
        <PostListItem key={post._id} post={post} index={i} bodyLimit={100} />
      ))}
    </StyledContainer>
  );
};

export default ProfilePostList;
