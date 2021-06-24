import React, { Dispatch, SetStateAction, useState } from "react";
import PostDialog from "../../home/action-group/post-dialog";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAppSelector } from "../../../redux/store";
import ProfileButton from "./profile-button";

// Using mui theme for consistent spacing
const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
  },
  iconContainer: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing(2),
  },
}));

function profileOptions(user: any, classes: any, setModalOpen: any) {
  if (true) {
    return (<ProfileButton username={"mr_clean_mustache"}/>);
  } else {
    return (
      <div>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => setModalOpen(true)}>
          Login
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          className={classes.menuButton}
          onClick={() => setModalOpen(true)}>
          Sign up
        </Button>
      </div>
    );
  }
}

const NavBar = () => {
  const [modalOpen, setModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const user = useAppSelector((state: any) => state.user);
  const classes = useStyles();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <ButtonBase>
          <Typography variant="h6">Alpacow</Typography>
        </ButtonBase>
        <div className={classes.iconContainer}>
          <ButtonBase className={classes.menuButton}>
            <img
              src="./logo.png"
              alt="official alpacow logo"
              width={75}
              height={45}
            />
          </ButtonBase>
        </div>
        {profileOptions(user, classes, setModalOpen)}
        {/* TODO: REPLACE THE POSTDIALOG WITH "CREATE PROFILE" DIALOG */}
        <PostDialog open={modalOpen} onClose={handleModalClose} />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
