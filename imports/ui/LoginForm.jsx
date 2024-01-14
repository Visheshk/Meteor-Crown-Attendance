import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
// import Blaze from 'meteor/gadicc:blaze-react-component';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();
    Meteor.loginWithPassword(username, password, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        // console.log("login success!");
        FlowRouter.go("/");
      }
    });
  };

  return (
    <form onSubmit={submit} className="login-form2">
      <div>
         {/*<Blaze template="loginButtons" />*/}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>

        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">Log In</button>
      </div>
    </form>
  );
};

export default LoginForm