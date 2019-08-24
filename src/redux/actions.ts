import {
  FETCH_ALL_CYCLES_METRICS,
  FETCH_ALL_CYCLES_METRICS_SUCCESS,
  FETCH_ALL_CYCLES_METRICS_FAIL,
  RESET_ERROR,
  SIGN_IN,
  SIGN_OUT,
  ActionTypes
} from './actionTypes';
import {
  Assessment,
  CycleAggregation,
  Cycle,
  AssessmentTypeAggregation
} from '../models/types';

export const fetchAllCyclesMetrics = (): ActionTypes => ({
  type: FETCH_ALL_CYCLES_METRICS
});

export const fetchAllCyclesMetricsSuccess = (
  assessments: AssessmentTypeAggregation,
  assessmentAggregations: AssessmentTypeAggregation,
  cycles: Cycle[],
  cycleAggregations: CycleAggregation[],
  cycleMetadata: any
): ActionTypes => ({
  type: FETCH_ALL_CYCLES_METRICS_SUCCESS,
  cycleAggregations,
  cycles,
  assessmentAggregations,
  assessments,
  cycleMetadata
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
