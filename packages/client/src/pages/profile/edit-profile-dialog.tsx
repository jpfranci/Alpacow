import React, { useState } from "react";
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

interface EditProfileErrors {
  username: string;
  email: string;
}

const DEFAULT_ERRORS: EditProfileErrors = {
  username: "",
  email: "",
};

interface EditProfileState {
  username: string;
  email: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => any;
  username: string | undefined;
  email: string | undefined;
}

const EditProfileDialog = ({ open, onClose }: EditProfileDialogProps) => {
  const userState = useAppSelector((state) => state.user);
  let curUsername = userState.username;
  let curEmail = userState.email;

  const DEFAULT_FIELDS = {
    username: curUsername ? curUsername : "",
    email: curEmail ? curEmail : "",
  };

  const [values, setValues] = useState<EditProfileState>(DEFAULT_FIELDS);
  const [errors, setErrors] = useState<EditProfileErrors>(DEFAULT_ERRORS);
  const dispatch = useAppDispatch();

  let history = useHistory();

  const handleClose = () => {
    setValues(DEFAULT_FIELDS);
    setErrors(DEFAULT_ERRORS);
    onClose();
  };

  const handleUpdateUser = async () => {
    try {
      const { username, email } = values;
      const validationResult = await userService.validate({
        username: username,
        email: email,
      });
      let isValid = true;
      let formErrors = errors;

      // TODO: check if existing email belongs to this user, if not ensure updated email isn't being used
      if (email !== curEmail && validationResult.emailExists) {
        formErrors = { ...formErrors, email: "The new email already exists" };
        isValid = false;
      }

      if (validationResult.usernameExists) {
        formErrors = { ...formErrors, username: "The username already exists" };
        isValid = false;
      }

      if (!isValid) {
        setErrors(formErrors);
      } else {
        if (userState._id) {
          const dispatchedAction = await dispatch(
            updateUser({
              _id: userState._id,
              username: username,
              email: email,
            }),
          );
          unwrapResult(dispatchedAction);
          handleClose();
          history.push(PROFILE_PAGE);
        }
      }
    } catch (err) {
      alert("There was an unexpected error while signing up, please try again");
    }
  };

  const handleChange =
    (prop: keyof EditProfileState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const fieldStyle = { margin: "0.5rem 0rem", color: "#595959" };
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
        <TextField
          id="new-user-email"
          label={errors.email ? errors.email : "Email"}
          value={values.email}
          onChange={handleChange("email")}
          autoFocus
          error={!!errors.email}
          variant="standard"
          {...InputFieldProps}
        />
        <TextField
          id="new-user-username"
          label={errors.username ? errors.username : "Username"}
          value={values.username}
          error={!!errors.username}
          onChange={handleChange("username")}
          variant="standard"
          {...InputFieldProps}
        />
      </DialogContent>

      <DialogActions style={{ margin: "0.5rem" }}>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Back to profile
        </Button>
        <Button variant="contained" color="primary" onClick={handleUpdateUser}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
