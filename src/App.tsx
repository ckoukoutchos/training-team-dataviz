import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { AppState } from './redux/reducers/rootReducer';
import { Dispatch } from 'redux';

import { ActionTypes } from './redux/actionTypes';
import { resetError } from './redux/actions';

import styles from './App.module.css';
import Associate from './containers/associate/Associate';
import Associates from './containers/associates/Associates';
import Cycle from './containers/cycle/Cycle';
import Cycles from './containers/cycles/Cycles';
import Overview from './containers/overview/Overview';
import Modal from './components/modal/Modal';
import NavBar from './components/nav-bar/NavBar';
import Upload from './components/upload/Upload';
import Spinner from './components/spinner/Spinner';

interface AppProps {
  error: any | null;
  loading: boolean;
  resetError: () => ActionTypes;
}

class App extends Component<AppProps> {
  toggleModal = () => {
    this.props.resetError();
  };

  render() {
    const { error, loading } = this.props;

    return (
      <>
        <NavBar />
        {loading ? (
          <Spinner />
        ) : (
          <main className={styles.Main}>
            <Switch>
              <Route path='/cycle' exact component={Cycles} />
              <Route path='/cycle/:cycle' exact component={Cycle} />
              <Route path='/associate' exact component={Associates} />
              <Route
                path='/cycle/:cycle/associate/:associateName'
                exact
                component={Associate}
              />
              <Route path='/upload' exact component={Upload} />
              <Route path='/' component={Cycles} />
            </Switch>
          </main>
        )}

        {error ? <Modal error={error} toggleModal={this.toggleModal} /> : null}
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  error: state.session.error,
  loading: state.session.loading
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetError: () => dispatch(resetError())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
