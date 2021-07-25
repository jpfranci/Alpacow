import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import SortGroup from "./sort-group";
import PostDialog from "./post-dialog";
import styled from "styled-components";
import TagFilterGroup from "./tag-filter-group";
import { useAppSelector } from "../../../redux/store";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const ActionGroup = () => {
  const [modalOpen, setModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const userState = useAppSelector((state) => state.user);

  const ActionElement = styled.div`
    margin: 1em;
  `;

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <StyledContainer>
      <ActionElement>
        <SortGroup />
      </ActionElement>
      <TagFilterGroup />
      <ActionElement>
        <Tooltip title="Log in to create posts">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              // Tooltip only shows on enabled buttons
              if (userState._id) {
                setModalOpen(true);
              }
            }}>
            Create Post
          </Button>
        </Tooltip>
      </ActionElement>
      <PostDialog open={modalOpen} onClose={handleModalClose} />
    </StyledContainer>
  );
};

export default ActionGroup;
