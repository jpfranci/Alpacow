import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  ClickAwayListener,
  MenuItem,
  Grow,
  Paper,
  Popper,
  MenuList,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import styled from "styled-components";
import ProfileDialog from "./profile-dialog";
import { useAppDispatch } from "../../../redux/store";
import { logout } from "../../../redux/slices/user-slice";

const ButtonContainer = styled(Button)`
  text-transform: none;
`;

const ProfileButton = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const dispatch = useAppDispatch();

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
                  <MenuItem onClick={handleViewAccount}>My account</MenuItem>
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <ProfileDialog
        open={profileModalOpen}
        onClose={handleProfileModalClose}
      />
    </div>
  );
};

export default ProfileButton;
