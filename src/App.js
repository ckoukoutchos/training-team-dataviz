import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';
import { ResponsiveBullet } from '@nivo/bullet';
import Button from '@material-ui/core/Button';
import { AppBar, CardContent, CardActions, CardHeader, CircularProgress, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

class App extends Component {
  state = {
    data: null
  };

  componentDidMount() {
    this.fetchData()
      .then(res => {
        this.setState({ data: res.data });
      }).catch(err => console.log('Error', err));
  }

  fetchData = async () => {
    const res = await fetch('/api');
    const body = await res.json();

    if (res.status !== 200) {
      throw Error(body.message)
    }
    return body;
  }

  uploadFileHandler = () => {
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('name', 'ML');

    fetch('/api', { method: 'POST', body: data }).then((response) => {
      response.json().then((body) => {
        console.log(body);
      });
    });
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
      <div style={{ height: '500px', width: '500px' }}>
        {this.state.data ?
          <ResponsiveBullet
            data={this.state.data}
            margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
            layout='vertical'
            spacing={50}
            titleOffsetY={-19}
            markerSize={0.9}
            measureSize={0.5}
            rangeColors={['rgb(98, 207, 107)', 'rgb(207, 98, 98)']}
            measureColors='rgb(233, 233, 233)'
            markerColors={['rgb(56, 121, 61)', 'rgb(117, 55, 55)']}
          /> : <CircularProgress />}
      </div>
      <Card>
        <CardHeader title='Upload a CSV File:' />
        <CardContent>
          <input accept='.csv' ref={(ref) => { this.uploadInput = ref; }} type='file' />
        </CardContent>

        <CardActions>
          <Button variant="contained" color="primary" onClick={this.uploadFileHandler}>Upload</Button>
        </CardActions>
      </Card>
    </>
    );
  }
}

export default App;
