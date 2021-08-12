import React, { useState } from "react";
import {
  Button,
  ClickAwayListener,
  FormControlLabel,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Switch,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import styled from "styled-components";
import ProfileDialog from "./profile-dialog";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { logout } from "../../../redux/slices/user-slice";
import { useHistory } from "react-router-dom";
import { HOME_PAGE } from "../../../common/links";
import { setShowMatureContent } from "../../../redux/slices/post-slice";

const ButtonContainer = styled(Button)`
  text-transform: none;
  min-width: 1em;
  margin-right: 1em;
`;

const StyledSwitch = styled(Switch)`
  width: 3.5em;
  margin-right: 1em;
`;

const ProfileButton = (props: any) => {
  const anchorRef = React.useRef(null);
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const isMature = useAppSelector((state: any) => state.post.showMatureContent);

  const [open, setOpen] = React.useState(false);

  let history = useHistory();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  const handleViewAccount = () => {
    setProfileModalOpen(true);
    handleClose();
  };

  const handleLogOut = () => {
    dispatch(logout());
    setOpen(false);
    history.push(HOME_PAGE);
  };

  const showProfileDialog = () => {
    if (profileModalOpen) {
      return (
        <ProfileDialog
          open={profileModalOpen}
          onClose={handleProfileModalClose}
          userId={userState._id as string}
        />
      );
    } else {
      return null;
    }
  };

  const handleSetShowMatureContent = () => {
    dispatch(setShowMatureContent(!isMature));
  };

  function handleListKeyDown(event: any) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div>
      <ButtonContainer
        color="inherit"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}>
        {props.username}
        <ArrowDropDownIcon />
      </ButtonContainer>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}>
                  <FormControlLabel
                    control={
                      <StyledSwitch
                        checked={isMature}
                        onChange={handleSetShowMatureContent}
                        color={"primary"}
                      />
                    }
                    label="Show mature content"
                    labelPlacement={"start"}
                  />
                  {props.username ? (
                    <div>
                      <MenuItem onClick={handleViewAccount}>
                        My account
                      </MenuItem>
                      <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                    </div>
                  ) : null}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      {showProfileDialog()}
    </div>
  );
};

export default ProfileButton;
