import { put, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_CYCLE_METRICS, POST_CYCLE_METRICS } from "../actionTypes";
import { fetchCycleMetricsSuccess, fetchCycleMetricsFail, postCycleMetricsSuccess, postCycleMetricsFail } from "../actions";
import { calcAssociateAggr, calcCycleAggr, sortMetircsByAssociate } from '../../shared/dataService';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_CYCLE_METRICS, fetchCycleMetrics),
    takeEvery(POST_CYCLE_METRICS, postCycleMetrics)
  ])
}

function* fetchCycleMetrics({ cycleName }) {
  try {
    const res = yield axios.get('/api/' + cycleName);
    // sort by associate
    const sortedMetrics = yield sortMetircsByAssociate(res.data);
    // calculate avg for projects, quizzes, soft skills
    const associateAggr = yield calcAssociateAggr(sortedMetrics);
    // calculate avgs for whole cycle
    const cycleAggr = yield calcCycleAggr(associateAggr);
    // combine into one object
    associateAggr[cycleName] = cycleAggr;
    yield put(fetchCycleMetricsSuccess(associateAggr, sortedMetrics, cycleName));
  } catch (err) {
    yield put(fetchCycleMetricsFail(err.message));
  }
}

function* postCycleMetrics({ formData }) {
  try {
    const res = yield axios.post('/api', formData);
    yield put(postCycleMetricsSuccess(res.data));
  } catch (err) {
    yield put(postCycleMetricsFail(err.message));
  }
}