import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { AppState } from './redux/reducers/rootReducer';
import { Dispatch } from 'redux';

import { ActionTypes } from './redux/actionTypes';
import { resetError } from './redux/actions';

import styles from './App.module.css';
import Assessment from './containers/assessment/Assessment';
import Assessments from './containers/assessments/Assessments';
import Associate from './containers/associate/Associate';
import Associates from './containers/associates/Associates';
import Cycle from './containers/cycle/Cycle';
import Cycles from './containers/cycles/Cycles';
import DataFizz from './containers/data-fizz/DataFizz';
import Overview from './containers/overview/Overview';
import Modal from './components/modal/Modal';
import NavBar from './components/nav-bar/NavBar';
import Spinner from './components/spinner/Spinner';
import ProtectedRoute from './HOC/ProtectedRoute';
import GoogleApi from './components/auth/GoogleApi';
import SignInPage from './components/auth/SignInPage';
import Staff from './containers/staff/Staff';

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
              <Route path='/signin' exact component={SignInPage} />
              <ProtectedRoute path='/cycle' exact component={Cycles} />
              <ProtectedRoute path='/cycle/:cycle' exact component={Cycle} />
              <ProtectedRoute path='/associate' exact component={Associates} />
              <ProtectedRoute
                path='/cycle/:cycle/associate/:associateName'
                exact
                component={Associate}
              />
              <ProtectedRoute
                path='/assessment'
                exact
                component={Assessments}
              />
              <ProtectedRoute
                path='/assessment/:type/:assessment'
                exact
                component={Assessment}
              />
              <ProtectedRoute path='/staff' exact component={Staff} />
              <ProtectedRoute path='/data-fizz' exact component={DataFizz} />
              <ProtectedRoute path='/' component={Overview} />
            </Switch>
          </main>
        )}
        <GoogleApi />

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
