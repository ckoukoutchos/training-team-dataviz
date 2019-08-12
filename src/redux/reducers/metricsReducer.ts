import { ActionTypes, FETCH_ALL_CYCLES_METRICS_SUCCESS } from '../actionTypes';
import { Cycle, CycleAggregation } from '../../models/types';

interface MetricsState {
  allCycleAggregations: any;
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  assessmentAggregations: any;
}

const initalState = {
  allCycleAggregations: [],
  cycleAggregations: [],
  cycles: [],
  assessmentAggregations: []
};

const metricsReducer = (
  state: MetricsState = initalState,
  action: ActionTypes
): MetricsState => {
  switch (action.type) {
    case FETCH_ALL_CYCLES_METRICS_SUCCESS:
      return {
        allCycleAggregations: action.allCycleAggregations,
        cycleAggregations: action.cycleAggregations,
        cycles: action.formattedCycles,
        assessmentAggregations: action.assessmentAggregations
      };
    default:
      return state;
  }
};

export default metricsReducer;
