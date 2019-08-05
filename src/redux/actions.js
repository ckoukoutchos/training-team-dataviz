import { FETCH_ALL_CYCLES_METRICS, FETCH_ALL_CYCLES_METRICS_SUCCESS, FETCH_ALL_CYCLES_METRICS_FAIL, POST_CYCLE_METRICS, POST_CYCLE_METRICS_SUCCESS, POST_CYCLE_METRICS_FAIL, RESET_ERROR } from './actionTypes';

export const fetchAllCyclesMetrics = () => ({
    type: FETCH_ALL_CYCLES_METRICS,
});

export const fetchAllCyclesMetricsSuccess = (cycleAggr, cycleMetadata, associateMetadata, cycleMetrics, allCycleAggr, cycleAggregation, formattedCycles) => ({
    type: FETCH_ALL_CYCLES_METRICS_SUCCESS,
    cycleAggr,
    cycleMetadata,
    associateMetadata,
    cycleMetrics,
    allCycleAggr,
    cycleAggregation,
    formattedCycles
});

export const fetchAllCyclesMetricsFail = error => ({
    type: FETCH_ALL_CYCLES_METRICS_FAIL,
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