import React, { Dispatch, SetStateAction, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonBase,
  Link,
} from "@material-ui/core";
import { useAppSelector } from "../../../redux/store";
import ProfileButton from "../profile/profile-button";
import CreateProfileDialog from "./create-profile-dialog";
import LoginDialog from "./login-dialog";
import { Link as RouterLink } from "react-router-dom";
import { HOME_PAGE } from "../../../common/links";
import styled from "styled-components";
import LogoSVG from "../../../static/Alpacow-logo.svg";

const StyledMenuButton = styled(Button)`
  margin-right: 0.5em;
  margin-left: 0.5em;
`;

const StyledIconContainer = styled.div`
  flex-grow: 1;
  margin-left: -0.5em;
`;

const StyledRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const profileOptions = (
  user: any,
  setSignUpModalOpen: any,
  setLoginModalOpen: any,
) => {
  if (user._id) {
    return <ProfileButton username={user.username} />;
  } else {
    return (
      <StyledRowContainer>
        <ProfileButton username={undefined} />
        <StyledMenuButton
          variant="outlined"
          color="inherit"
          onClick={() => setLoginModalOpen(true)}>
          Login
        </StyledMenuButton>
        <StyledMenuButton
          variant="outlined"
          color="inherit"
          onClick={() => setSignUpModalOpen(true)}>
          Sign up
        </StyledMenuButton>
      </StyledRowContainer>
    );
  }
};

const NavBar = () => {
  const [signUpModalOpen, setSignUpModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);

  const [loginModalOpen, setLoginModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);

  const handleSignUpModalClose = () => {
    setSignUpModalOpen(false);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const user = useAppSelector((state: any) => state.user);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <ButtonBase>
          <Typography variant="h6">
            <Link component={RouterLink} to={HOME_PAGE} color="inherit">
              Alpacow
            </Link>
          </Typography>
        </ButtonBase>
        <StyledIconContainer>
          <StyledMenuButton>
            <img src={LogoSVG} alt="official alpacow logo" height={45} />
          </StyledMenuButton>
        </StyledIconContainer>
        {profileOptions(user, setSignUpModalOpen, setLoginModalOpen)}
        <LoginDialog open={loginModalOpen} onClose={handleLoginModalClose} />
        <CreateProfileDialog
          open={signUpModalOpen}
          onClose={handleSignUpModalClose}
        />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
