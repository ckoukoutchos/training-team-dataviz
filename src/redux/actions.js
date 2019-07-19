import { FETCH_CYCLE_METRICS, FETCH_CYCLE_METRICS_SUCCESS, FETCH_CYCLE_METRICS_FAIL, POST_CYCLE_METRICS, POST_CYCLE_METRICS_SUCCESS, POST_CYCLE_METRICS_FAIL } from './actionTypes';

export const fetchCycleMetrics = () => ({
    type: FETCH_CYCLE_METRICS
});

export const fetchCycleMetricsSuccess = (cycleMetrics) => ({
    type: FETCH_CYCLE_METRICS_SUCCESS,
    cycleMetrics
});

export const fetchCycleMetricsFail = (error) => ({
    type: FETCH_CYCLE_METRICS_FAIL,
    error
});

export const postCycleMetrics = (formData) => ({
    type: POST_CYCLE_METRICS,
    formData
});

export const postCycleMetricsSuccess = (cycleMetrics) => ({
    type: POST_CYCLE_METRICS_SUCCESS,
    cycleMetrics
});

export const postCycleMetricsFail = (error) => ({
    type: POST_CYCLE_METRICS_FAIL,
    error
});