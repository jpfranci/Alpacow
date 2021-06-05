import React from "react";
import ExampleButton, { ButtonProps } from "./example-button";
import { Story, Meta } from "@storybook/react";

// Need to define which component is being tested and what to call it
export default {
  title: "ExampleButton",
  component: ExampleButton,
} as Meta;

const defaultProps = {
  label: "Alpacow",
  colour: "lightgrey",
};

// This is the template JSX that is used to render the stories
const Template: Story<ButtonProps> = (props: ButtonProps) => <ExampleButton {...props} />;

// These are the initial stories, you can customize whatever props you pass in
export const RedExampleButton = Template.bind({});
// we override default props by listing below
RedExampleButton.args = {
  ...defaultProps,
  colour: "red",
};

export const PokemonExampleButton = Template.bind({});
PokemonExampleButton.args = {
  ...defaultProps,
  label: "Pokemon",
};
