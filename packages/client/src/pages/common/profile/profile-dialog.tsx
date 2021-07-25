import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
} from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import styled from "styled-components";
import { useAppSelector } from "../../../redux/store";
import CloseIcon from "@material-ui/icons/Close";
import ProfilePostList from "./profile-post-list";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => any;
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

const ProfileDialog = ({ open, onClose }: ProfileDialogProps) => {
  const [showCreatedPosts, setShowCreatedPosts] = useState(true);
  const userState = useAppSelector((state) => state.user);

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
              <StyledUsername>{userState.username}'s </StyledUsername> profile
            </StyledTitle>
          </StyledInnerRowContainer>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </StyledRowContainer>
        <DialogContentText style={fieldStyle}>
          <StyledUsername>Email: </StyledUsername>
          {userState.email}
        </DialogContentText>
        <StyledRowContainerNoSpace>
          <DialogContentText style={fieldStyle}>
            <StyledUsername>Reputation: 🔥</StyledUsername>
            {userState.reputation}
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
            <ProfilePostList showCreatedPosts={showCreatedPosts} />
          </StyledColumnContainer>
        </StyledRowContainer>
      </DialogContent>
      <DialogActions style={{ margin: "0.5rem" }}>
        <Button variant="outlined" color="primary">
          See all
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
