import React, { useEffect } from "react";
import { getPosts } from "../../redux/slices/postSlice";
import { useAppDispatch } from "../../redux/store";
import ActionGroup from "./action-group/action-group";
import Map from "./map";
import PostList from "./post-list/post-list";

const HomePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <div>
      <Map />
      <ActionGroup />
      <PostList />
    </div>
  );
};

export default HomePage;
