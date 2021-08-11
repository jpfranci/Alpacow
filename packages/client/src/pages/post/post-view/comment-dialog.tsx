import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({ open, onClose }) => {
  const [bodyText, setBodyText] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    // dispatch(
    //   createPost({
    //     title: title,
    //     body: bodyText,
    //     tag: tag as string,
    //     location: location,
    //     isAnonymous: isAnonymous,
    //   }),
    // );
    handleClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth={true}>
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
