import { put, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_CYCLE_METRICS, POST_CYCLE_METRICS } from "../actionTypes";
import { fetchCycleMetricsSuccess, fetchCycleMetricsFail, postCycleMetricsSuccess, postCycleMetricsFail } from "../actions";
import { calcAssociateAggr, calcCycleAggr, getCycleMetadata, sortMetircsByAssociate, getAssociateMetadata } from '../../shared/dataService';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_CYCLE_METRICS, fetchCycleMetrics),
    takeEvery(POST_CYCLE_METRICS, postCycleMetrics)
  ])
}

function* fetchCycleMetrics({ cycleName }) {
  try {
    const res = yield axios.get('/api/' + cycleName);
    yield put(fetchCycleMetricsSuccess(...formatCycleData(res.data, cycleName)));
  } catch (err) {
    yield put(fetchCycleMetricsFail(err.message));
  }
}

function* postCycleMetrics({ formData, cycleName, history }) {
  try {
    const res = yield axios.post('/api/' + cycleName, formData);
    yield put(postCycleMetricsSuccess(...formatCycleData(res.data, cycleName)));
    history.push('/cycle')
  } catch (err) {
    yield put(postCycleMetricsFail(err.message));
  }
}

const formatCycleData = (data, cycleName) => {
  // sort by associate
  const sortedMetrics = sortMetircsByAssociate(data);
  // collect associate module metadata
  const associateMetadata = getAssociateMetadata(sortedMetrics);
  // calculate avg for projects, quizzes, soft skills
  const associateAggr = calcAssociateAggr(sortedMetrics);
  // calculate avgs for whole cycle
  const cycleAggr = calcCycleAggr(associateAggr);
  // combine into one object
  associateAggr[cycleName] = cycleAggr;
  // collect cycle metadata
  const metadata = getCycleMetadata(data);

  return [associateAggr, metadata, associateMetadata, sortedMetrics, cycleName];
}