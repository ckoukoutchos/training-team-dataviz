import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';

import { CircularProgress } from '@material-ui/core';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import MetricsRollUp from '../../components/metricsRollUp/MetricsRollUp';
import styles from './Cycle.module.css';

class Cycle extends Component {
  componentDidMount() {
    if (!this.props.mlPortland2019.length) {
      this.props.fetchCycle();
    }
  }

  render() {
    return (
      !this.props.loading ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={this.props.history.location.pathname.split('/')} />
          <MetricsRollUp associate={[].concat(...this.props.mlPortland2019)} />
          <MetricsRollUp associates={this.props.mlPortland2019} cycleName='mlPortland2019' showName />
        </div>
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