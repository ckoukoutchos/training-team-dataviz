import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { History } from 'history';
import { postCycleMetrics } from '../../redux/actions';
import {
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';

import styles from './Upload.module.css';
import Metadata from '../../shared/metadata';
import CONSTS from '../../shared/constants';
import { ActionTypes } from '../../redux/actionTypes';

interface UploadProps {
  history: History;
  postCycle: (
    formData: FormData,
    cycleName: string,
    history: History
  ) => ActionTypes;
}

interface UploadState {
  selectedCycle: string;
}

class Upload extends Component<UploadProps, UploadState> {
  state = {
    selectedCycle: ''
  };

  uploadInput = createRef<HTMLInputElement>();

  uploadFileHandler = () => {
    const formData = new FormData();
    if (this.uploadInput.current) {
      //@ts-ignore
      formData.append('file', this.uploadInput.current.files[0]);
      this.props.postCycle(
        formData,
        this.state.selectedCycle,
        this.props.history
      );
    }
  };

  selectHandler = (evt: any) => {
    this.setState({ selectedCycle: evt.target.value });
  };

  render() {
    const { selectedCycle } = this.state;

    const cycleList = Metadata.cycles.map((cycle, index) => {
      return (
        <MenuItem key={index} value={cycle}>
          {CONSTS[cycle]}
        </MenuItem>
      );
    });

    return (
      <Card className={styles.Card}>
        <CardHeader title='Upload a CSV File:' />

        <div className={styles.Container}>
          <FormControl className={styles.Select}>
            <InputLabel htmlFor='cycles'>Select Cycle</InputLabel>
            <Select
              value={selectedCycle}
              onChange={this.selectHandler}
              inputProps={{
                id: 'cycles'
              }}
            >
              {cycleList}
            </Select>
          </FormControl>
        </div>

        <CardContent>
          <input accept='.csv' ref={this.uploadInput} type='file' />
        </CardContent>

        <CardActions>
          <Button
            variant='contained'
            color='primary'
            onClick={this.uploadFileHandler}
            disabled={selectedCycle === ''}
          >
            Upload
          </Button>
        </CardActions>
      </Card>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  postCycle: (formData: FormData, cycleName: string, history: History) =>
    dispatch(postCycleMetrics(formData, cycleName, history))
});

export default connect(
  null,
  mapDispatchToProps
)(Upload);
