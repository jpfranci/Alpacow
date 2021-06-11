import { Meta, Story } from "@storybook/react";
import ActionGroup from "./action-group";
import React from "react";

export default {
  title: "ActionGroup",
  component: ActionGroup,
} as Meta;

const Template: Story = () => <ActionGroup />;

export const ActionGroupStory = Template.bind({});
