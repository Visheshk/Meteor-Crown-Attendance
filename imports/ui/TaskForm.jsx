import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const TaskForm = () => {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log(e.target.age.value);
    Meteor.call('visitors.insert', e.target.name.value, e.target.age.value, e.target.gender.value, e.target.dob.value)
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="name" required /> 
      <input type="number" name="age" placeholder="age" required />
      <input type="text" name="gender" placeholder="gender" required /> 
      Date of Birth: <input type="date" name="dob" required /> 
      <button type="submit">Add Visitor</button>
    </form>
  );
};
