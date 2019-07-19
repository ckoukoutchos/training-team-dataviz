import React, { Component } from 'react';
import './App.css';
import Spinner from './Spinner';
import { ResponsiveBullet } from '@nivo/bullet';

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
    return (
      // <div style={{ height: '500px', width: '500px' }}>
      //   {this.state.data ?
      //     <ResponsiveBullet
      //       data={this.state.data}
      //       margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
      //       layout='vertical'
      //       spacing={50}
      //       titleOffsetY={-19}
      //       markerSize={0.9}
      //       measureSize={0.5}
      //       rangeColors={['rgb(98, 207, 107)', 'rgb(207, 98, 98)']}
      //       measureColors='rgb(233, 233, 233)'
      //       markerColors={['rgb(56, 121, 61)', 'rgb(117, 55, 55)']}
      //     /> : <Spinner />}
      // </div>
      <>
        <label>Upload a CSV File:</label>
        <input accept='.csv' ref={(ref) => { this.uploadInput = ref; }} type='file' />

        <button onClick={this.uploadFileHandler}>Upload</button>
        {/* <input type='file' accept='.csv' onChange={this.uploadFileHandler}></input> */}
      </>
    );
  }
}

export default App;
