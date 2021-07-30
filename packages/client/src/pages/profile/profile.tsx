import React, { useState } from "react";
import styled from "styled-components";
import { HOME_PAGE } from "../../common/links";
import { Post } from "../../redux/slices/post-slice";
import { useAppSelector } from "../../redux/store";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import ProfilePostList from "../common/profile/profile-post-list";

const StyledTopContainer = styled.div`
  margin: 7.5vh 14vw;
`;

const StyledProfileContainer = styled.div`
  margin: 2vh 0vw;
  padding: 3vh;
  border: 2px solid #000;
  border-radius: 2rem;
  min-width: 220px;
  width: 40%;
`;

const StyledColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledButton = styled(Button)`
  margin-top: 0.5rem;
`;

const StyledText = styled.text`
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

const StyledPostContainer = styled.div`
  width: 42%;
  min-width: 300;
`;

const ProfilePage = () => {
  const [showCreatedPosts, setShowCreatedPosts] = useState(true);
  const [serverPost, setServerPost] = useState<Post | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const userState = useAppSelector((state) => state.user);

  const handleClose = () => {};

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    showRecent: boolean,
  ) => {
    setShowCreatedPosts(showRecent);
  };

  const fieldColor = { color: "#595959" };

  return (
    <StyledTopContainer>
      <StyledProfileContainer>
        <StyledColumnContainer>
          <StyledRowContainer>
            <h1 style={fieldColor}>{userState.username}'s profile</h1>

            <StyledButton variant="outlined" color="primary">
              Edit
            </StyledButton>
          </StyledRowContainer>

          <StyledColumnContainer>
            <StyledText>Email Address</StyledText>
            <text style={fieldColor}>{userState.email}</text>
          </StyledColumnContainer>

          <StyledColumnContainer>
            <StyledText>Username </StyledText>
            <text style={fieldColor}>{userState.username}</text>
          </StyledColumnContainer>

          <StyledText>Reputation: 🔥 {userState.reputation}</StyledText>
        </StyledColumnContainer>
      </StyledProfileContainer>

      <StyledColumnContainer>
        <text
          style={{ fontSize: "1.5rem", margin: "1.2rem 0px", ...fieldColor }}>
          Posts
        </text>
        <ToggleButtonGroup
          size="large"
          aria-label="outlined primary button group"
          exclusive
          onChange={handleChange}>
          <ToggleButton
            value={true}
            color="primary"
            selected={showCreatedPosts}>
            Created
          </ToggleButton>
          <ToggleButton
            value={false}
            color="primary"
            selected={!showCreatedPosts}>
            Upvoted
          </ToggleButton>
        </ToggleButtonGroup>

        <StyledPostContainer>
          <ProfilePostList
            showCreatedPosts={showCreatedPosts}
            handleClose={handleClose}
            maxSize={10}
            user={userState}
          />
        </StyledPostContainer>
      </StyledColumnContainer>

      <Link component={RouterLink} to={HOME_PAGE}>
        <StyledButton variant="outlined" color="primary">
          Back to home page
        </StyledButton>
      </Link>
    </StyledTopContainer>
  );
};

export default ProfilePage;
