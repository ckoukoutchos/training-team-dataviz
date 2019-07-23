import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography } from '@material-ui/core';
import styles from './Cycles.module.css';
import Metadata from '../../shared/metadata';
import CONSTS from '../../shared/constants';

class Cycles extends Component {
  render() {
    const cycleList = Metadata.cycles.map((cycle, index) => (
      <Paper key={index} className={styles.Paper}>
        <Typography variant="h5" component="h3">
          <Link to={'/cycle/' + cycle} className={styles.Link}>{CONSTS[cycle]}</Link>
        </Typography>
      </Paper>
    ));

    return (
      <div className={styles.Container}>
        {cycleList}
      </div>
    )
  };
}

export default Cycles;