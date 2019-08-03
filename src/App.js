import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { resetError } from './redux/actions';
import styles from './App.module.css';
import { Button, Modal } from '@material-ui/core';
import Associate from './containers/associate/Associate';
import Associates from './containers/associates/Associates';
import Cycle from './containers/cycle/Cycle';
import Cycles from './containers/cycles/Cycles';
import Overview from './containers/overview/Overview';
import NavBar from './components/nav-bar/NavBar';
import Upload from './components/upload/Upload';

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
            <Route path='/cycle' exact component={Cycles} />
            <Route path='/cycle/:cycle' exact component={Cycle} />
            <Route path='/associate' exact component={Associates} />
            <Route path='/cycle/:cycle/associate/:associateName' exact component={Associate} />
            <Route path='/upload' exact component={Upload} />
            <Route path='/' component={Overview} />
          </Switch>
        </main>

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
              {error.response ? error.response.data : 'Error'}
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
