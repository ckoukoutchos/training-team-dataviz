import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postCycleMetrics } from '../../redux/actions';
import { Button, Card, CardContent, CardActions, CardHeader, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Spinner from '../spinner/Spinner';
import styles from './Upload.module.css';
import Metadata from '../../shared/metadata';
import CONSTS from '../../shared/constants';

class Upload extends Component {
  state = {
    selectedCycle: ''
  }

  uploadFileHandler = () => {
    const formData = new FormData();
    formData.append('file', this.uploadInput.files[0]);

    this.props.postCycle(formData, this.state.selectedCycle, this.props.history);
  }

  selectHandler = evt => {
    this.setState({ selectedCycle: evt.target.value });
  }

  render() {
    const { selectedCycle } = this.state;
    const { error, loading } = this.props;

    const cycleList = Metadata.cycles.map((cycle, index) => {
      return <MenuItem key={index} value={cycle}>{CONSTS[cycle]}</MenuItem>
    });

    return !loading ?
      <Card className={styles.Card}>
        <CardHeader title='Upload a CSV File:' />
        {error ? <p className={styles.Error}>{error}</p> : null}

        <div className={styles.Container}>
          <FormControl className={styles.Select}>
            <InputLabel htmlFor='cycles'>Select Cycle</InputLabel>
            <Select
              value={selectedCycle}
              onChange={this.selectHandler}
              inputProps={{
                id: 'cycles',
              }}
            >
              {cycleList}
            </Select>
          </FormControl>
        </div>

        <CardContent>
          <input accept='.csv'
            ref={(ref) => { this.uploadInput = ref; }}
            type='file' />
        </CardContent>

        <CardActions>
          <Button variant="contained"
            color="primary"
            onClick={this.uploadFileHandler}
            disabled={selectedCycle === ''}>
            Upload
          </Button>
        </CardActions>
      </Card>
      : <Spinner />;
  }
}

const mapStateToProps = state => ({
  error: state.cycles.error,
  loading: state.cycles.loading
});

const mapDispatchToProps = dispatch => ({
  postCycle: (formData, cycleName, history) => dispatch(postCycleMetrics(formData, cycleName, history))
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);