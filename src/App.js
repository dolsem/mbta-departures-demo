import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import logo from './logo.svg';
import './App.css';

import { fetchSchedules } from './controllers/schedule';

const columns = [
  { Header: 'TIME', accessor: ({ arrival }) => arrival.toLocaleTimeString(), id: 'arrival' },
  { Header: 'DESTINATION', accessor: 'destination' },
  { Header: 'TRAIN', accessor: 'train' },
  { Header: 'STATUS', accessor: 'status' },
];

function App({ location, match }) {
  const apiKey = JSON.parse(new URLSearchParams(location.search).get('api_key'));
  const { stopId } = match.params;

  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules(stopId, apiKey)
      .then((data) => {
        setSchedules(data);
        setLoading(false);
      })
      .catch((e) => {
        alert(`${e.constructor.name}: ${e.message}`);
        throw e;
      });
  }, [setSchedules, apiKey, stopId]);

  return (
    <div className="App">
      {loading
        ? (
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
        )
      : (
        <ReactTable
          data={schedules}
          columns={columns}
        />
      )}
    </div>
  );
}

export default App;
