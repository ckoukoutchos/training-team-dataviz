import React, { Component } from 'react';
import './App.css';

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

  render() {
    return (
      <div>
        {this.state.data}
      </div>
    );
  }
}

export default App;
