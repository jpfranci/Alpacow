import React, { useState } from "react";
import styled from "styled-components";
import { HOME_PAGE } from "../../common/links";
import { useAppSelector } from "../../redux/store";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import ProfilePostList from "../common/profile/profile-post-list";
import EditProfileDialog from "./edit-profile-dialog";

const StyledTopContainer = styled.div`
  margin: 7.5vh 14vw;
`;

const StyledProfileContainer = styled.div`
  margin: 2vh 0;
  padding: 3vh;
  border: 2px solid #000;
  border-radius: 2rem;
  min-width: 220px;
`;

const StyledColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EditButton = styled(Button)`
  margin-left: 1.5em;
`;

const StyledText = styled.text`
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

const StyledPostContainer = styled.div`
  min-width: 300;
`;

const ProfilePage = () => {
  const [editProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
  const [showCreatedPosts, setShowCreatedPosts] = useState(true);
  const userState = useAppSelector((state) => state.user);

  const handleEditProfileModalOpen = () => {
    setEditProfileModalOpen((prevOpen) => !prevOpen);
  };

  const handleEditProfileModalClose = () => {
    setEditProfileModalOpen(false);
  };

  const handleClose = () => {
    setEditProfileModalOpen(false);
  };
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

            <EditButton
              variant="outlined"
              color="primary"
              onClick={handleEditProfileModalOpen}>
              Edit
            </EditButton>
            <EditProfileDialog
              open={editProfileModalOpen}
              onClose={handleEditProfileModalClose}
              username={userState.username}
              email={userState.email}
            />
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
        <text style={{ fontSize: "1.5rem", margin: "1.2rem 0", ...fieldColor }}>
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
        <Button variant="outlined" color="primary">
          Back to home page
        </Button>
      </Link>
    </StyledTopContainer>
  );
};

export default ProfilePage;
