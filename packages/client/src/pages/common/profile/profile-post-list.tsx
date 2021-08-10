import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostListItem, {
  VoteUpdateParams,
} from "../../home/post-list/post-list-item";
import { UserState } from "../../../redux/slices/user-slice";
import userService from "../../../services/users";
import { Post } from "../../../redux/slices/post-slice";
import { useAppSelector } from "../../../redux/store";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

interface ProfilePostListProps {
  showCreatedPosts: boolean;
  handleClose: any;
  maxSize: number;
  user: UserState;
}

const ProfilePostList = ({
  showCreatedPosts,
  handleClose,
  maxSize,
  user,
}: ProfilePostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const postsState = useAppSelector((state) => {
    return state.post.posts;
  });

  const fetchPostsForUser = async () => {
    const fetchedPosts = await userService.getPostsByUser(
      String(user._id),
      "new",
    );
    setPosts(fetchedPosts);
  };

  const fetchPostsVotedByUser = async () => {
    const fetchedPosts = await userService.getPostsByUserVote(
      String(user._id),
      true,
    );
    setPosts(fetchedPosts);
  };

  const handleVote = (params: VoteUpdateParams) => {
    const postToUpdate = posts.find(
      (foundPost) => foundPost._id === params.post._id,
    );
    if (postToUpdate) {
      // we update both in case user is upvoting a post that they previously downvoted
      if (params.isUpvote) {
        if (params.otherVoteDisabled) {
          postToUpdate.numUpvotes = params.post.numUpvotes + 2;
        } else {
          postToUpdate.numUpvotes = params.post.numUpvotes + 1;
        }
      } else {
        if (params.otherVoteDisabled) {
          postToUpdate.numDownvotes = params.post.numDownvotes + 2;
        } else {
          postToUpdate.numDownvotes = params.post.numDownvotes + 1;
        }
      }
    }
  };

  useEffect(() => {
    showCreatedPosts ? fetchPostsForUser() : fetchPostsVotedByUser();
  }, [showCreatedPosts, postsState]);

  return (
    <StyledContainer>
      {posts.slice(0, Math.min(maxSize, posts.length)).map((post, i) => (
        <PostListItem
          postClickCallback={handleClose}
          voteClickCallback={handleVote}
          key={post._id}
          post={post}
          index={i}
          showPostBody={false}
        />
      ))}
    </StyledContainer>
  );
};

export default ProfilePostList;
