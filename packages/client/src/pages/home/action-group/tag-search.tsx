import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import debounce from "lodash/debounce";
import { getDefaultTags, searchByTag } from "../../../services/tags";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { setTagFilter } from "../../../redux/slices/post-slice";

const fetchSearchString = debounce((searchTerm, callback) => {
  searchByTag(searchTerm).then((tags: string[]) => callback(tags));
}, 300);

const TagSearch = () => {
  const selectedTagFilter = useAppSelector((state) => state.post.tagFilter);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const defaultTags: Promise<string[]> = useMemo(getDefaultTags, []);

  const handleTagFilterChange = (
    event: React.ChangeEvent<{}>,
    newTagFilter: any,
  ) => {
    setOptions(newTagFilter ? [newTagFilter, ...options] : options);
    dispatch(setTagFilter(newTagFilter));
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
      style={{ width: 300 }}
      autoComplete
      includeInputInList
      value={selectedTagFilter}
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
    />
  );
};

export default TagSearch;
