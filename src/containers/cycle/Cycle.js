import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';

import styles from './Cycle.module.css';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

class Cycle extends Component {
  componentDidMount() {
    if (!this.props.mlPortland2019.length) {
      this.props.fetchCycle();
    }
  }

  render() {
    return (
      !this.props.loading ?
        <Paper className={styles.Container}>
          <Table className={styles.Table}>
            <TableHead>
              <TableRow>
                <TableCell>Person</TableCell>
                <TableCell align='right'>Interaction</TableCell>
                <TableCell align='right'>Interaction Type</TableCell>
                <TableCell align='right'>Score</TableCell>
                <TableCell align='right'>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {this.props.mlPortland2019.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align='right'>{row.Person}</TableCell>
                  <TableCell align='right'>{row.Interaction}</TableCell>
                  <TableCell align='right'>{row['Interaction Type']}</TableCell>
                  <TableCell align='right'>{row.Score}</TableCell>
                  <TableCell align='right'>{row.Date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        : <CircularProgress />
    );
  }
}

const mapStateToProps = state => ({
  loading: state.cycles.loading,
  mlPortland2019: state.cycles.mlPortland2019
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: () => dispatch(fetchCycleMetrics())
});

export default connect(mapStateToProps, mapDispatchToProps)(Cycle);