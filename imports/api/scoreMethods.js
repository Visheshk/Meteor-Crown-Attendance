import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {   ScoreCollection  } from '/imports/db/TasksCollection';
import {   DeviceCollection  } from '/imports/db/TasksCollection';

Meteor.methods({
  'score.addLog'(log) {
    ScoreCollection.insert(log);
  },

  'devlogs.claim' (rowIds, user) {
    DeviceCollection.update(
      {"_id": {$in: rowIds}}, 
      {$set: {
        "claimed": true, 
        "userId": user._id 
      }}, 
      {multi: true});
  },

  'devlogs.clearByTime' (kinds) {
    let et = new Date().getTime();
    DeviceCollection.update(
      {$and: [
        {"pageField": {$in: kinds}}, 
        {"epochTime": {$lt: et}}
      ]}, 
      {$set: {"cleared": true}}, 
      {multi: true}
    );
  }
});



// db.devicelogs.update({"_id": {$in: ["hNNEYhq8BvWwgE2qN"]}} , {$set: {"claimed": true, "userId": "testerboy"}})