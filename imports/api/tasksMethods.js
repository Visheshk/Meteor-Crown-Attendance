import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection, VisitorsCollection, VisitsCollection } from '/imports/db/TasksCollection';

Meteor.methods({
  
  'visitors.insert'(name, age, gender, dob, notes) {
    // check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    //TODO: create new random number for barcode creation
    // [random 3 digit string] +  [5 digit index] + [random 4 digit string];
    // visCount = VisitorsCollection.find().count();

    // barcodeId = String(Math.trunc(Math.random()*1000)) + String(visCount).padStart(5,'0') + String(Math.trunc(Math.random()*1000));
    barcodeId = String(new Date().getTime()) + String(Math.trunc(Math.random()*1000));

    VisitorsCollection.insert({
      name: name,
      gender: gender,
      age: age,
      dob: dob, 
      notes: notes,
      currentRoom: "brand new",
      index: visCount,
      barcodeId: barcodeId,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

  'visitors.barUpdate' (id) {
    console.log(id);
    
    barcodeId = String(new Date().getTime()) + String(Math.trunc(Math.random()*1000));
    VisitorsCollection.update({_id: id}, {$set: {barcodeId: barcodeId}});
  },

  // 'visitors.update'( id, room ) {
  //   VisitorsCollection.update({_id: id}, {$set: {currentRoom: room, lastUpdated: new Date()}});

  // },

  'visits.insert' (id, room) {
    //check that id exists    
    console.log(room);
    const visitor = VisitorsCollection.findOne({ _id: id});
    if (!visitor) {
      throw new Meteor.Error('Access denied.');
      return("visitor not found for visitor");
    }
    else {
      VisitsCollection.insert({
        visitor: id,
        time: new Date(),
        room: room,
        
      });

      VisitorsCollection.update({_id: id}, {
        $set: {
          currentRoom: room,
          lastUpdated: new Date()
        }
      });
      return("room update successful!");
    }   
  },

  'tasks.insert'(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    TasksCollection.insert({
      text,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.remove(taskId);
  },

  'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.update(taskId, {
      $set: {
        isChecked,
      },
    });
  },
});
