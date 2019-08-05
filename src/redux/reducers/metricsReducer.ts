import { Cycle } from '../../models/types';
import { ActionTypes, FETCH_ALL_CYCLES_METRICS_SUCCESS } from '../actionTypes';

const metricsReducer = (state: Cycle[] = [], action: ActionTypes) => {
  switch (action.type) {
    case FETCH_ALL_CYCLES_METRICS_SUCCESS:
      console.log(action.formattedCycles);
      return state = action.formattedCycles;
    default: return state;
  }
}

export default metricsReducer;