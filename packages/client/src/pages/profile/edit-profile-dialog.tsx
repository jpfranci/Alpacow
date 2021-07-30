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
import { useAppSelector } from "../../redux/store";

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

const EditProfileDialog = ({
  open,
  onClose,
  username,
  email,
}: EditProfileDialogProps) => {
  const userState = useAppSelector((state) => state.user);
  const DEFAULT_FIELDS = {
    username: username ? username : "",
    email: email ? email : "",
  };

  const [values, setValues] = useState<EditProfileState>(DEFAULT_FIELDS);

  const handleClose = () => {
    onClose();
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
          required
          variant="standard"
          {...InputFieldProps}
        />
      </DialogContent>

      <DialogActions style={{ margin: "0.5rem" }}>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Back to profile
        </Button>
        <Button variant="contained" color="primary" onClick={handleClose}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
