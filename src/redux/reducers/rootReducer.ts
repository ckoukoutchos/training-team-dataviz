import { combineReducers } from 'redux';
import metricsReducer from './metricsReducer';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
  metrics: metricsReducer,
  session: sessionReducer
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;