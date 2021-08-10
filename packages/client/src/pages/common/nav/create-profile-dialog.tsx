import React, { useState } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  PropTypes,
  TextField,
} from "@material-ui/core";
import styled from "styled-components";
import { useAppDispatch } from "../../../redux/store";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { signup } from "../../../redux/slices/user-slice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Variant } from "@material-ui/core/styles/createTypography";
import ActionableError from "../../../errors/actionable-error";
import SignupErrorCode from "../../../errors/signup-errors";
import userService from "../../../services/users";

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      margin: "1.4rem",
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
  open: boolean;
  onClose: () => any;
}

interface ProfileState {
  username: string;
  password: string;
  email: string;
  showPassword: boolean;
}

interface ProfileErrors {
  username: string;
  password: string;
  email: string;
  showPassword: string;
}

const DEFAULT_ERRORS: ProfileErrors = {
  username: "",
  password: "",
  email: "",
  showPassword: "",
};

const InputFieldProps = {
  fullWidth: true,
  margin: "normal" as PropTypes.Margin,
};

const StyledContainer = styled.div`
  margin: 1.1rem;
`;

// TODO: form validation, Firebase hookup
const CreateProfileDialog = ({ open, onClose }: CreateDialogProps) => {
  const classes = useStyles();
  const [values, setValues] = useState<ProfileState>(DEFAULT_FIELDS);
  const [errors, setErrors] = useState<ProfileErrors>(DEFAULT_ERRORS);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setValues(DEFAULT_FIELDS);
    onClose();
  };

  const handleSignUp = async () => {
    try {
      const { username, email } = values;
      const validationResult = await userService.validate({
        username,
        email,
      });
      let isValid = true;
      if (validationResult.emailExists) {
        setErrors({ ...errors, email: "The email already exists" });
        isValid = false;
      }

      if (validationResult.usernameExists) {
        setErrors({ ...errors, username: "The username already exists" });
        isValid = false;
      }

      if (isValid) {
        const dispatchedAction = await dispatch(
          signup({
            username: values.username,
            password: values.password,
            email: values.email,
          }),
        );
        unwrapResult(dispatchedAction);
        handleClose();
      }
    } catch (err) {
      if (err instanceof ActionableError) {
        switch (err.errorCode) {
          case SignupErrorCode.DUPLICATE_EMAIL:
          case SignupErrorCode.INVALID_EMAIL:
            setErrors({ ...errors, email: err.message });
            break;
          case SignupErrorCode.DUPLICATE_USERNAME:
            setErrors({ ...errors, username: err.message });
            break;
          case SignupErrorCode.WEAK_PASSWORD:
            setErrors({ ...errors, password: err.message });
        }
      } else {
        alert(
          "There was an unexpected error while signing up, please try again",
        );
      }
    }
  };

  const handleChange =
    (prop: keyof ProfileState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: Do validation on field
      setErrors({ ...errors, [prop]: "" });
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
    <Dialog
      onBackdropClick={handleClose}
      open={open}
      scroll="body"
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Sign up for Alpacow ✍️</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>Create your Alpacow account.</DialogContentText>
        <DialogContentText variant={"textSecondary" as Variant}>
          Remember, your username represents how others see you on Alpacow.
        </DialogContentText>
        <StyledContainer>
          <TextField
            id="new-user-email"
            label={errors.email ? errors.email : "Email"}
            value={values.email}
            onChange={handleChange("email")}
            required
            error={!!errors.email}
            autoFocus
            variant="standard"
            {...InputFieldProps}
          />
          <TextField
            id="new-user-username"
            label={errors.username ? errors.username : "Username"}
            value={values.username}
            onChange={handleChange("username")}
            required
            error={!!errors.username}
            variant="standard"
            {...InputFieldProps}
          />
          <FormControl {...InputFieldProps}>
            <InputLabel htmlFor="adornment-password" error={!!errors.password}>
              {errors.password ? errors.password : "Password"}
            </InputLabel>
            <Input
              id="new-user-password"
              error={!!errors.password}
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
          <FormControl {...InputFieldProps}>
            <InputLabel htmlFor="adornment-password">
              Confirm Password
            </InputLabel>
            <Input
              id="new-user-confirm-password"
              type={values.showPassword ? "text" : "password"}
              // TODO: confirm password onChange
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
        </StyledContainer>
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
