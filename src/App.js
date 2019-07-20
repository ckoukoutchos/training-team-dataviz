import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Associate from './containers/associate/Associate';
import Cycle from './containers/cycle/Cycle';
import Overview from './containers/overview/Overview';
import NavBar from './components/NavBar/NavBar';
import Upload from './components/upload/Upload';

const App = (props) =>
  <>
    <NavBar />
    <Switch>
      {/* <Route path='/cycles' component={Cycles} /> */}
      <Route path='/cycles/:cycle' exact component={Cycle} />
      {/* <Route path='/cycles/:cycle/associates' component={Associates} /> */}
      <Route path='/cycles/:cycle/associates/:associateName' exact component={Associate} />
      <Route path='/upload' exact component={Upload} />
      <Route path='/' component={Overview} />
    </Switch>
  </>;

export default App;
