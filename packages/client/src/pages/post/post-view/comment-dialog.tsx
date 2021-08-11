import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createComment, Post } from "../../../redux/slices/post-slice";
import { useAppDispatch } from "../../../redux/store";

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      overflow: "hidden",
    },
    label: {
      textTransform: "capitalize",
      color: "gray",
    },
  }),
);

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  post: Post;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onClose,
  post,
}) => {
  const [bodyText, setBodyText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const dispatch = useAppDispatch();
  const handleClose = () => {
    onClose();
  };

  const classes = useStyles();

  const handleSubmit = async () => {
    try {
      const dispatchedAction = await dispatch(
        createComment({
          newComment: { body: bodyText, isAnonymous },
          postId: post._id,
        }),
      );
      unwrapResult(dispatchedAction);
      handleClose();
    } catch (err) {
      // TODO improve error handling (look at create profile dialog)
      toast.error(err.message);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth={true}
      className={classes.dialogContent}>
      <DialogTitle>Create your comment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please be mindful of what you comment. ❤️
        </DialogContentText>
        <TextField
          label="Content (max 1,024 chars)"
          variant="outlined"
          margin="dense"
          value={bodyText}
          required
          multiline
          rows={4}
          rowsMax={6}
          fullWidth
          onChange={(e) => setBodyText(e.target.value)}
          inputProps={{ maxLength: 1024 }}
        />
        <FormControlLabel
          control={<Checkbox name="checkedH" color="primary" />}
          label="Comment Anonymously"
          classes={{ label: classes.label }}
          checked={isAnonymous}
          onChange={(e: any) => setIsAnonymous(e.target.checked)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="outlined" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;
