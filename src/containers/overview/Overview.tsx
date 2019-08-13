import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../../redux/reducers/rootReducer';
import { ActionTypes } from '../../redux/actionTypes';
import { fetchAllCyclesMetrics } from '../../redux/actions';
import { Cycle } from '../../models/types';

import CycleInfo from '../../components/cycle-info/CycleInfo';
import ExpansionPanel from '../../components/expansion-panel/ExpansionPanel';
import TraditionalCycleProgress from '../../components/progression/traditional-cycle-progess/TraditionalCycleProgress';
import TrainingInfo from '../../components/training-info/TrainingInfo';
import MLCycleProgress from '../../components/progression/ml-cycle-progress/MLCycleProgress';

interface OverviewProps {
  cycles: Cycle[];
  lookup: any;
  fetchAllCycles: () => ActionTypes;
}

class Overview extends Component<OverviewProps> {
  componentDidMount() {
    if (!this.props.cycles.length) {
      this.props.fetchAllCycles();
    }
  }

  render() {
    const { cycles, lookup } = this.props;

    const cycleProgressions = cycles.map((cycle: Cycle, index: number) => {
      if (cycle.type !== 'Mastery Learning') {
        return (
          <TraditionalCycleProgress
            item={cycle}
            key={index}
            subtitle={cycle.type}
            title={lookup[cycle.name]}
          >
            <ExpansionPanel>
              <CycleInfo bodyOnly cycle={cycle} cycleName={cycle.name} />
            </ExpansionPanel>
          </TraditionalCycleProgress>
        );
      } else {
        return (
          <MLCycleProgress
            cycle={cycle}
            key={index}
            subtitle={cycle.type}
            title={lookup[cycle.name]}
          >
            <ExpansionPanel>
              <CycleInfo bodyOnly cycle={cycle} cycleName={cycle.name} />
            </ExpansionPanel>
          </MLCycleProgress>
        );
      }
    });

    return (
      <>
        <TrainingInfo cycles={cycles} />
        {cycleProgressions}
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  cycles: state.metrics.cycles,
  lookup: state.metadata.cycleNameLookup
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchAllCycles: () => dispatch(fetchAllCyclesMetrics())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
