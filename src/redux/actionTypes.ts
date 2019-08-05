import { Cycle } from '../models/types';

export const FETCH_ALL_CYCLES_METRICS = 'FETCH_ALL_CYCLES_METRICS';
export const FETCH_ALL_CYCLES_METRICS_SUCCESS = 'FETCH_ALL_CYCLES_METRICS_SUCCESS';
export const FETCH_ALL_CYCLES_METRICS_FAIL = 'FETCH_ALL_CYCLES_METRICS_FAIL';

export const POST_CYCLE_METRICS = 'POST_CYCLE_METRICS';
export const POST_CYCLE_METRICS_SUCCESS = 'POST_CYCLE_METRICS_SUCCESS';
export const POST_CYCLE_METRICS_FAIL = 'POST_CYCLE_METRICS_FAIL';

export const RESET_ERROR = 'RESET_ERROR;'

interface FetchAllCycleMetrics {
  type: typeof FETCH_ALL_CYCLES_METRICS;
}

interface FetchAllCycleMetricsFail {
  type: typeof FETCH_ALL_CYCLES_METRICS_FAIL;
  error: any;
}

interface FetchAllCycleMetricsSuccess {
  type: typeof FETCH_ALL_CYCLES_METRICS_SUCCESS;
  formattedCycles: Cycle[];
}

interface PostCycleMetrics {
  type: typeof POST_CYCLE_METRICS;
  formData: FormData;
  cycleName: string;
  history: History;
}

interface PostCycleMetricsFail {
  type: typeof POST_CYCLE_METRICS_FAIL;
  error: any;
}

interface PostCycleMetricsSuccess {
  type: typeof POST_CYCLE_METRICS_SUCCESS;
}

interface ResetError {
  type: typeof RESET_ERROR;
}

export type ActionTypes =
  | FetchAllCycleMetrics
  | FetchAllCycleMetricsFail
  | FetchAllCycleMetricsSuccess
  | PostCycleMetrics
  | PostCycleMetricsFail
  | PostCycleMetricsSuccess
  | ResetError;