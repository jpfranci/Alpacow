import React, { Dispatch, SetStateAction } from "react";
import {
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  TextField,
} from "@material-ui/core";
import styled from "styled-components";
import TagSelect from "./tag-select";

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      padding: "0px 4vw",
    },
    label: {
      textTransform: "capitalize",
      color: "gray",
    },
  }),
);

interface PostDialogProps {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

// TODO: Submit button, anonymity, and tag selection functionality
const PostDialog = (props: PostDialogProps) => {
  const classes = useStyles();

  const StyledContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  `;

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create your post</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          Please be mindful of what you post. ❤️
        </DialogContentText>
        <TextField
          id="post-title"
          label="Title"
          variant="outlined"
          margin="dense"
          autoFocus
          fullWidth
        />
        <TextField
          id="post-body-text"
          label="Content"
          variant="outlined"
          margin="dense"
          required
          multiline
          rows={4}
          rowsMax={6}
          fullWidth
        />
        <StyledContainer>
          <TagSelect />
          <FormControlLabel
            control={<Checkbox name="checkedH" color="primary" />}
            label="Post Anonymously"
            classes={{
              label: classes.label,
            }}
          />
        </StyledContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose(props.open)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => props.onClose(props.open)}
          variant="outlined"
          color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDialog;
