import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {   DeviceCollection } from '/imports/db/TasksCollection';


Meteor.methods({
  'device.addLog'(log) {
    let dd = new Date();
    log["epochTime"] = dd.getTime();
    log["timestamp"] = dd.toISOString();
    DeviceCollection.insert(log);
  },
});
