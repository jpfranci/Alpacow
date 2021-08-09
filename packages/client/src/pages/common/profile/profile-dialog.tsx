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
import { useAppSelector } from "../../../redux/store";
import CloseIcon from "@material-ui/icons/Close";
import ProfilePostList from "./profile-post-list";
import { Link as RouterLink } from "react-router-dom";
import { PROFILE_PAGE } from "../../../common/links";
import { initialState } from "../../../redux/slices/user-slice";
import userService from "../../../services/users";

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

const ProfileDialog = ({ open, onClose, userId }: ProfileDialogProps) => {
  const [showCreatedPosts, setShowCreatedPosts] = useState(true);
  const [user, setUser] = useState(initialState);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    showRecent: boolean,
  ) => {
    setShowCreatedPosts(showRecent);
  };

  const fieldStyle = { margin: "0.5rem 0rem", color: "#595959" };

  useEffect(() => {
    const getUserProfile = async () => {
      const userProfile = await userService.getUserProfile(userId);
      setUser(userProfile);
    };
    getUserProfile();
  }, []);

  if (!user.username) {
    return <span></span>;
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
        <DialogContentText style={fieldStyle}>
          <StyledUsername>Email: </StyledUsername>
          {user.email}
        </DialogContentText>
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
        />
      </DialogContent>
      <DialogActions style={{ margin: "0.5rem" }}>
        <Link component={RouterLink} to={PROFILE_PAGE}>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            See full profile
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
