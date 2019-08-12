import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { resetError } from './redux/actions/cycleActions';
import styles from './App.module.css';
import { Button, Modal } from '@material-ui/core';
import Associate from './containers/associate/Associate';
import Associates from './containers/associates/Associates';
import Cycle from './containers/cycle/Cycle';
import Cycles from './containers/cycles/Cycles';
import Overview from './containers/overview/Overview';
import NavBar from './components/nav-bar/NavBar';
import GoogleApi from './components/auth/GoogleApi';
import SignInPage from './components/auth/SignInPage';
import ProtectedRoute from './ProtectedRoute';

class App extends Component {

  toggleModal = () => {
    this.props.resetError();
  }

  render() {
    const { error } = this.props;

    return (
      <>
        <NavBar />
        <main className={styles.Main}>
          <Switch>
		  	<Route path='/signin' exact component={SignInPage} />
            <ProtectedRoute path='/cycle' exact component={Cycles} />
            <ProtectedRoute path='/cycle/:cycle' exact component={Cycle} />
            <ProtectedRoute path='/associate' exact component={Associates} />
            <ProtectedRoute path='/cycle/:cycle/associate/:associateName' exact component={Associate} />
            <ProtectedRoute path='/' component={Overview} />
          </Switch>
        </main>
		<GoogleApi />

        {error ? <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={!!error}
          onClose={this.toggleModal}
        >
          <div className={styles.Modal}>
            <h2 id='modal-title'>Oops, something went wrong!</h2>
            <p id='simple-modal-description'>
              {error.message}
            </p>
            <p id='simple-modal-description'>
              {error.response.data}
            </p>
            <Button
              variant="contained"
              className={styles.Button}
              onClick={this.toggleModal}>
              Close
            </Button>
          </div>
        </Modal> : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  error: state.cycles.error
});

const mapDispatchToProps = dispatch => ({
  resetError: () => dispatch(resetError())
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
