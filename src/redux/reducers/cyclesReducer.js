import { FETCH_CYCLE_METRICS, FETCH_CYCLE_METRICS_SUCCESS, FETCH_CYCLE_METRICS_FAIL, POST_CYCLE_METRICS, POST_CYCLE_METRICS_SUCCESS, POST_CYCLE_METRICS_FAIL } from '../actionTypes';

const initialState = {
  error: null,
  loading: false,
  mlPortland2019: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_CYCLE_METRICS: {
      return {
        ...state,
        loading: true
      };
    }
    case FETCH_CYCLE_METRICS_SUCCESS: {
      return {
        ...state,
        loading: false,
        mlPortland2019: [...action.cycleMetrics]
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
        loading: true
      };
    }
    case POST_CYCLE_METRICS_SUCCESS: {
      console.log(action.cycleMetrics);
      return {
        ...state,
        loading: false,
        mlPortland2019: [...action.cycleMetrics]
      };
    }
    case POST_CYCLE_METRICS_FAIL: {
      return {
        ...state,
        error: action.error,
        loading: false
      }
    }
    default:
      return state;
  }
}