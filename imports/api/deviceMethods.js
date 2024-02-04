import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { 
  ScoreCollection,
  DeviceCollection 
} from '/imports/db/TasksCollection';
import {WebApp} from 'meteor/webapp';

WebApp.connectHandlers.use('/hello', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200);

})

const randomString = function () {
  ss = String(new Date().getTime()) + String(Math.trunc(Math.random()*1000));
  return ss.slice(ss.length-8, ss.length+1);
}

Meteor.methods({
  'device.addLog'(log) {
    // console.log(VisitorsCollection.findOne({"name": name}));

    // return VisitorsCollection.findOne({"name": name});

    DeviceCollection.insert(log);

  },
});
