import React, { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { searchByTag } from "../../../services/tags";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

const fetchSearchString = debounce((searchTerm, callback) => {
  searchByTag(searchTerm).then((tags: string[]) => callback(tags));
}, 300);

interface TagSearchProps {
  width?: number;
  selectedTag: string | undefined;
  onTagSelect: (selectedTag: string) => any;
  inputValue: string;
  onInputChange: (inputValue: string) => any;
  // any other props
  [key: string]: any;
}

const TagSearch = ({
  width = 300,
  selectedTag,
  onTagSelect,
  inputValue,
  onInputChange,
  ...otherProps
}: TagSearchProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const handleTagFilterChange = (
    event: React.ChangeEvent<{}>,
    newTagFilter: any,
  ) => {
    onTagSelect(newTagFilter);
  };

  useEffect(() => {
    const loadOptions = async () => {
      if (inputValue) {
        setIsLoading(true);
        fetchSearchString(inputValue, (fetchedTags: string[]) => {
          setOptions(fetchedTags);
          setIsLoading(false);
        });
      } else {
        setOptions([]);
      }
    };
    loadOptions();
  }, [inputValue, setOptions, fetchSearchString]);

  let noOptionsText;
  if (!inputValue) {
    noOptionsText = "Start typing to find tags";
  } else {
    noOptionsText = isLoading ? "Fetching tags" : "No options";
  }

  return (
    <Autocomplete
      options={options}
      style={{ width }}
      autoComplete
      value={selectedTag ?? null}
      inputValue={inputValue ?? ""}
      noOptionsText={noOptionsText}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Find a Tag"
          variant="outlined"
          fullWidth
        />
      )}
      onChange={handleTagFilterChange}
      onInputChange={(event, newInputValue) => {
        onInputChange(newInputValue);
      }}
      {...otherProps}
    />
  );
};

export default TagSearch;
