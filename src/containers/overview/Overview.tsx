import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../../redux/reducers/rootReducer';
import { ActionTypes } from '../../redux/actionTypes';
import { fetchAllCyclesMetrics } from '../../redux/actions';

import RadarGraph from '../../components/radar-graph/RadarGraph';
import { CycleAggregation } from '../../models/types';

interface OverviewProps {
  allCycleAggregations: any;
  cycleAggregations: CycleAggregation[];
  fetchAllCycles: () => ActionTypes;
}

class Overview extends Component<OverviewProps> {
  componentDidMount() {
    if (!this.props.cycleAggregations.length) {
      this.props.fetchAllCycles();
    }
  }

  render() {
    const { allCycleAggregations } = this.props;
    return (
      <RadarGraph
        title='All Cycles Assesments'
        subtitle='Average Score'
        keys={['Training Average']}
        index='index'
        data={[
          {
            index: 'Projects',
            'Training Average': allCycleAggregations.projects
          },
          {
            index: 'Quizzes',
            'Training Average': allCycleAggregations.quizzes
          },
          {
            index: 'Soft Skills',
            'Training Average': allCycleAggregations.softSkills
          }
        ]}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  allCycleAggregations: state.metrics.allCycleAggregations,
  cycleAggregations: state.metrics.cycleAggregations
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchAllCycles: () => dispatch(fetchAllCyclesMetrics())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
