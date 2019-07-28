import { FETCH_ALL_CYCLES_METRICS, FETCH_ALL_CYCLES_METRICS_SUCCESS, FETCH_ALL_CYCLES_METRICS_FAIL, FETCH_CYCLE_METRICS, FETCH_CYCLE_METRICS_SUCCESS, FETCH_CYCLE_METRICS_FAIL, POST_CYCLE_METRICS, POST_CYCLE_METRICS_SUCCESS, POST_CYCLE_METRICS_FAIL, RESET_ERROR } from '../actionTypes';

const initialState = {
  allCycleAggr: {},
  associateMetadata: {},
  cycleAggr: {},
  cycleMetadata: [],
  cycleMetrics: [],
  error: null,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL_CYCLES_METRICS: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }
    case FETCH_ALL_CYCLES_METRICS_SUCCESS: {
      return {
        ...state,
        allCycleAggr: action.allCycleAggr,
        associateMetadata: action.associateMetadata,
        cycleAggr: action.cycleAggr,
        cycleMetadata: action.cycleMetadata,
        cycleMetrics: action.cycleMetrics,
        loading: false,
      };
    }
    case FETCH_ALL_CYCLES_METRICS_FAIL: {
      return {
        ...state,
        error: action.error,
        loading: false
      }
    }
    case FETCH_CYCLE_METRICS: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }
    case FETCH_CYCLE_METRICS_SUCCESS: {
      return {
        ...state,
        associateMetadata: newAssociateMetadata(state, action),
        cycleAggr: newCycleAggr(state, action),
        cycleMetadata: newCycleMetadata(state, action),
        cycleMetrics: newCycleMetrics(state, action),
        loading: false,
      };
    }
    case FETCH_CYCLE_METRICS_FAIL: {
      return {
        ...state,
        error: action.error,
        loading: false
      }
    }
    case POST_CYCLE_METRICS: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }
    case POST_CYCLE_METRICS_SUCCESS: {
      return {
        ...state,
        associateMetadata: newAssociateMetadata(state, action),
        cycleAggr: newCycleAggr(state, action),
        cycleMetadata: newCycleMetadata(state, action),
        cycleMetrics: newCycleMetrics(state, action),
        loading: false,
      };
    }
    case POST_CYCLE_METRICS_FAIL: {
      return {
        ...state,
        error: action.error,
        loading: false
      }
    }
    case RESET_ERROR: {
      return {
        ...state,
        error: null,
        loading: false
      }
    }
    default:
      return state;
  }
}

const newAssociateMetadata = (state, action) => {
  const newAssociateMetadata = {};
  for (let [key, value] of Object.entries(state.associateMetadata)) {
    newAssociateMetadata[key] = value;
  }
  for (let [key, value] of Object.entries(action.associateMetadata)) {
    newAssociateMetadata[key] = value;
  }
  return newAssociateMetadata;
}

const newCycleAggr = (state, action) => {
  const newCycleAggr = {};
  for (let [key, value] of Object.entries(state.cycleAggr)) {
    newCycleAggr[key] = value;
  }
  newCycleAggr[action.cycleName] = action.cycleAggr
  return newCycleAggr;
}

const newCycleMetadata = (state, action) => {
  const newCycleMetadata = {};
  for (let [key, value] of Object.entries(state.cycleMetadata)) {
    newCycleMetadata[key] = value;
  }
  newCycleMetadata[action.cycleName] = action.cycleMetadata
  return newCycleMetadata;
}

const newCycleMetrics = (state, action) => {
  const newCycleMetrics = {};
  for (let [key, value] of Object.entries(state.cycleMetrics)) {
    newCycleMetrics[key] = value;
  }
  newCycleMetrics[action.cycleName] = action.cycleMetrics
  return newCycleMetrics;
}