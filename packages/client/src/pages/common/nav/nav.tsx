import React from "react";
import { AppBar, Toolbar, Typography, Button,ButtonBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  iconContainer: {
    flexGrow: 1,
  },
  profileButton: {
    textTransform: "none",
  }
}));

const NavBar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <ButtonBase>
          <Typography variant="h6">Alpacow</Typography>
        </ButtonBase>
        <div className={classes.iconContainer}>
          <ButtonBase className={classes.menuButton}>
            <img src="./logo.png" alt="official alpacow logo" width={75} height={45}/>
          </ButtonBase>
        </div>
        <Button color="inherit" className={classes.profileButton}>
          JoshBrown
          <ArrowDropDownIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
