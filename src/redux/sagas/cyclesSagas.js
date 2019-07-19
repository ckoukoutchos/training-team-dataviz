import { put, all, takeEvery } from 'redux-saga/effects';
import { FETCH_CYCLE_METRICS, POST_CYCLE_METRICS } from "../actionTypes";
import { fetchCycleMetricsSuccess, fetchCycleMetricsFail, postCycleMetricsSuccess, postCycleMetricsFail } from "../actions";
import axios from 'axios';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_CYCLE_METRICS, fetchCycleMetrics),
    takeEvery(POST_CYCLE_METRICS, postCycleMetrics)
  ])
}

function* fetchCycleMetrics() {
  try {
    const res = yield axios.get('/api/mlPortland2019');
    yield put(fetchCycleMetricsSuccess(res.data));
  } catch(err) {
    yield put(fetchCycleMetricsFail(err.message));
  }
}

function* postCycleMetrics({ formData }) {
  try {
    const res = yield axios.post('/api', formData);
    yield put(postCycleMetricsSuccess(res.data));
  } catch(err) {
    yield put(postCycleMetricsFail(err.message));
  }
}