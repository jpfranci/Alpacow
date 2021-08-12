import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostListItem, {
  VoteUpdateParams,
} from "../../home/post-list/post-list-item";
import { UserState } from "../../../redux/slices/user-slice";
import userService from "../../../services/users";
import { Post } from "../../../redux/slices/post-slice";
import { useAppSelector } from "../../../redux/store";
import { on } from "cluster";

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
  onVote?: () => any;
}

const ProfilePostList = ({
  showCreatedPosts,
  handleClose,
  maxSize,
  user,
  onVote,
}: ProfilePostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [updateVote, setUpdateVote] = useState(false);

  const currentUserState = useAppSelector((state) => {
    return state.user;
  });

  const fetchPostsForUser = async () => {
    const fetchedPosts = await userService.getPostsByUser(
      String(user._id),
      currentUserState._id as string,
      "new",
    );
    setPosts(fetchedPosts);
  };

  const fetchPostsVotedByUser = async () => {
    const fetchedPosts = await userService.getPostsByUserVote(
      String(user._id),
      currentUserState._id as string,
      true,
    );
    setPosts(fetchedPosts);
  };

  const handleVote = (params: VoteUpdateParams) => {
    setUpdateVote(!updateVote);
    if (onVote) {
      onVote();
    }
  };

  useEffect(() => {
    showCreatedPosts ? fetchPostsForUser() : fetchPostsVotedByUser();
  }, [showCreatedPosts, updateVote]);

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
