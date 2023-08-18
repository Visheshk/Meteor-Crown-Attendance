import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Session } from 'meteor/session'

export const UserLogger = () => {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log(e.target.age.value);
    // Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value, e.target.dob.value)
    Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value, e.target.dob.value)
  };

  const setUser = (user) => {
    Session.set("user");
  }

  const setName = (user) => {
    Session.set("user");
  }


  return (
    <>
    <div>
      <form className="set-name" onSubmit={setName}>
        <input type="text" name="name" placeholder="name" required /> 
        <button type="submit"> Set Name </button>
      </form>
      
      <form className="update-data" onSubmit={handleSubmit}>  
        <input type="text" name="field-name" placeholder="feature" required /> 
        <input type="text" name="field-value" placeholder="value" required /> 
        <button type="submit">Add Data</button>
      </form>
      </div>
    </>
  );
};
