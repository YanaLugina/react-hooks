import React, { useState, useEffect } from 'react';
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

const PlanetInfo = ({ id }) => {
  const [ name, setName ] = useState('');
  const [ idPlanet, setIdPlanet ] = useState(id);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    // вводим переменную для возможности отменить применение результата промиса
    // для предотвращения race condition проблемы

    // we introduce a variable for the ability to cancel the application of the result of the promise
    // to prevent race condition problems
    let cancelled = false;

    fetch(`https://swapi.co/api/planets/${id}`)
        .then(res => res.json())
        .then(data => {
          !cancelled && setName(data.name);
          !cancelled && setIdPlanet(id);
          setLoading(false);
        }, );

    return () => cancelled = true;
  }, [id]);


  return (
      <div>
      { loading ? 'loading...'
          : `Planet: id: ${idPlanet} - name: ${name}`
      }
      </div>
  );
};



export default App;
