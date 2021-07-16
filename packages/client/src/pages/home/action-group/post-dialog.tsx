import React, { useState } from "react";
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
import TagSearch from "./tag-search";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { createPost } from "../../../redux/slices/post-slice";

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

interface PostDialogProps {
  open: boolean;
  onClose: () => any;
}

interface PostDialogFields {
  title: string;
  bodyText: string;
  tag: string | undefined;
  isAnonymous: boolean;
  userId: string;
  inputValue: string;
}

const DEFAULT_FIELDS = {
  title: "",
  bodyText: "",
  tag: undefined,
  isAnonymous: false,
  userId: "",
  inputValue: "",
};

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const PostDialog = ({ open, onClose }: PostDialogProps) => {
  const classes = useStyles();
  const location = useAppSelector((state) => state.post.locationFilter);
  const dispatch = useAppDispatch();
  const [fields, setFields]: [PostDialogFields, any] = useState(DEFAULT_FIELDS);
  const { title, bodyText, tag, isAnonymous, userId, inputValue } = fields;

  const handleClose = () => {
    setFields(DEFAULT_FIELDS);
    onClose();
  };

  const handleSave = () => {
    dispatch(
      createPost({
        title,
        body: bodyText,
        tag: tag as string,
        location,
        userId: userId,
      }),
    );
    handleClose();
  };

  const handleFieldChange = (key: string, value: any) => {
    setFields({
      ...fields,
      [key]: value,
    });
  };

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
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
          value={title}
          onChange={(event) => handleFieldChange("title", event.target.value)}
        />
        <TextField
          id="post-body-text"
          label="Content"
          variant="outlined"
          margin="dense"
          value={bodyText}
          required
          multiline
          rows={4}
          rowsMax={6}
          fullWidth
          onChange={(event) =>
            handleFieldChange("bodyText", event.target.value)
          }
        />
        <StyledContainer>
          <TagSearch
            width={200}
            size="small"
            selectedTag={tag}
            inputValue={inputValue}
            onInputChange={(newInputValue) =>
              handleFieldChange("inputValue", newInputValue)
            }
            onTagSelect={(newTag) => handleFieldChange("tag", newTag)}
          />
          <FormControlLabel
            control={<Checkbox name="checkedH" color="primary" />}
            label="Post Anonymously"
            classes={{
              label: classes.label,
            }}
            checked={isAnonymous}
            onChange={(event: any) =>
              handleFieldChange("isAnonymous", event.target.checked)
            }
          />
        </StyledContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="outlined" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDialog;
