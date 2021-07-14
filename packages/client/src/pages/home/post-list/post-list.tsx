import React, { useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import PostListItem from "./post-list-item";
import {
  getPosts,
  getPostsByFilter,
  PostSortType,
} from "../../../redux/slices/post-slice";
import { Location } from "../../../redux/slices/location-slice";

interface PostListProps {
  location: Location;
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 10vw;
`;

// TODO rename file to component name?
const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.location);
  const postState = useAppSelector((state) => state.post);

  const posts = useAppSelector((state) => {
    // TODO make a custom selector / decide how post sorting will work
    const result = [...state.post.posts];
    switch (state.post.sortType) {
      case PostSortType.NEW:
        result.sort(
          (p1, p2) => new Date(p2.date).getTime() - new Date(p1.date).getTime(),
        );
        break;
      case PostSortType.POPULAR:
        result.sort((p1, p2) => p2.numUpvotes - p1.numUpvotes);
        break;
      default:
        console.log("damn wtf");
    }

    return result;
  });

  useEffect(() => {
    dispatch(getPostsByFilter(postState));
  }, [dispatch]);

  return (
    <StyledContainer>
      {posts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </StyledContainer>
  );
};

export default PostList;
