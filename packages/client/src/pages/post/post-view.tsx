import React from "react";
import styled from "styled-components";
import { Post } from "../../redux/slices/post-slice";

const PostViewContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyText = styled.p`
  line-height: 1.6;
`;

interface PostViewProps {
  post: Post;
}

const PostView: React.FC<PostViewProps> = ({ post }) => {
  return (
    <PostViewContainer>
      <PostContent>
        <h3>{post.title}</h3>
        <BodyText>{post.body}</BodyText>
      </PostContent>
    </PostViewContainer>
  );
};

export default PostView;
