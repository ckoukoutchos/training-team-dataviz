import {
  FETCH_ALL_CYCLES_METRICS,
  FETCH_ALL_CYCLES_METRICS_SUCCESS,
  FETCH_ALL_CYCLES_METRICS_FAIL,
  RESET_ERROR,
  SIGN_IN,
  SIGN_OUT,
  ActionTypes
} from './actionTypes';
import { History } from 'history';
import { CycleAggregation, Cycle } from '../models/types';

export const fetchAllCyclesMetrics = (): ActionTypes => ({
  type: FETCH_ALL_CYCLES_METRICS
});

export const fetchAllCyclesMetricsSuccess = (
  allCycleAggregations: any,
  cycleAggregations: CycleAggregation[],
  formattedCycles: Cycle[],
  assessmentAggregations: any
): ActionTypes => ({
  type: FETCH_ALL_CYCLES_METRICS_SUCCESS,
  allCycleAggregations,
  cycleAggregations,
  formattedCycles,
  assessmentAggregations
});

export const fetchAllCyclesMetricsFail = (error: any): ActionTypes => ({
  type: FETCH_ALL_CYCLES_METRICS_FAIL,
  error
});

export const resetError = (): ActionTypes => ({
  type: RESET_ERROR
});

export const signIn = (user: any): ActionTypes => ({
	type: SIGN_IN,
	user
});

export const signOut = (): ActionTypes => ({
	type: SIGN_OUT
});
