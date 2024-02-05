import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {   DeviceCollection } from '/imports/db/TasksCollection';


Meteor.methods({
  'device.addLog'(log) {
    DeviceCollection.insert(log);
  },
});
