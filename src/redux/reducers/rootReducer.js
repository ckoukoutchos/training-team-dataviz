import { combineReducers } from 'redux';
import cyclesReducer from './cyclesReducer';

export default combineReducers({ cycles: cyclesReducer });