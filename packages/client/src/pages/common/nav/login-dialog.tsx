import React from "react";
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
  PropTypes,
  TextField,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";
import { useAppDispatch } from "../../../redux/store";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { login } from "../../../redux/slices/user-slice";
import { unwrapResult } from "@reduxjs/toolkit";
import CloseIcon from "@material-ui/icons/Close";
import LogoSVG from "../../../assets/Alpacow-logo.svg";

const DEFAULT_FIELDS = {
  email: "",
  password: "",
  showPassword: false,
};

interface LoginDialogProps {
  open: boolean;
  onClose: () => any;
}

interface LoginState {
  email: string;
  password: string;
  showPassword: boolean;
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

// TODO: form validation
const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const [values, setValues] = React.useState<LoginState>(DEFAULT_FIELDS);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setValues(DEFAULT_FIELDS);
    onClose();
  };

  const handleLogin = () => {
    dispatch(
      login({
        email: values.email,
        password: values.password,
      }),
    )
      .then(unwrapResult)
      .catch((error) => alert("Login failed:" + error));
    handleClose();
  };

  const handleChange =
    (prop: keyof LoginState) =>
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
    <Dialog
      PaperComponent={StyledPaper}
      open={open}
      scroll="body"
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
            <TextField
              id="new-user-email"
              label="Email"
              value={values.email}
              onChange={handleChange("email")}
              fullWidth
              margin="normal"
              size="small"
              variant="outlined"
            />
            <FormControl variant="outlined" size="small">
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <OutlinedInput
                id="adornment-password"
                type={values.showPassword ? "text" : "password"}
                onChange={handleChange("password")}
                label="Password"
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
            <StyledButton
              onClick={handleLogin}
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
