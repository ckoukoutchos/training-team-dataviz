import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import styles from './App.module.css';
import { Modal } from '@material-ui/core';
import Associate from './containers/associate/Associate';
import Cycle from './containers/cycle/Cycle';
import Cycles from './containers/cycles/Cycles';
import Overview from './containers/overview/Overview';
import NavBar from './components/NavBar/NavBar';
import Upload from './components/upload/Upload';

class App extends Component {
  state = {
    showModal: false
  }

  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
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
            {/* <Route path='/cycle/:cycle/associate' exact component={Associates} /> */}
            <Route path='/cycle/:cycle/associate/:associateName' exact component={Associate} />
            <Route path='/upload' exact component={Upload} />
            <Route path='/' component={Overview} />
          </Switch>
        </main>

        {error || this.state.showModal ? <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.state.showModal || !!error}
          onClose={this.toggleModal}
        >
          <div className={styles.Modal}>
            <h2 id='modal-title'>Oops, something went wrong!</h2>
            <p id='simple-modal-description'>
              {error}
            </p>
          </div>
        </Modal> : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  error: state.cycles.error
});


export default connect(mapStateToProps)(App);
