import { combineReducers } from 'redux';
import metricsReducer from './metricsReducer';
import sessionReducer from './sessionReducer';
import signInReducer from './signInReducer';

const rootReducer = combineReducers({
  metrics: metricsReducer,
  session: sessionReducer,
  user: signInReducer
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;