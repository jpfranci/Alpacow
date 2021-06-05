import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { login, signup } from "../../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const ExamplePage = () => {
  return (
    <div>
      <h1>Example Page</h1>
      <UserExample />
    </div>
  );
};

const UserExample = () => {
  // misc state for <input> tags
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  const [userNotification, setUserNotification] = useState("");

  // store state + action dispatcher
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

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
        <button
          onClick={() =>
            dispatch(
              login({ username: loginUsername, password: loginPassword }),
            )
              .then(unwrapResult) // this is how you can access thunk return values in a nice format
              .then((data) => setUserNotification("login succeeded"))
              .catch((error) => {
                setUserNotification("login failed, bad credentials NOOOOO");
              })
          }>
          Login
        </button>
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
        <button
          onClick={() =>
            dispatch(
              signup({
                username: signupUsername,
                password: signupPassword,
                email: signupEmail,
              }),
            )
              .then(unwrapResult)
              .then((data) =>
                setUserNotification("signup succeeded! user added to db"),
              )
              .catch((error) => setUserNotification("signup failed"))
          }>
          Signup
        </button>
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
      <div>
        <h3>Notifications</h3>
        <p>{userNotification}</p>
      </div>
    </div>
  );
};

export default ExamplePage;
