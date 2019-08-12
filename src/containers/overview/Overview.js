import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllCyclesMetrics } from '../../redux/actions/cycleActions';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import Spinner from '../../components/spinner/Spinner';

class Overview extends Component {
  componentDidMount() {
    this.props.fetchAllCycles();
  }

  render() {
    const { allCycleAggr } = this.props;
    let graph = <Spinner />;

    if (Object.keys(allCycleAggr).length) {
      graph = (<RadarGraph
        title='All Cycles Assesments'
        subtitle='For the 10th, 25th, 50th, 75th and 90th Percentile'
        keys={['10th', '25th', '50th', '75th', '90th']}
        index='index'
        tall
        data={[
          {
            index: 'Projects',
            '10th': allCycleAggr.projectPercentiles[0],
            '25th': allCycleAggr.projectPercentiles[1],
            '50th': allCycleAggr.projectPercentiles[2],
            '75th': allCycleAggr.projectPercentiles[3],
            '90th': allCycleAggr.projectPercentiles[4]
          },
          {
            index: 'Quizzes',
            '10th': allCycleAggr.quizPercentiles[0],
            '25th': allCycleAggr.quizPercentiles[1],
            '50th': allCycleAggr.quizPercentiles[2],
            '75th': allCycleAggr.quizPercentiles[3],
            '90th': allCycleAggr.quizPercentiles[4]
          },
          {
            index: 'Soft Skills',
            '10th': allCycleAggr.softSkillsPercentiles[0],
            '25th': allCycleAggr.softSkillsPercentiles[1],
            '50th': allCycleAggr.softSkillsPercentiles[2],
            '75th': allCycleAggr.softSkillsPercentiles[3],
            '90th': allCycleAggr.softSkillsPercentiles[4]
          }
        ]}
      />);
    }

    return graph;
  }
}

const mapStateToProps = state => ({
  allCycleAggr: state.cycles.allCycleAggr
});

const mapDispatchToProps = dispatch => ({
  fetchAllCycles: () => dispatch(fetchAllCyclesMetrics())
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);