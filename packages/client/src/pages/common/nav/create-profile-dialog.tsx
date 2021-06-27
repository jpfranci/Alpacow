import React from "react";
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
    )
      .then(unwrapResult)
      .then((data) => alert("Signup succeeded!"))
      .catch((error) => alert("Signup failed.:" + error));
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
    <Dialog open={open} scroll="body" aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Sign up for Alpacow ✍️</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>Create your Alpacow account.</DialogContentText>
        <DialogContentText variant={"textSecondary" as Variant}>
          Remember, your username represents how others see you on Alpacow.
        </DialogContentText>
        <StyledContainer>
          <TextField
            id="new-user-email"
            label="Email"
            value={values.email}
            onChange={handleChange("email")}
            required
            autoFocus
            variant="standard"
            {...InputFieldProps}
          />
          <TextField
            id="new-user-username"
            label="Username"
            value={values.username}
            onChange={handleChange("username")}
            variant="standard"
            {...InputFieldProps}
          />
          <FormControl {...InputFieldProps}>
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
