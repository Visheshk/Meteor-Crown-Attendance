import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import Quagga from '@ericblade/quagga2'; 
import adapter from 'webrtc-adapter';
import { TasksCollection, VisitorsCollection } from '/imports/db/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';
import { UserLogger } from './UserLogger';

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
  // const user = ""

  // const [hideCompleted, setHideCompleted] = useState(false);
  const [camData, setCamData] = useState(0);
  const [stopStream, setStopStream] = useState(true);
  const [codeVisitor, setCodeVisitor] = useState({});

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const toggleQrReader = () => {
    // Stop the QR Reader stream (fixes issue where the browser freezes when closing the modal) and then dismiss the modal one tick later
    setStopStream(!stopStream);
    console.log(stopStream);
    // setTimeout(() => closeModal(), 0);
  }

  
  var video = document.getElementById('video');
  if(video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
   navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
     // video.src = window.URL.createObjectURL(stream);
     video.srcObject = stream;
     video.onloadedmetadata = () => {
       video.play();
       // if (detector)
       // poses = await detector.estimatePoses(video);
       // console.log(poses);
     };

     // video.play();
   });
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

  async function checkBarcode (barcode) {
    // console.log(camData);
    // console.log(barcode);
    // console.log(await findByBarcode(barcode));
    Meteor.call('visitors.findByBarcode', barcode, function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
        setCodeVisitor(res);
        // console.log()
        return res;
      }
    });
  }


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
              Data Recorder
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



                {/* {camData !== "Not Found" ? (
                  <div className='split-screen'>
                    <div className='scanner-column'>
                    <BarcodeScannerComponent
                      onUpdate={(err, result) => {
                        if (result) setCamData(result.text);
                        else setCamData("Not Found");
                      }}
                    />
                    </div>
                    <div className="barcode-column">
                      <h3>{camData}</h3>
                    </div>
                  </div>
                ) : (
                  <div className='centered-scanner'> 
                    <BarcodeScannerComponent
                      onUpdate={(err, result) => {
                        if (result) {
                          //call visits.insert function
                          // if successful make border of image green
                          setCamData(result.text);
                          checkBarcode(result.text);
                          // spotVisitor(result.text);
                        }
                        else {setCamData("Not Found")};
                      }}
                    />
                    <h3>{camData} {JSON.stringify(codeVisitor)} </h3>
                    <UserLogger visitors = {visitors}/>

                </Fragment>
              ) : (
                <>
                  <p>test</p>
                  <LoginForm />
                </>
              )
            }
            </>
          ): (
            <>
            <LoginForm />
              <p> hi</p>
            </>
          )};       
          
      </div>
    </div>
  );
};

export default App