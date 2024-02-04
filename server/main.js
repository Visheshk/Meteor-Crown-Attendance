import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection, VisitorsCollection } from '/imports/db/TasksCollection';
import { ServiceConfiguration } from 'meteor/service-configuration';
import '/imports/api/tasksMethods';
import '/imports/api/deviceMethods';
import '/imports/api/tasksPublications';

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = 'meteorite';
const SEED_EMAIL = 'meteorite@meteor.com';
const SEED_PASSWORD = 'password';
const roomNames = ["room1", "room2", "room3", "room4"]
const roomPassword = "coerce-sediment-striking";

Meteor.startup(() => {

  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
    });
  }
  for (rn in roomNames) {
    if (!Accounts.findUserByUsername(roomNames[rn])) {
      Accounts.createUser({
        username: roomNames[rn],
        email: roomNames[rn] + "@crownrooms.com",
        password: roomPassword,
      });
    }
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user));
  }
});

ServiceConfiguration.configurations.upsert(
  { 
    // service: 'github' 
  },
  {
    $set: {
      loginStyle: 'popup',
      clientId: '', // insert your clientId here
      secret: '', // insert your secret here
    },
  }
);
