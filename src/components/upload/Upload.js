import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postCycleMetrics } from '../../redux/actions';
import { Button, Card, CardContent, CardActions, CardHeader, CircularProgress } from '@material-ui/core';
import styles from './Upload.module.css';

class Upload extends Component {
  uploadFileHandler = () => {
    console.log('here?');
    const formData = new FormData();
    formData.append('file', this.uploadInput.files[0]);
    formData.append('name', 'mlPortland2019');

    this.props.postCycle(formData);
  }

  render() {
    return !this.props.loading ?
      <Card className={styles.Card}>
        <CardHeader title='Upload a CSV File:' />
        {this.props.error ? <p className={styles.Error}>{this.props.error}</p> : null}

        <CardContent>
          <input accept='.csv'
            ref={(ref) => { this.uploadInput = ref; }}
            type='file' />
        </CardContent>

        <CardActions>
          <Button variant="contained"
            color="primary"
            onClick={this.uploadFileHandler}>
            Upload
          </Button>
        </CardActions>
      </Card>
      : <CircularProgress />;
  }
}

const mapStateToProps = state => ({
  error: state.cycles.error,
  loading: state.cycles.loading
});

const mapDispatchToProps = dispatch => ({
  postCycle: (formData) => dispatch(postCycleMetrics(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);