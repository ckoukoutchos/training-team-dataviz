import { ActionTypes, FETCH_ALL_CYCLES_METRICS_SUCCESS, FETCH_ALL_CYCLES_METRICS_FAIL, FETCH_ALL_CYCLES_METRICS, RESET_ERROR } from '../actionTypes';

interface SessionState {
  error: any | null;
  loading: boolean;
}

const initialState = {
  error: null,
  loading: false
}

const sessionReducer = (state: SessionState = initialState, action: ActionTypes): SessionState => {
  switch (action.type) {
    case FETCH_ALL_CYCLES_METRICS: return { error: false, loading: true };
    case FETCH_ALL_CYCLES_METRICS_SUCCESS: return { error: false, loading: false };
	case FETCH_ALL_CYCLES_METRICS_FAIL: return { error: action.error, loading: false };
	case RESET_ERROR: return { error: null, loading: false };
    default: return state;
  }
}

export default sessionReducer;