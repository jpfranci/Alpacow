import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostListItem, {
  VoteUpdateParams,
} from "../../home/post-list/post-list-item";
import { UserState } from "../../../redux/slices/user-slice";
import userService from "../../../services/users";
import { Post, PostSortType } from "../../../redux/slices/post-slice";
import { useAppSelector } from "../../../redux/store";
import CircularProgress from "@material-ui/core/CircularProgress";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const StyledSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
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
  const [isLoading, setIsLoading] = useState(false);
  const [updateVote, setUpdateVote] = useState(false);
  const showMatureContent = useAppSelector(
    (state) => state.post.showMatureContent,
  );

  const fetchPostsForUser = async () => {
    const fetchedPosts = await userService.getPostsByUser({
      id: user._id as string,
      sortType: PostSortType.NEW,
      showMatureContent: !!showMatureContent,
    });
    setPosts(fetchedPosts);
  };

  const fetchPostsVotedByUser = async () => {
    const fetchedPosts = await userService.getPostsByUserVote({
      id: user._id as string,
      sortType: PostSortType.NEW,
      isUpvoted: true,
      showMatureContent: !!showMatureContent,
    });
    setPosts(fetchedPosts);
  };

  const handleVote = (params: VoteUpdateParams) => {
    setUpdateVote(!updateVote);
    if (onVote) {
      onVote();
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        showCreatedPosts
          ? await fetchPostsForUser()
          : await fetchPostsVotedByUser();
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, [showCreatedPosts, updateVote, showMatureContent]);

  if (isLoading) {
    return (
      <StyledSpinnerContainer>
        <CircularProgress />
      </StyledSpinnerContainer>
    );
  }

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
