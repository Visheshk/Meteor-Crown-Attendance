import { Meteor } from 'meteor/meteor';
import { 
  TasksCollection, 
  VisitorsCollection, 
  VisitsCollection,
  DeviceCollection 
} from '/imports/db/TasksCollection';

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});

Meteor.publish('visitors', function publishTasks() {
  // console.log(VisitorsCollection.find({ }));
  return VisitorsCollection.find({ });
});

Meteor.publish('visits', function publishTasks() {
  // console.log(VisitorsCollection.find({ }));
  return VisitsCollection.find({ });
});

Meteor.publish('devicelogs', function publishTasks() {
  // console.log(VisitorsCollection.find({ }));
  return DeviceCollection.find({ });
});
