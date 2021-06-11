import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@material-ui/core";
import SortGroup from "./sort-group";
import TagSearch from "./tag-search";
import styled from "styled-components";

const ActionGroup = () => {
  const [modalOpen, setModalOpen]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState<boolean>(false);

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

  return (
    <StyledContainer>
      <ActionElement>
        <SortGroup />
      </ActionElement>
      <TagSearch />
      <ActionElement>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setModalOpen(true)}>
          Create Post
        </Button>
      </ActionElement>
    </StyledContainer>
  );
};

export default ActionGroup;
