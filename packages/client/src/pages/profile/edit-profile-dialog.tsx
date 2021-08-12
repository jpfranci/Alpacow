import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  PropTypes,
  TextField,
} from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import userService from "../../services/users";
import { updateUser } from "../../redux/slices/user-slice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import { PROFILE_PAGE } from "../../common/links";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
import UpdateErrorCode from "../../errors/update-errors";

const StyledPaper = styled(Paper)`
  border-radius: 1rem;
`;

const StyledRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitle = styled.span`
  display: table-cell;
  vertical-align: middle;
  font-size: 1.5em;
  margin: 0.5em 0;
`;

const StyledErrorMessage = styled.span`
  color: red;
`;

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => any;
  username: string | undefined;
  email: string | undefined;
}

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  username: Joi.string().required(),
});
const EditProfileDialog = ({ open, onClose }: EditProfileDialogProps) => {
  const { username: currentUsername, email: currentEmail } = useAppSelector(
    (state) => state.user,
  );
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
    defaultValues: {
      username: currentUsername,
      email: currentEmail,
    },
  });

  useEffect(() => {
    setValue("email", currentEmail);
    setValue("username", currentUsername);
  }, [currentEmail, currentUsername]);

  const dispatch = useAppDispatch();

  let history = useHistory();

  const handleClose = () => {
    clearErrors();
    onClose();
  };

  const handleUpdateUser = async ({ username, email }) => {
    try {
      if (username !== currentUsername || email !== currentEmail) {
        const validationResult = await userService.validate({
          username: username,
          email: email,
        });
        let isValid = true;

        if (email !== currentEmail && validationResult.emailExists) {
          setError("email", {
            type: "manual",
            message: "The new email already exists",
          });
          isValid = false;
        }

        if (username !== currentUsername && validationResult.usernameExists) {
          setError("username", {
            type: "manual",
            message: "The username already exists",
          });
          isValid = false;
        }

        if (isValid) {
          const dispatchedAction = await dispatch(
            updateUser({
              username: username,
              email: email,
            }),
          );
          unwrapResult(dispatchedAction);
          handleClose();
          history.push(PROFILE_PAGE);
        }
      } else {
        toast.info("No changes were made to current info.");
      }
    } catch (err) {
      switch (err.errorCode) {
        case UpdateErrorCode.EMAIL_IN_USE:
          setError("email", {
            type: "manual",
            message: "The new email already exists",
          });
          break;
        default:
          toast.error("There was an unexpected error while updating user");
          break;
      }
    }
  };

  const InputFieldProps = {
    fullWidth: true,
    margin: "normal" as PropTypes.Margin,
  };

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
          <StyledTitle>Update your profile</StyledTitle>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </StyledRowContainer>
      </DialogTitle>

      <DialogContent>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <>
              <TextField
                id="new-user-email"
                label={"Email"}
                autoFocus
                error={!!errors.email}
                variant="standard"
                {...field}
                {...InputFieldProps}
              />
              {errors.email && (
                <StyledErrorMessage>{errors.email.message}</StyledErrorMessage>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <>
              <TextField
                id="new-user-username"
                label={errors.username ? errors.username : "Username"}
                error={!!errors.username}
                variant="standard"
                {...field}
                {...InputFieldProps}
              />
              {errors.username && (
                <StyledErrorMessage>
                  {errors.username.message}
                </StyledErrorMessage>
              )}
            </>
          )}
        />
      </DialogContent>

      <DialogActions style={{ margin: "0.5rem" }}>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Back to profile
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(handleUpdateUser)}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
