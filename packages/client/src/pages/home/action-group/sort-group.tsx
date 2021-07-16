import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { Tooltip } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { PostSortType, setSortType } from "../../../redux/slices/post-slice";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import { useAppDispatch, useAppSelector } from "../../../redux/store";

const SortGroup = () => {
  const sortType = useAppSelector((state) => state.post.sortType);
  const dispatch = useAppDispatch();

  const handleSortTypeChange = async (
    event: React.MouseEvent<HTMLElement>,
    newSortType?: PostSortType,
  ) => {
    if (newSortType) {
      await dispatch(setSortType(newSortType));
    }
  };

  return (
    <ToggleButtonGroup
      value={sortType}
      exclusive
      onChange={handleSortTypeChange}>
      <Tooltip title="Sort by popular">
        <ToggleButton
          value={PostSortType.POPULAR}
          aria-label="Sort by Popular"
          selected={sortType === PostSortType.POPULAR}>
          <WhatshotIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Sort by new">
        <ToggleButton
          value={PostSortType.NEW}
          aria-label="Sort by New"
          selected={sortType === PostSortType.NEW}>
          <FiberNewIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};

export default SortGroup;
