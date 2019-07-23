import { FETCH_CYCLE_METRICS, FETCH_CYCLE_METRICS_SUCCESS, FETCH_CYCLE_METRICS_FAIL, POST_CYCLE_METRICS, POST_CYCLE_METRICS_SUCCESS, POST_CYCLE_METRICS_FAIL } from './actionTypes';

export const fetchCycleMetrics = cycleName => ({
    type: FETCH_CYCLE_METRICS,
    cycleName
});

export const fetchCycleMetricsSuccess = (cycleAggr, cycleMetrics, cycleName) => ({
    type: FETCH_CYCLE_METRICS_SUCCESS,
    cycleAggr,
    cycleMetrics,
    cycleName
});

export const fetchCycleMetricsFail = error => ({
    type: FETCH_CYCLE_METRICS_FAIL,
    error
});

export const postCycleMetrics = (formData, cycleName, history) => ({
    type: POST_CYCLE_METRICS,
    formData,
    cycleName,
    history
});

export const postCycleMetricsSuccess = (cycleAggr, cycleMetrics, cycleName) => ({
    type: POST_CYCLE_METRICS_SUCCESS,
    cycleAggr,
    cycleMetrics,
    cycleName
});

export const postCycleMetricsFail = error => ({
    type: POST_CYCLE_METRICS_FAIL,
    error
});