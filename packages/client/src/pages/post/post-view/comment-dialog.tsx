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
import Joi from "joi";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import styled from "styled-components";

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

const StyledErrorMessage = styled.span`
  color: red;
`;

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  post: Post;
}

const DEFAULT_FIELDS = {
  bodyText: "",
  isAnonymous: false,
};

const validationSchema = Joi.object({
  bodyText: Joi.string().max(1024).required(),
  isAnonymous: Joi.boolean().required(),
});

const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onClose,
  post,
}) => {
  const {
    control,
    formState: { errors },
    clearErrors,
    handleSubmit,
  } = useForm({
    mode: "onBlur",
    resolver: joiResolver(validationSchema),
    defaultValues: DEFAULT_FIELDS,
  });

  const dispatch = useAppDispatch();
  const handleClose = () => {
    clearErrors();
    onClose();
  };

  const classes = useStyles();

  const handleSubmitClicked = async ({ bodyText, isAnonymous }) => {
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
      toast.error(err.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth={true}
      className={classes.dialogContent}>
      <DialogTitle>Create your comment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please be mindful of what you comment. ❤️
        </DialogContentText>
        <Controller
          control={control}
          name="bodyText"
          render={({ field }) => (
            <>
              <TextField
                label="Content (max 1,024 chars)"
                variant="outlined"
                margin="dense"
                required
                multiline
                rows={4}
                rowsMax={6}
                fullWidth
                inputProps={{ maxLength: 1024 }}
                {...field}
              />
              {errors.bodyText && (
                <>
                  <StyledErrorMessage>
                    {errors.bodyText.message}
                  </StyledErrorMessage>
                  <br />
                </>
              )}
            </>
          )}
        />
        <Controller
          name="isAnonymous"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox name="checkedH" color="primary" />}
              label="Comment Anonymously"
              classes={{ label: classes.label }}
              checked={field.value}
              onChange={(e: any) => field.onChange(e.target.checked)}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleSubmitClicked)}
          variant="outlined"
          color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;
