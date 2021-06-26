import React, { useState } from "react";
import {
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  TextField,
} from "@material-ui/core";
import styled from "styled-components";
import TagSearch from "../../home/action-group/tag-search";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { createPost } from "../../../redux/slices/post-slice";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { signup } from "../../../redux/slices/user-slice";
import { unwrapResult } from "@reduxjs/toolkit";

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      overflow: "hidden",
      margin: "10px",
    },
    label: {
      textTransform: "capitalize",
      color: "gray",
    },
  }),
);

const DEFAULT_FIELDS = {
  username: "",
  password: "",
  email: "",
  showPassword: false,
};

interface CreateDialogProps {
  width?: string;
  open: boolean;
  onClose: () => any;
}

interface ProfileState {
  username: string;
  password: string;
  email: string;
  showPassword: boolean;
}

const CreateProfileDialog = ({
  width = "66%",
  open,
  onClose,
}: CreateDialogProps) => {
  const classes = useStyles();
  const [values, setValues] = React.useState<ProfileState>(DEFAULT_FIELDS);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setValues(DEFAULT_FIELDS);
    onClose();
  };

  const handleSignUp = () => {
    dispatch(
      signup({
        username: values.username,
        password: values.password,
        email: values.email,
      }),
    ).then(unwrapResult);
    // .then((data) => alert("Signup succeeded!"))
    // .catch((error) => alert("Signup failed."));
    handleClose();
  };

  const handleChange =
    (prop: keyof ProfileState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Sign up for Alpacow ✍️</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          Create your Alpacow account. {<br />}
          Keep in mind, your username represents how others see you on Alpacow.
        </DialogContentText>
        <TextField
          id="new-user-email"
          label="Email"
          // TODO: Make this style reusable between these elements? (I don't know how I should do it yet)
          style={{ width }}
          value={values.email}
          onChange={handleChange("email")}
          required
          autoFocus
        />
        <br />
        <TextField
          id="new-user-username"
          label="Username"
          style={{ width }}
          value={values.username}
          onChange={handleChange("username")}
        />
        <br />
        <FormControl style={{ width }}>
          <InputLabel htmlFor="adornment-password">Password</InputLabel>
          <Input
            id="new-user-password"
            type={values.showPassword ? "text" : "password"}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}>
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </DialogContent>
      <DialogActions style={{ margin: "10px" }}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSignUp} variant="contained" color="primary">
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProfileDialog;
