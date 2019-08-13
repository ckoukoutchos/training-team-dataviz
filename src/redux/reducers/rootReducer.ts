import { combineReducers } from 'redux';
import metricsReducer from './metricsReducer';
import sessionReducer from './sessionReducer';
import signInReducer from './signInReducer';
import { SIGN_OUT } from '../actionTypes';
import metadataReducer from './metadataReducer';

const appReducer = combineReducers({
  metrics: metricsReducer,
  session: sessionReducer,
  user: signInReducer,
  metadata: metadataReducer
});

const rootReducer = (state: any, action: any) => {
	if(action.type === SIGN_OUT) {
		state = undefined
	}
	return appReducer(state, action);
}

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;