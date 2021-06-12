import React from "react";
import {
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: "30%",
      width: "fit-content",
    },
  }),
);

// TODO: I feel like this code will eventually do pretty much the same thing as
//  the TagSearch component, so I'm currently thinking of a way to pull out some
//  functionality for it to be used by this component too.
interface TagSelectProps {
  selectedTag: string;
}
const TagSelect = () => {
  const classes = useStyles();

  return (
    <FormControl
      className={classes.formControl}
      variant="outlined"
      margin="dense"
      fullWidth>
      <InputLabel id="tag-label">Tag</InputLabel>
      <Select labelId="tag-label" id="tag-select" label="Tag">
        <MenuItem value={"1"}>Tag example 1</MenuItem>
        <MenuItem value={"2"}>Tag example 2</MenuItem>
      </Select>
    </FormControl>
  );
};

export default TagSelect;
