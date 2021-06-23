import React from "react";
import ActionGroup from "./action-group/action-group";
import Map from "./map";
import PostList from "./post-list/post-list";

const HomePage = () => {
  return (
    <div>
      <Map />
      <ActionGroup />
      <PostList />
    </div>
  );
};

export default HomePage;
