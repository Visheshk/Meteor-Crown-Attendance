import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { TasksCollection, VisitorsCollection } from '/imports/db/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';

const toggleChecked = ({ _id, isChecked }) =>
  Meteor.call('tasks.setIsChecked', _id, !isChecked);

const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);
const addVisit = ({visitor, room}) => {
  Meteor.call('visits.insert', visitor, room);
}

const makeNewBarcode = ({visitor}) => {
  Meteor.call('visitors.barUpdate', visitor);
}

export const App = () => {
  const user = useTracker(() => Meteor.user());

  const [hideCompleted, setHideCompleted] = useState(false);
  const [camData, setCamData] = useState(0);
  const [stopStream, setStopStream] = useState(false);

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const toggleQrReader = () => {
    // Stop the QR Reader stream (fixes issue where the browser freezes when closing the modal) and then dismiss the modal one tick later
    setStopStream(!stopStream);
    console.log(stopStream);
    // setTimeout(() => closeModal(), 0);
  }

  const { visitors, tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { visitors: [], tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    // const handler = Meteor.subscribe('tasks');
    const handler = Meteor.subscribe('visitors');

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const visitors = VisitorsCollection.find({}).fetch();
    // console.log(visitors);
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { visitors, pendingTasksCount };
  });

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ''
  }`;

  const logout = () => Meteor.logout();

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>
              📝️ To Do List
              {pendingTasksTitle}
            </h1>
          </div>
        </div>
      </header>

      <div className="main">
        { user ? 
          (< > 
            { 
              user.username=="meteorite" ? (
                <Fragment>
                  <div className="user" onClick={logout}>
                    {user.username || user.profile.name} 🚪
                  </div>

                  <TaskForm />


                  {isLoading && <div className="loading">loading...</div>}

                  <ul className="tasks">
                    {visitors.map(visitor => (
                      <Task
                        key={visitor._id}
                        visitor={visitor}
                        onAddVisit={addVisit}
                        makeNewBarcode={makeNewBarcode}
                        // onCheckboxClick={toggleChecked}
                        // onDeleteClick={deleteTask}
                      />
                    ))}
                  </ul>
                  <BarcodeScannerComponent
                    width={500}
                    height={500}
                    onUpdate={(err, result) => {
                      if (result) {
                        //call visits.insert function
                        // if successful make border of image green

                        setCamData(result.text);
                      }
                      else {
                        setCamData("Not Found")
                      };
                    }}
                  />
                </Fragment>
              ) : (
                <> </>
              )
            }
            </>
          ): (
            <LoginForm />
          )};
        
          
          
      </div>
    </div>
  );
};
