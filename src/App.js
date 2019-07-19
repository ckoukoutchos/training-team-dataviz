import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from './redux/actions';

import Upload from './components/upload/Upload';
import Card from '@material-ui/core/Card';
import { ResponsiveBullet } from '@nivo/bullet';
import Button from '@material-ui/core/Button';
import { AppBar, CardContent, CardActions, CardHeader, CircularProgress, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

class App extends Component {
  componentDidMount() {
    this.props.fetchCycle();
  }

  render() {
    return (<>
      <div style={{ display: 'flex' }}>
        <AppBar position='static' style={{ flexDirection: 'row' }}>
          <IconButton edge='start' color='inherit' aria-label='Menu' style={{ margin: '0 16px' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' style={{ paddingTop: '8px' }}>Training Team DataViz</Typography>
        </AppBar>
      </div>
      <Upload />
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
