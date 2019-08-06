import { ActionTypes, FETCH_ALL_CYCLES_METRICS_SUCCESS } from '../actionTypes';
import { Cycle, CycleAggregation } from '../../models/types';

interface MetricsState {
  allCycleAggregations: any;
  aggregations: CycleAggregation[],
  cycles: Cycle[]
}

const initalState = {
  allCycleAggregations: [],
  aggregations: [],
  cycles: []
};

const metricsReducer = (state: MetricsState = initalState, action: ActionTypes): MetricsState => {
  switch (action.type) {
    case FETCH_ALL_CYCLES_METRICS_SUCCESS:
      return {
        allCycleAggregations: action.allCycleAggregations,
        aggregations: action.cycleAggregations,
        cycles: action.formattedCycles
      };
    default: return state;
  }
}

export default metricsReducer;