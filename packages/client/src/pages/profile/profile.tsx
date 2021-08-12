import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HOME_PAGE, OTHER_USER_PAGE } from "../../common/links";
import { useRouteMatch } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import ProfilePostList from "../common/profile/profile-post-list";
import EditProfileDialog from "./edit-profile-dialog";
import userService from "../../services/users";
import CircularProgress from "@material-ui/core/CircularProgress";
import { LoaderContainer } from "../post/post";
import { initialState, refreshUser } from "../../redux/slices/user-slice";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";

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
  const [isLoading, setIsLoading] = useState(true);
  const [editProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
  const [showCreatedPosts, setShowCreatedPosts] = useState(true);
  const [user, setUser] = useState(initialState);
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const match = useRouteMatch<{ id: string }>(OTHER_USER_PAGE);
  const isCurrentUser = !match?.params?.id;
  const userToUse = isCurrentUser ? userState : user;

  const getUserProfile = async () => {
    try {
      setIsLoading(true);
      if (match && match.params.id) {
        const userProfile = await userService.getUserProfile(match.params.id);
        setUser(userProfile);
      } else {
        const result = await dispatch(refreshUser());
        unwrapResult(result);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

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
    <span>
      {userToUse._id ? (
        <StyledTopContainer>
          <StyledProfileContainer>
            <StyledColumnContainer>
              <StyledRowContainer>
                <h1 style={fieldColor}>{userToUse.username}'s profile</h1>
                {isCurrentUser ? (
                  <span>
                    <EditButton
                      variant="outlined"
                      color="primary"
                      onClick={handleEditProfileModalOpen}>
                      Edit
                    </EditButton>
                    <EditProfileDialog
                      open={editProfileModalOpen}
                      onClose={handleEditProfileModalClose}
                      username={userToUse.username}
                      email={userToUse.email}
                    />
                  </span>
                ) : null}
              </StyledRowContainer>

              {userToUse.email && (
                <StyledColumnContainer>
                  <StyledText>Email Address</StyledText>
                  <text style={fieldColor}>{userToUse.email}</text>
                </StyledColumnContainer>
              )}

              <StyledColumnContainer>
                <StyledText>Username </StyledText>
                <text style={fieldColor}>{userToUse.username}</text>
              </StyledColumnContainer>

              <StyledText>Reputation: 🔥 {userToUse.reputation}</StyledText>
            </StyledColumnContainer>
          </StyledProfileContainer>

          <StyledColumnContainer>
            <text
              style={{ fontSize: "1.5rem", margin: "1.2rem 0", ...fieldColor }}>
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
                maxSize={Infinity}
                user={userToUse}
                onVote={getUserProfile}
              />
            </StyledPostContainer>
          </StyledColumnContainer>

          <Link component={RouterLink} to={HOME_PAGE}>
            <Button variant="outlined" color="primary">
              Back to home page
            </Button>
          </Link>
        </StyledTopContainer>
      ) : isLoading ? (
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      ) : (
        <div>This user doesn't exist...</div>
      )}
    </span>
  );
};

export default ProfilePage;
