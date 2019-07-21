import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';

import styles from './Cycle.module.css';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import MetricsRollUp from '../../components/metricsRollUp/MetricsRollUp';

class Cycle extends Component {
  componentDidMount() {
    if (!this.props.mlPortland2019.length) {
      this.props.fetchCycle();
    }
  }

  render() {
    // console.log(this.props.mlPortland2019);
    return (
      !this.props.loading ?
        <MetricsRollUp associates={this.props.mlPortland2019} cycleName='mlPortland2019' showName />
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