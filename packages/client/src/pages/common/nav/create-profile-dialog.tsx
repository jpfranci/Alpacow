// @ts-ignore
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
import { toast } from "react-toastify";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useForm, Controller } from "react-hook-form";

const StyledErrorMessage = styled.span`
  color: red;
`;

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
  confirmPassword: "",
};

interface CreateDialogProps {
  open: boolean;
  onClose: () => any;
}

const InputFieldProps = {
  fullWidth: true,
  margin: "normal" as PropTypes.Margin,
};

const StyledContainer = styled.div`
  margin: 1.1rem;
`;

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  username: Joi.string().required(),
});

// TODO: form validation, Firebase hookup
const CreateProfileDialog = ({ open, onClose }: CreateDialogProps) => {
  const classes = useStyles();
  const {
    setValue,
    control,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm({
    mode: "onBlur",
    resolver: joiResolver(validationSchema),
    defaultValues: DEFAULT_FIELDS,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    Object.keys(DEFAULT_FIELDS).forEach((field) => {
      // @ts-ignore
      setValue(field, DEFAULT_FIELDS[field], { shouldValidate: false });
    });
    setShowPassword(false);
    onClose();
  };

  const handleSignUp = async ({ username, email, password }) => {
    try {
      let isValid = true;
      const validationResult = await userService.validate({
        username,
        email,
      });
      if (validationResult.emailExists) {
        setError("email", {
          type: "manual",
          message: "The email already exists",
        });
        isValid = false;
      }

      if (validationResult.usernameExists) {
        setError("username", {
          type: "manual",
          message: "The username already exists",
        });
        isValid = false;
      }
      if (isValid) {
        const dispatchedAction = await dispatch(
          signup({
            username: username,
            password: password,
            email: email,
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
            setError("email", {
              type: "manual",
              message: err.message,
            });
            break;
          case SignupErrorCode.DUPLICATE_USERNAME:
            setError("username", {
              type: "manual",
              message: err.message,
            });
            break;
          case SignupErrorCode.WEAK_PASSWORD:
            setError("password", {
              type: "manual",
              message: err.message,
            });
            break;
        }
      } else {
        toast.error(
          "There was an unexpected error while signing up, please try again",
        );
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} scroll="body" aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Sign up for Alpacow ✍️</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>Create your Alpacow account.</DialogContentText>
        <DialogContentText variant={"textSecondary" as Variant}>
          Remember, your username represents how others see you on Alpacow.
        </DialogContentText>
        <StyledContainer>
          <Controller
            control={control}
            render={({ field }) => (
              <TextField
                id="new-user-email"
                label={"Email"}
                required
                error={!!errors.email}
                variant="standard"
                {...InputFieldProps}
                {...field}
              />
            )}
            name="email"
          />
          {errors.email && (
            <StyledErrorMessage>{errors.email.message}</StyledErrorMessage>
          )}
          <Controller
            control={control}
            render={({ field }) => (
              <TextField
                id="new-user-username"
                label={"Username"}
                required
                error={!!errors.username}
                variant="standard"
                {...InputFieldProps}
                {...field}
              />
            )}
            name="username"
          />
          {errors.username && (
            <StyledErrorMessage>{errors.username.message}</StyledErrorMessage>
          )}
          <Controller
            control={control}
            render={({ field }) => (
              <FormControl {...InputFieldProps}>
                <InputLabel
                  htmlFor="adornment-password"
                  error={!!errors.password}>
                  {"Password"}
                </InputLabel>
                <Input
                  id="new-user-password"
                  error={!!errors.password}
                  {...field}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {errors.password && (
                  <StyledErrorMessage>
                    {errors.password.message}
                  </StyledErrorMessage>
                )}
              </FormControl>
            )}
            name="password"
          />
          <Controller
            control={control}
            render={({ field }) => (
              <FormControl {...InputFieldProps}>
                <InputLabel htmlFor="adornment-password">
                  Confirm Password
                </InputLabel>
                <Input
                  id="new-user-confirm-password"
                  type={showPassword ? "text" : "password"}
                  {...field}
                  // TODO: confirm password onChange
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {errors.confirmPassword && (
                  <StyledErrorMessage>
                    Confirm password must be the same as password
                  </StyledErrorMessage>
                )}
              </FormControl>
            )}
            name="confirmPassword"
          />
        </StyledContainer>
      </DialogContent>
      <DialogActions style={{ margin: "10px" }}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleSignUp)}
          variant="contained"
          color="primary">
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProfileDialog;
