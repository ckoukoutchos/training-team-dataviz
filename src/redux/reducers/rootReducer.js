import { combineReducers } from 'redux';
import cyclesReducer from './cyclesReducer';
import signInReducer from './signInReducer';

export default combineReducers({ cycles: cyclesReducer, user: signInReducer });