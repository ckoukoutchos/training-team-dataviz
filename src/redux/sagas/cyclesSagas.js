import { put, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_ALL_CYCLES_METRICS, FETCH_CYCLE_METRICS, POST_CYCLE_METRICS } from "../actionTypes";
import { fetchAllCyclesMetricsSuccess, fetchCycleMetricsSuccess, fetchCycleMetricsFail, postCycleMetricsSuccess, postCycleMetricsFail } from "../actions";
import { calcAllCyclesPercentiles, calcAssociateAggr, calcCycleAggr, getCycleMetadata, sortMetircsByAssociate, getAssociateMetadata, formatAssociateData, getCycleMetrics, formatCycleData } from '../../shared/dataService';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_ALL_CYCLES_METRICS, fetchAllCyclesMetrics),
    takeEvery(FETCH_CYCLE_METRICS, fetchCycleMetrics),
    takeEvery(POST_CYCLE_METRICS, postCycleMetrics)
  ])
}

function* fetchAllCyclesMetrics() {
  try {
    const res = yield axios.get('/api');
    const { cycles, data } = res.data;
    yield put(fetchAllCyclesMetricsSuccess(...formatAllCycleData(data, cycles)));
  } catch (err) {
    yield put(fetchCycleMetricsFail(err));
  }
}

function* fetchCycleMetrics({ cycleName }) {
  try {
    const res = yield axios.get('/api/' + cycleName);
    yield put(fetchCycleMetricsSuccess(...formatCycleDatas(res.data, cycleName)));
  } catch (err) {
    yield put(fetchCycleMetricsFail(err));
  }
}

function* postCycleMetrics({ formData, cycleName, history }) {
  try {
    const res = yield axios.post('/api/' + cycleName, formData);
    yield put(postCycleMetricsSuccess(...formatCycleDatas(res.data, cycleName)));
    history.push('/cycle')
  } catch (err) {
    yield put(postCycleMetricsFail(err));
  }
}

const formatCycleDatas = (data, cycleName) => {
  // sort by associate
  const sortedMetrics = sortMetircsByAssociate(data);

  // experimental
  const cycleMetrics = getCycleMetrics(sortedMetrics);
  const formattedAssociates = sortedMetrics.map((associate) => formatAssociateData(associate, cycleName));
  const formattedCycle = formatCycleData(cycleMetrics, formattedAssociates, cycleName);
  console.log(formattedCycle);

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

const formatAllCycleData = (data, cycles) => {
  const associateMetadata = {};
  const cycleAggr = {};
  const cycleMetadata = {};
  const cycleMetrics = {};
  // for each cycle, collect data
  for (let i = 0; i < data.length; i++) {
    let [associateAggr, metadata, associateMeta, sortedMetrics, cycleName] = formatCycleDatas(data[i], cycles[i]);

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