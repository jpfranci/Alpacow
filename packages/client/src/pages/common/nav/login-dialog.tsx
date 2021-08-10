import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
} from "@material-ui/core";
import styled from "styled-components";
import { useAppDispatch } from "../../../redux/store";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { login } from "../../../redux/slices/user-slice";
import { unwrapResult } from "@reduxjs/toolkit";
import CloseIcon from "@material-ui/icons/Close";
import LogoSVG from "../../../static/Alpacow-logo.svg";
import { toast } from "react-toastify";
import Joi from "joi";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import LoginErrorCode from "../../../errors/login-errors";

const DEFAULT_FIELDS = {
  email: "",
  password: "",
};

const StyledErrorMessage = styled.span`
  color: red;
  margin-bottom: 1em;
`;

interface LoginDialogProps {
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

const StyledColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledButton = styled(Button)`
  border-radius: 1vw;
  margin-top: 1rem;
  width: fit-content;
`;

const StyledImg = styled.img`
  max-width: 45%;
  width: 250px;
  margin: 1vw;
`;

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(1).required(),
});

// TODO: form validation
const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const {
    setValue,
    control,
    formState: { errors },
    setError,
    clearErrors,
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
    clearErrors();
    setShowPassword(false);
    onClose();
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const result = await dispatch(
        login({
          email: email,
          password: password,
        }),
      );
      unwrapResult(result);
      handleClose();
    } catch (error) {
      switch (error.errorCode) {
        case LoginErrorCode.USER_NOT_FOUND:
          setError("email", {
            type: "manual",
            message: "Email does not exist",
          });
          break;
        case LoginErrorCode.WRONG_PASSWORD:
          setError("password", {
            type: "manual",
            message: "Wrong password",
          });
          break;
        default:
          toast.error(error.message);
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
    <Dialog
      onBackdropClick={handleClose}
      PaperComponent={StyledPaper}
      open={open}
      scroll="body"
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth>
      <DialogTitle id="form-dialog-title">
        <StyledRowContainer>
          Login to Alpacow
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </StyledRowContainer>
      </DialogTitle>
      <DialogContent>
        <StyledRowContainer>
          <StyledColumnContainer>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <>
                  <TextField
                    id="new-user-email"
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    margin="normal"
                    size="small"
                    variant="outlined"
                    {...field}
                  />
                  {errors.email && (
                    <StyledErrorMessage>
                      {errors.email.message}
                    </StyledErrorMessage>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl variant="outlined" size="small">
                  <InputLabel htmlFor="adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="adornment-password"
                    error={!!errors.password}
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    {...field}
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
            />
            <StyledButton
              onClick={handleSubmit(handleLogin)}
              variant="contained"
              color="primary">
              Login
            </StyledButton>
          </StyledColumnContainer>
          <StyledImg src={LogoSVG} />
        </StyledRowContainer>
      </DialogContent>
      <DialogActions style={{ margin: "1rem" }} />
    </Dialog>
  );
};

export default LoginDialog;
