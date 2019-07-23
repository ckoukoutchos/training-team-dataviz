import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import CycleInfo from '../../components/cycle-info/CycleInfo';
import MetricsRollUp from '../../components/metrics-roll-up/MetricsRollUp';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import Spinner from '../../components/spinner/Spinner';
import { getUrlParams } from '../../shared/dataService';
import CONSTS from '../../shared/constants';
import styles from './Cycle.module.css';

class Cycle extends Component {
  componentDidMount() {
    const { cycle } = getUrlParams(this.props.history);
    // only fetches if not already in memory
    if (!Object.keys(this.props.cycleAggr).includes(cycle)) {
      this.props.fetchCycle(cycle);
    }
  }

  render() {
    const { cycleAggr, cycleMetadata, cycleMetrics, history } = this.props;
    const { url, cycle } = getUrlParams(history);

    return ( 
      !this.props.loading && cycleAggr[cycle] && cycleMetadata[cycle] && cycleMetrics[cycle] ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={url} />

          <CycleInfo cycleName={CONSTS[cycle]} metadata={cycleMetadata[cycle]} />

          <RadarGraph
            title='Running Averages of Projects, Quizzes, and Soft Skills'
            subtitle='Including the Max and Min Associate Running Average'
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
        : <Spinner />
    );
  }
}

const mapStateToProps = state => ({
  cycleAggr: state.cycles.cycleAggr,
  cycleMetadata: state.cycles.cycleMetadata,
  cycleMetrics: state.cycles.cycleMetrics,
  loading: state.cycles.loading
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: (cycleName) => dispatch(fetchCycleMetrics(cycleName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Cycle);