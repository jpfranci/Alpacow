import React, { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { getDefaultTags, searchByTag } from "../../../services/tags";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

const fetchSearchString = debounce((searchTerm, callback) => {
  searchByTag(searchTerm).then((tags: string[]) => callback(tags));
}, 300);

interface TagSearchProps {
  width?: number;
  selectedTag: string | undefined;
  onTagSelect: (selectedTag: string) => any;
  // any other props
  [key: string]: any;
}

const TagSearch = ({
  width = 300,
  selectedTag,
  onTagSelect,
  ...otherProps
}: TagSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const defaultTags: Promise<string[]> = useMemo(getDefaultTags, []);

  const handleTagFilterChange = (
    event: React.ChangeEvent<{}>,
    newTagFilter: any,
  ) => {
    onTagSelect(newTagFilter);
  };

  useEffect(() => {
    const loadOptions = async () => {
      if (inputValue) {
        fetchSearchString(inputValue, (fetchedTags: string[]) => {
          setOptions(fetchedTags);
        });
      } else {
        const options = await defaultTags;
        setOptions(options);
      }
    };
    loadOptions();
  }, [inputValue, setOptions, fetchSearchString]);

  return (
    <Autocomplete
      options={options}
      style={{ width }}
      autoComplete
      value={selectedTag}
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
        setInputValue(newInputValue);
      }}
      {...otherProps}
    />
  );
};

export default TagSearch;
