import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';

import { CircularProgress } from '@material-ui/core';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import MetricsRollUp from '../../components/metricsRollUp/MetricsRollUp';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import { getUrlParams } from '../../shared/dataService';
import styles from './Cycle.module.css';

class Cycle extends Component {
  componentDidMount() {
    if (!Object.keys(this.props.cycleAggr).length) {
      this.props.fetchCycle();
    }
  }

  render() {
    const { cycleAggr, history } = this.props;
    const { url, cycle } = getUrlParams(history);

    return (
      !this.props.loading && cycleAggr[cycle] ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={url} />

          <RadarGraph
            data={[
              {
                avg: 'Projects',
                'Max': cycleAggr[cycle][cycle].projectMax,
                'Min': cycleAggr[cycle][cycle].projectMin,
                'Average': cycleAggr[cycle][cycle].projectAvg
              },
              {
                avg: 'Quizzes',
                'Max': cycleAggr[cycle][cycle].quizMax,
                'Min': cycleAggr[cycle][cycle].quizMin,
                'Average': cycleAggr[cycle][cycle].quizAvg
              },
              {
                avg: 'Soft Skills',
                'Max': cycleAggr[cycle][cycle].softSkillsMax,
                'Min': cycleAggr[cycle][cycle].softSkillsMin,
                'Average': cycleAggr[cycle][cycle].softSkillsAvg
              }
            ]}
            keys={['Average', 'Max', 'Min']}
          />

          <MetricsRollUp associate={cycleAggr[cycle][cycle]} />
          <MetricsRollUp associates={cycleAggr[cycle]} cycle={cycle} />
        </div>
        : <CircularProgress />
    );
  }
}

const mapStateToProps = state => ({
  cycleAggr: state.cycles.cycleAggr,
  loading: state.cycles.loading,
  mlPortland2019: state.cycles.mlPortland2019
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: () => dispatch(fetchCycleMetrics('mlPortland2019'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Cycle);