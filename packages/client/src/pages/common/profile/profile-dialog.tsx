import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Paper,
} from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import ProfilePostList from "./profile-post-list";
import { LoaderContainer } from "../../post/post";
import { Link as RouterLink } from "react-router-dom";
import { PROFILE_PAGE } from "../../../common/links";
import { initialState, refreshUser } from "../../../redux/slices/user-slice";
import userService from "../../../services/users";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => any;
  userId: string;
}

const StyledPaper = styled(Paper)`
  border-radius: 1rem;
`;

const StyledRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledRowContainerNoSpace = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledInnerRowContainer = styled.div`
  align-items: center;
`;

const StyledColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledUsername = styled.a`
  font-weight: 600;
`;

const StyledTitle = styled.span`
  display: table-cell;
  vertical-align: middle;
  font-size: 1.5em;
`;

const StyledSpinner = styled(LoaderContainer)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const ProfileDialog = ({ open, onClose, userId }: ProfileDialogProps) => {
  const [showCreatedPosts, setShowCreatedPosts] = useState(true);
  const [user, setUser] = useState(initialState);
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const isCurrentUser = !!user._id && userState._id === user._id;

  const handleClose = () => {
    onClose();
    setUser(initialState);
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    showRecent: boolean,
  ) => {
    setShowCreatedPosts(showRecent);
  };

  const fieldStyle = { margin: "0.5rem 0rem", color: "#595959" };
  const getUserProfile = async () => {
    try {
      if (!isCurrentUser) {
        const userProfile = await userService.getUserProfile(userId);
        setUser(userProfile);
      } else {
        const result = await dispatch(refreshUser());
        const user = unwrapResult(result);
        setUser(user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [user._id]);

  if (!user.username) {
    return (
      <Dialog
        open={open}
        fullScreen={true}
        onBackdropClick={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}>
        <StyledSpinner>
          <CircularProgress />
        </StyledSpinner>
      </Dialog>
    );
  }

  return (
    <Dialog
      onBackdropClick={handleClose}
      PaperComponent={StyledPaper}
      open={open}
      scroll="body"
      aria-labelledby="form-dialog-title"
      fullWidth>
      <DialogTitle id="form-dialog-title">
        <StyledRowContainer>
          <StyledInnerRowContainer>
            <StyledTitle>
              <StyledUsername>{user.username}'s </StyledUsername> profile
            </StyledTitle>
          </StyledInnerRowContainer>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </StyledRowContainer>
        {isCurrentUser ? (
          <DialogContentText style={fieldStyle}>
            <StyledUsername>Email: </StyledUsername>
            {user.email}
          </DialogContentText>
        ) : null}
        <StyledRowContainerNoSpace>
          <DialogContentText style={fieldStyle}>
            <StyledUsername>Reputation: 🔥</StyledUsername>
            {user.reputation}
          </DialogContentText>
        </StyledRowContainerNoSpace>
      </DialogTitle>
      <DialogContent>
        <StyledRowContainer>
          <StyledColumnContainer>
            <ToggleButtonGroup
              size="small"
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
          </StyledColumnContainer>
        </StyledRowContainer>
        <ProfilePostList
          showCreatedPosts={showCreatedPosts}
          handleClose={handleClose}
          maxSize={2}
          user={user}
          onVote={getUserProfile}
        />
      </DialogContent>
      <DialogActions style={{ margin: "0.5rem" }}>
        {isCurrentUser ? (
          <Link component={RouterLink} to={PROFILE_PAGE}>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              See full profile
            </Button>
          </Link>
        ) : (
          <Link component={RouterLink} to={`/user/${user._id}`}>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              See full profile
            </Button>
          </Link>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
