import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {   ScoreCollection  } from '/imports/db/TasksCollection';

Meteor.methods({
  'score.addLog'(log) {
    ScoreCollection.insert(log);
  },
});
