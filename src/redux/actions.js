import { FETCH_ALL_CYCLES_METRICS, FETCH_ALL_CYCLES_METRICS_SUCCESS, FETCH_ALL_CYCLES_METRICS_FAIL, FETCH_CYCLE_METRICS, FETCH_CYCLE_METRICS_SUCCESS, FETCH_CYCLE_METRICS_FAIL, POST_CYCLE_METRICS, POST_CYCLE_METRICS_SUCCESS, POST_CYCLE_METRICS_FAIL, RESET_ERROR } from './actionTypes';

export const fetchAllCyclesMetrics = () => ({
    type: FETCH_ALL_CYCLES_METRICS,
});

export const fetchAllCyclesMetricsSuccess = (cycleAggr, cycleMetadata, associateMetadata, cycleMetrics, allCycleAggr) => ({
    type: FETCH_ALL_CYCLES_METRICS_SUCCESS,
    cycleAggr,
    cycleMetadata,
    associateMetadata,
    cycleMetrics,
    allCycleAggr
});

export const fetchAllCyclesMetricsFail = error => ({
    type: FETCH_ALL_CYCLES_METRICS_FAIL,
    error
});

export const fetchCycleMetrics = cycleName => ({
    type: FETCH_CYCLE_METRICS,
    cycleName
});

export const fetchCycleMetricsSuccess = (cycleAggr, cycleMetadata, associateMetadata, cycleMetrics, cycleName) => ({
    type: FETCH_CYCLE_METRICS_SUCCESS,
    cycleAggr,
    cycleMetadata,
    associateMetadata,
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

export const postCycleMetricsSuccess = (cycleAggr, cycleMetadata, associateMetadata, cycleMetrics, cycleName) => ({
    type: POST_CYCLE_METRICS_SUCCESS,
    cycleAggr,
    cycleMetadata,
    associateMetadata,
    cycleMetrics,
    cycleName
});

export const postCycleMetricsFail = error => ({
    type: POST_CYCLE_METRICS_FAIL,
    error
});

export const resetError = () => ({
    type: RESET_ERROR
});