import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { fetchCycleMetrics } from './redux/actions';

import Overview from './containers/overview/Overview';
import NavBar from './components/NavBar/NavBar';

class App extends Component {
  componentDidMount() {
    this.props.fetchCycle();
  }

  render() {
    return (
      <>
        <NavBar />
        <Switch>
          {/* <Route path='/associates' component={Associates} /> */}
          {/* <Route path='/associates/:associateName' component={Associate} /> */}
          {/* <Route path='/cycles' component={Cycles} /> */}
          {/* <Route path='/cycles/:cycleName' component={Cycle} /> */}
          <Route path='/' component={Overview} />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = state => ({
  mlPortland2019: state.cycles.mlPortland2019
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: () => dispatch(fetchCycleMetrics())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
