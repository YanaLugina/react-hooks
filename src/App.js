import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

const App = () => {
  const [value, setValue] = useState(3);
  const [visible, setVisible] = useState(true);

  if(visible) {
    return (
        <div className="App">
          <HookSwitcher />
          <button
              onClick={() => setValue((s) => s + 1)}>+</button>
          <button
              onClick={() => setVisible(false)}>hide</button>
          <PlanetInfo id={value} />
        </div>
    );
  } else {
    return <div className="App"><button className="ShowButton" onClick={() => setVisible(true)}>show</button></div>
  }
};


const HookSwitcher = () => {
  const [ color, setColor ] = useState('white');

  return(
      <div style={{
        padding: '10px',
        backgroundColor: color,
        color: 'blue'}}>
        <button
            onClick={() => setColor('black')}>
          Dark
        </button>
        <button
            onClick={() => setColor('white')}>
          Ligth
        </button>

      </div>
  );
};

const getPlanet = (id) => {
  return fetch(`https://swapi.co/api/planets/${id}/`)
      .then(res => res.json())
      .then(data => data);
};

const useRequest = (request) => {
  const initialState = useMemo(() => ({
    data: null,
    loading: true,
    error: null
  }), []);

  const [ dataState, setDataState ] = useState(initialState);

  useEffect(() => {
    setDataState(initialState);
    // вводим переменную для возможности отменить применение результата промиса
    // для предотвращения race condition проблемы

    // we introduce a variable for the ability to cancel the application of the result of the promise
    // to prevent race condition problems
    let cancelled = false;

    request()
        .then(data => !cancelled && setDataState({
          data,
          loading: false,
          error: null
        }))
        .catch(error => !cancelled && setDataState({
          data: null,
          loading: false,
          error
        }));
    return () => cancelled = true;
  }, [ request, initialState ]);

  return dataState;
};

const usePlanetInfo = (id) => {
  const request = useCallback(
      () => getPlanet(id), [ id ]);
  return useRequest(request);
};

const PlanetInfo = ({ id }) => {

const { data, loading, error } = usePlanetInfo(id);

  if(error) {
    return <div>Something is wrong</div>
  }

  if(loading) {
    return <div>Loading...</div>
  }

  return (
      <div>
      { `Planet: id: ${id} - name: ${data.name}` }
      </div>
  );
};



export default App;
