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
  Paper,
  TextField,
} from "@material-ui/core";
import styled from "styled-components";
import TagSearch from "./tag-search";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { createPost } from "../../../redux/slices/post-slice";
import Joi from "joi";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      overflow: "hidden",
    },
  }),
);

interface PostDialogProps {
  open: boolean;
  onClose: () => any;
}

interface PostDialogFields {
  tag: string | undefined;
  isAnonymous: boolean;
  inputValue: string;
}

const DEFAULT_FIELDS = {
  tag: undefined,
  isAnonymous: false,
  inputValue: "",
};

const DEFAULT_VALIDATION_FIELDS = {
  title: "",
  body: "",
};

const StyledPaper = styled(Paper)`
  border-radius: 1rem;
  min-width: 33%;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  texttransform: capitalize;
  color: gray;
  margin-left: auto;
`;

const StyledErrorMessage = styled.span`
  color: red;
  margin-bottom: 0.25em;
`;

const StyledRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const StyledColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const validationSchema = Joi.object({
  title: Joi.string().max(256).required(),
  body: Joi.string().max(1024).required(),
});

const PostDialog = ({ open, onClose }: PostDialogProps) => {
  const {
    setValue,
    control,
    formState: { errors },
    clearErrors,
    handleSubmit,
  } = useForm({
    mode: "onBlur",
    resolver: joiResolver(validationSchema),
    defaultValues: DEFAULT_VALIDATION_FIELDS,
  });
  const classes = useStyles();
  const location = useAppSelector((state) => state.post.locationFilter);
  const dispatch = useAppDispatch();
  const [fields, setFields]: [PostDialogFields, any] = useState(DEFAULT_FIELDS);
  const { tag, inputValue, isAnonymous } = fields;

  const handleClose = () => {
    Object.keys(DEFAULT_VALIDATION_FIELDS).forEach((field) => {
      // @ts-ignore
      setValue(field, DEFAULT_VALIDATION_FIELDS[field], {
        shouldValidate: false,
      });
    });
    clearErrors();
    setFields(DEFAULT_FIELDS);
    onClose();
  };

  const handleSubmitPost = async ({ title, body }) => {
    try {
      const result = await dispatch(
        createPost({
          title: title,
          body: body,
          tag: tag as string,
          location: location,
          isAnonymous: isAnonymous,
        }),
      );
      unwrapResult(result);
      handleClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFields({
      ...fields,
      [key]: value,
    });
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      PaperComponent={StyledPaper}>
      <DialogTitle id="form-dialog-title">Create your post</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <StyledColumnContainer>
          <DialogContentText>
            Please be mindful of what you post. ❤️
          </DialogContentText>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <>
                <TextField
                  id="post-title"
                  label="Title"
                  variant="outlined"
                  margin="dense"
                  autoFocus
                  fullWidth
                  required
                  error={!!errors.title}
                  inputProps={{ maxLength: 256 }}
                  {...field}
                />
                {errors.title && (
                  <StyledErrorMessage>
                    {errors.title.message}
                  </StyledErrorMessage>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="body"
            render={({ field }) => (
              <>
                <TextField
                  id="post-body-text"
                  label="Content (max 1,024 chars)"
                  variant="outlined"
                  margin="dense"
                  required
                  multiline
                  rows={4}
                  rowsMax={6}
                  fullWidth
                  error={!!errors.body}
                  inputProps={{ maxLength: 1024 }}
                  {...field}
                />
                {errors.body && (
                  <StyledErrorMessage>{errors.body.message}</StyledErrorMessage>
                )}
              </>
            )}
          />
        </StyledColumnContainer>
        <StyledRowContainer>
          <TagSearch
            width={200}
            size="small"
            selectedTag={tag}
            inputValue={inputValue}
            onInputChange={(newInputValue: any) =>
              handleFieldChange("inputValue", newInputValue)
            }
            onTagSelect={(newTag) => handleFieldChange("tag", newTag)}
          />
          <StyledFormControlLabel
            control={<Checkbox name="checkedH" color="primary" />}
            label="Post Anonymously"
            checked={isAnonymous}
            onChange={(event: any) =>
              handleFieldChange("isAnonymous", event.target.checked)
            }
          />
        </StyledRowContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleSubmitPost)}
          variant="outlined"
          color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostDialog;
