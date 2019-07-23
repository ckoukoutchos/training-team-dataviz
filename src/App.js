import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Associate from './containers/associate/Associate';
import Cycle from './containers/cycle/Cycle';
import Cycles from './containers/cycles/Cycles';
import Overview from './containers/overview/Overview';
import NavBar from './components/NavBar/NavBar';
import Upload from './components/upload/Upload';

const App = (props) =>
  <>
    <NavBar />
    <Switch>
      <Route path='/cycle' exact component={Cycles} />
      <Route path='/cycle/:cycle' exact component={Cycle} />
      {/* <Route path='/cycle/:cycle/associate' exact component={Associates} /> */}
      <Route path='/cycle/:cycle/associate/:associateName' exact component={Associate} />
      <Route path='/upload' exact component={Upload} />
      <Route path='/' component={Overview} />
    </Switch>
  </>;

export default App;
