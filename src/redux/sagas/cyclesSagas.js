import { put, all, takeEvery, select } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_ALL_CYCLES_METRICS, FETCH_CYCLE_METRICS } from "../actions/actionTypes";
import { fetchAllCyclesMetricsSuccess, fetchCycleMetricsSuccess, fetchCycleMetricsFail } from "../actions/cycleActions";
import { calcAllCyclesPercentiles, calcAssociateAggr, calcCycleAggr, getCycleMetadata, sortMetircsByAssociate, getAssociateMetadata } from '../../shared/dataService';
import { getToken } from './selectors';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_ALL_CYCLES_METRICS, fetchAllCyclesMetrics),
    takeEvery(FETCH_CYCLE_METRICS, fetchCycleMetrics)
  ])
}

function* getHeaders() {
	const token = yield select(getToken);
	return { headers: { 'x-access-token': token }};
}

function* fetchAllCyclesMetrics() {
  try {
	const headers = yield getHeaders();
	const res = yield axios.get('/api/cycle', headers);
    const data = res.data;
    yield put(fetchAllCyclesMetricsSuccess(...formatAllCycleData(data)));
  } catch (err) {
    yield put(fetchCycleMetricsFail(err));
  }
}

function* fetchCycleMetrics({ cycleName, fileId }) {
  try {
    const res = yield axios.get('/api/cycle' + fileId, getHeaders());
    yield put(fetchCycleMetricsSuccess(...formatCycleData(res.data, cycleName)));
  } catch (err) {
    yield put(fetchCycleMetricsFail(err));
  }
}

const formatCycleData = (data, fileId, cycleName) => {
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
  const metadata = getCycleMetadata(data, fileId);

  return [associateAggr, metadata, associateMetadata, sortedMetrics, cycleName];
}

const formatAllCycleData = (data) => {
  const associateMetadata = {};
  const cycleAggr = {};
  const cycleMetadata = {};
  const cycleMetrics = {};
  // for each cycle, collect data
  for (let i = 0; i < data.length; i++) {
	let [associateAggr, metadata, associateMeta, sortedMetrics, cycleName] = 
		formatCycleData(data[i].data, data[i].fileId, data[i].name);

    for (let [key, value] of Object.entries(associateMeta)) {
      associateMetadata[key] = value;
    }
    cycleAggr[cycleName] = associateAggr;
    cycleMetadata[cycleName] = metadata;
    cycleMetrics[cycleName] = sortedMetrics;
  }
  // all cycle aggregations
  const allCycleAggr = calcAllCyclesPercentiles(cycleAggr);

  return [cycleAggr, cycleMetadata, associateMetadata, cycleMetrics, allCycleAggr];
}