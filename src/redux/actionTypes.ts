import { Cycle, CycleAggregation } from '../models/types';

export const FETCH_ALL_CYCLES_METRICS = 'FETCH_ALL_CYCLES_METRICS';
export const FETCH_ALL_CYCLES_METRICS_SUCCESS =
  'FETCH_ALL_CYCLES_METRICS_SUCCESS';
export const FETCH_ALL_CYCLES_METRICS_FAIL = 'FETCH_ALL_CYCLES_METRICS_FAIL';

export const RESET_ERROR = 'RESET_ERROR;';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

interface FetchAllCycleMetrics {
  type: typeof FETCH_ALL_CYCLES_METRICS;
}

interface FetchAllCycleMetricsFail {
  type: typeof FETCH_ALL_CYCLES_METRICS_FAIL;
  error: any;
}

interface FetchAllCycleMetricsSuccess {
  type: typeof FETCH_ALL_CYCLES_METRICS_SUCCESS;
  allCycleAggregations: any;
  cycleAggregations: CycleAggregation[];
  formattedCycles: Cycle[];
  assessmentAggregations: any;
  cycleMetadata: any;
}

interface ResetError {
  type: typeof RESET_ERROR;
}

interface SignIn {
  type: typeof SIGN_IN,
  user: any;
}

interface SignOut {
  type: typeof SIGN_OUT
}

export type ActionTypes =
  | FetchAllCycleMetrics
  | FetchAllCycleMetricsFail
  | FetchAllCycleMetricsSuccess
  | ResetError
  | SignIn
  | SignOut;
