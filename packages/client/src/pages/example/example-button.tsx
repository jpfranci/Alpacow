import Button from "@material-ui/core/Button";
import styled from "styled-components";
import React from "react";

export type ButtonProps = {
  label: string;
  colour: string;
};

const ExampleButton = ({ label, colour }: ButtonProps) => {
  const StyledButton = styled(Button)`
    & {
      background-color: ${colour};
    }
  `;

  return <StyledButton>{label}</StyledButton>;
};

export default ExampleButton;
