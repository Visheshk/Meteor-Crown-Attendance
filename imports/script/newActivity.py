import os
import sys

def add_route_to_routes(activity_name, event_name, routes_file):
    route_code = f'''
FlowRouter.route("/{event_name}", {{
  name: '{event_name}',
  action() {{
    mount(AppRoute, {{
      content: <{activity_name} activityName="{activity_name}" eventName="{event_name}" />
    }});
  }}
}});
'''
    with open(routes_file, 'a') as file:
        file.write(route_code)

def add_logic_to_microbit_talker(activity_name, microbit_talker_file):
    with open(microbit_talker_file, 'r') as file:
        content = file.read()
    
    marker = 'const uartMessage = function (event) {'
    insert_code = f'''
    if (act === "{activity_name}") {{
      if (pageField === "{activity_name}_start" || pageField === "{activity_name}_stop") {{
        const log = {{
          activity: "{activity_name}",
          pageField: pageField,
          epochTime: Date.now(),
          timestamp: new Date().toISOString(),
          claimed: false,
          cleared: false,
        }};
        Meteor.call('devicelogs.insert', log);
      }}
    }}
'''
    new_content = content.replace(marker, marker + insert_code)
    
    with open(microbit_talker_file, 'w') as file:
        file.write(new_content)

def create_activity_template(activity_name, activity_template_file):
    template_code = f'''
import React, {{ useState, useRef }} from 'react';
import {{ useTracker }} from 'meteor/react-meteor-data';
import {{ DeviceCollection, ScoreCollection }} from '/imports/db/TasksCollection';
import {{ DataGrid }} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {{ ScannerComp }} from './ScannerComp';
import ScoreboardClock from './dashscoreboard';
import MicrobitTalker from './MicrobitTalker';

const {activity_name} = ({{ activityName, eventName }}) => {{
  const [speedRows, setSpeedRows] = useState([]);
  const [userInfo, setUserInfo] = useState({{}});
  const [eventId, setEventId] = useState("");
  const stateRef = useRef();

  stateRef.current = [0, 0, 0];
  stateRef.current[1] = userInfo;
  stateRef.current[2] = eventId;

  const childUserIdUpdate = ({{ data }}) => {{
    setUserInfo(data);
  }}

  const columns = [
    {{ field: 'start', headerName: 'Start', flex: 1, minWidth: 100 }},
    {{ field: 'stop', headerName: 'Stop', flex: 1, minWidth: 100 }},
    {{ field: 'speed', headerName: 'Speed (seconds)', flex: 1, minWidth: 100 }},
    {{
      field: 'buttons', headerName: '', minWidth: 100, flex: 1,
      sortable: false,
      renderCell: ({{ row }}) =>
        <Button size="small" variant="outlined" disabled={{row.disabled}} onClick={{() => claimEntry(row)}}>
          Claim
        </Button>,
    }},
  ];

  const claimEntry = function (row) {{
    let thisid = row.id;
    let startId = thisid.slice((thisid.indexOf("start:") + 6), thisid.indexOf("::"));
    let stopId = thisid.slice((thisid.indexOf("stop:") + 5));

    let dd = new Date();
    let log = {{
      activity: activityName,
      eventId: stateRef.current[2],
      score: row.speed,
      logInfo: {{ row }},
      epochTime: dd.getTime(),
      userBarcode: userInfo.barcodeId,
      userInfo: userInfo,
      timestamp: dd.toISOString()
    }};
    Meteor.call('score.addLog', log);
    Meteor.call('devlogs.claim', [startId, stopId], userInfo);
  }}

  const clearLogs = function () {{
    Meteor.call('devlogs.clearByTime', [`{{eventName}}start`, `{{eventName}}stop`]);
  }}

  const setupStartStopTable = function (logs) {{
    let rows = [];
    let lastStartIndex = -1;
    let startRow = {{}};

    for (let r in logs) {{
      if (logs[r].pageField === `{{eventName}}start`) {{
        lastStartIndex = r;
        startRow = {{
          start: logs[r]["timestamp"].slice(11, 23),
          stop: "",
          speed: "",
          id: `soloStart:{{logs[r]["_id"]}}`,
          disabled: true
        }}
      }} else if (logs[r].pageField === `{{eventName}}stop`) {{
        if (lastStartIndex > -1) {{
          let tr = {{
            start: logs[lastStartIndex]["timestamp"].slice(11, 23),
            stop: logs[r]["timestamp"].slice(11, 23),
            speed: (logs[r]["epochTime"] - logs[lastStartIndex]["epochTime"]) / 1000,
            id: `start:{{logs[lastStartIndex]["_id"]}}::stop:{{logs[r]["_id"]}}`,
            disabled: (Object.keys(stateRef.current[1]).length === 0 || stateRef.current[2] === "")
          }};
          rows.push(tr);
          startRow = {{}};
          lastStartIndex = -1;
        }}
      }}
    }}
    if (Object.keys(startRow).length > 0) {{
      rows.push(startRow);
    }}
    return rows;
  }}

  const {{ devLogs, rows }} = useTracker(() => {{
    const handler = Meteor.subscribe('devicelogs');
    const devLogs = DeviceCollection.find({{
      $and: [
        {{ activity: activityName }},
        {{ claimed: {{ $ne: true }} }},
        {{ cleared: {{ $ne: true }} }},
      ]
    }}).fetch();

    const rows = setupStartStopTable(devLogs);
    return {{ devLogs, rows }};
  }});

  stateRef.current[0] = devLogs;

  return (
    <Box>
      <MicrobitTalker act={activityName} />
      {{rows ? (
        <Box>
          <ScoreboardClock rows={rows} columns={columns} />
        </Box>
      ) : <> </>}}
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button variant="contained" onClick={clearLogs}>Clear</Button>
      </Box>
      <Box>
        <ScannerComp spotUser={childUserIdUpdate} />
      </Box>
    </Box>
  )
}}

export default {activity_name};
'''
    with open(activity_template_file, 'w') as file:
        file.write(template_code)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python add_new_activity.py <activity_name>")
        sys.exit(1)
    
    activity_name = sys.argv[1]
    event_name = activity_name.lower()

    # Define file paths
    routes_file = '/mnt/data/routes.jsx'
    microbit_talker_file = '/mnt/data/MicrobitTalker.jsx'
    activity_template_file = f'/mnt/data/{activity_name}.jsx'

    # Run the functions to update the files
    add_route_to_routes(activity_name, event_name, routes_file)
    add_logic_to_microbit_talker(activity_name, microbit_talker_file)
    create_activity_template(activity_name, activity_template_file)

    print(f"New activity '{activity_name}' added successfully!")
