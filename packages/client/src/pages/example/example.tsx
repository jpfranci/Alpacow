import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import {
  createPost,
  getPosts,
  setLocationFilter,
} from "../../redux/slices/post-slice";
import { login, signup } from "../../redux/slices/user-slice";
import { Location } from "../../pages/home/map";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const ExamplePage = () => {
  return (
    <div>
      <h1>Example Page</h1>
      <UserExample />
      <hr />
      <PostExample />
    </div>
  );
};

const UserExample = () => {
  // misc local component state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  // store state + action dispatcher
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(login({ username: loginUsername, password: loginPassword }))
      .then(unwrapResult) // this is how you can access thunk return values in a nice format
      // (store has already been updated from action dispatch as this point, but you might want action result to do some component logic)
      .then((data) => alert("login succeeded"))
      .catch((error) => {
        alert("login failed, bad credentials prob NOOOOO");
      });
  };

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(
      signup({
        username: signupUsername,
        password: signupPassword,
        email: signupEmail,
      }),
    )
      .then(unwrapResult)
      .then((data) => alert("signup succeeded! user added to db"))
      .catch((error) => alert("signup failed"));
  };

  return (
    <div>
      <h2>User example</h2>
      <div>
        <h3>Login (gets existing user from db and sets them in the store)</h3>
        <div>
          <label>username</label>
          <input
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />
        </div>
        <div>
          <label>password</label>
          <input
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        <h3>Signup (adds new user to db and sets them in the store)</h3>
        <div>
          <label>username</label>
          <input
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
          />
        </div>
        <div>
          <label>password</label>
          <input
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
        </div>
        <div>
          <label>email</label>
          <input
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
        </div>
        <button onClick={handleSignup}>Signup</button>
      </div>
      <div>
        <h3>Current User in store</h3>
        {user.id ? (
          <div>
            <p>id: {user.id}</p>
            <p>username: {user.username}</p>
            <p>email: {user.email}</p>
          </div>
        ) : (
          <div>NONE</div>
        )}
      </div>
    </div>
  );
};

const PostExample = () => {
  // misc local component state
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [bodyText, setBodyText] = useState("");

  // store state + action dispatcher
  const dispatch = useAppDispatch();
  const locationFilter = useAppSelector((state) => state.post.locationFilter);
  const user = useAppSelector((state) => state.user);
  const posts = useAppSelector((state) =>
    // here we're deriving a computed value from location + posts state.
    // When either of those states change, this value will recompute.
    state.post.posts.filter(
      (post) => post.location === state.post.locationFilter,
    ),
  );

  // fetch all posts on initial render (in reality we prob won't fetch ALL posts, just ones in curr location)
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleCreatePost = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (user.id) {
      dispatch(
        createPost({
          title,
          bodyText,
          tag,
          location: locationFilter,
          userID: user.id,
        }),
      )
        .then(unwrapResult)
        .then((data) => alert("post created oooo"))
        .catch((error) => {
          alert("post creation failed NOOOOO");
        });
    } else {
      alert("you must be logged in to create a post");
    }
  };

  const vancouver: Location = { name: "Vancouver", lat: 49.26, lon: -123.22 };
  const surrey: Location = { name: "Surry", lat: 49.26, lon: -123.22 };
  const richmond: Location = { name: "Richmond", lat: 49.26, lon: -123.22 };
  const yellowknife: Location = {
    name: "Yellowknife",
    lat: 49.26,
    lon: -123.22,
  };

  return (
    <div>
      <h2>Post example</h2>
      <select
        onChange={(e) =>
          dispatch(setLocationFilter(JSON.parse(e.target.value)))
        }>
        <option value={JSON.stringify(vancouver)}>{vancouver.name}</option>
        <option value={JSON.stringify(surrey)}>{surrey.name}</option>
        <option value={JSON.stringify(richmond)}>{richmond.name}</option>
        <option value={JSON.stringify(yellowknife)}>{yellowknife.name}</option>
      </select>
      <div>
        <h3>Create Post (adds new post to db and adds them to the store)</h3>
        <div>
          <label>title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>tag</label>
          <input value={tag} onChange={(e) => setTag(e.target.value)} />
        </div>
        <div>
          <label>body</label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
          />
        </div>
        <button onClick={handleCreatePost}>Create</button>
      </div>
      <div>
        <h3>Posts (filtered by location)</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>body: {post.bodyText}</p>
              <p>tag: {post.tag}</p>
              <p>location: {post.location}</p>
              <p>created by (id): {post.userID}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExamplePage;
