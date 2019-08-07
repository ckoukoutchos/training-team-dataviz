import {
  FETCH_ALL_CYCLES_METRICS,
  FETCH_ALL_CYCLES_METRICS_SUCCESS,
  FETCH_ALL_CYCLES_METRICS_FAIL,
  POST_CYCLE_METRICS,
  POST_CYCLE_METRICS_SUCCESS,
  POST_CYCLE_METRICS_FAIL,
  RESET_ERROR,
  ActionTypes
} from './actionTypes';
import { CycleAggregation, Cycle } from '../models/types';

export const fetchAllCyclesMetrics = (): ActionTypes => ({
  type: FETCH_ALL_CYCLES_METRICS
});

export const fetchAllCyclesMetricsSuccess = (
  allCycleAggregations: any,
  cycleAggregations: CycleAggregation[],
  formattedCycles: Cycle[]
): ActionTypes => ({
  type: FETCH_ALL_CYCLES_METRICS_SUCCESS,
  allCycleAggregations,
  cycleAggregations,
  formattedCycles
});

export const fetchAllCyclesMetricsFail = (error: any): ActionTypes => ({
  type: FETCH_ALL_CYCLES_METRICS_FAIL,
  error
});

export const postCycleMetrics = (
  formData: FormData,
  cycleName: string,
  history: History
): ActionTypes => ({
  type: POST_CYCLE_METRICS,
  formData,
  cycleName,
  history
});

// export const postCycleMetricsSuccess = (cycleAggr, cycleMetadata, associateMetadata, cycleMetrics, cycleName): ActionTypes => ({
//     type: POST_CYCLE_METRICS_SUCCESS,
//     cycleAggr,
//     cycleMetadata,
//     associateMetadata,
//     cycleMetrics,
//     cycleName
// });

export const postCycleMetricsFail = (error: any): ActionTypes => ({
  type: POST_CYCLE_METRICS_FAIL,
  error
});

export const resetError = (): ActionTypes => ({
  type: RESET_ERROR
});
