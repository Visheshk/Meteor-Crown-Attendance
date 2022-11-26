import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';


export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password);
  };

  return (
    
      <div className="login-form">
         <Blaze template="loginButtons" />

      </div>
    
  );
};
