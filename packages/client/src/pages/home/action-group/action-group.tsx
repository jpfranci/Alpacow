import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@material-ui/core";
import SortGroup from "./sort-group";
import PostDialog from "./post-dialog";
import styled from "styled-components";
import TagFilterGroup from "./tag-filter-group";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const ActionElement = styled.div`
  margin: 1em;
`;

const ActionGroup = () => {
  const [modalOpen, setModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);

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
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setModalOpen(true)}>
          Create Post
        </Button>
      </ActionElement>
      <PostDialog open={modalOpen} onClose={handleModalClose} />
    </StyledContainer>
  );
};

export default ActionGroup;
