import { put, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_ALL_CYCLES_METRICS, POST_CYCLE_METRICS } from '../actionTypes.ts';
import { fetchAllCyclesMetricsSuccess, fetchAllCyclesMetricsFail, postCycleMetricsSuccess, postCycleMetricsFail } from '../actions';
import { calcAllCyclesPercentiles, calcAssociateAggr, calcCycleAggr, getCycleMetadata, sortMetircsByAssociate, getAssociateMetadata, formatAssociateData, getCycleMetrics, formatCycleData, getAssociateAggregations, getCycleAggregations, getAllCyclesAggregations, sortMetricsByAssessment } from '../../shared/dataService';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_ALL_CYCLES_METRICS, fetchAllCyclesMetrics),
    takeEvery(POST_CYCLE_METRICS, postCycleMetrics)
  ])
}

function* fetchAllCyclesMetrics() {
  try {
    const res = yield axios.get('/api');
    const { cycles, data } = res.data;
    yield put(fetchAllCyclesMetricsSuccess(...formatAllCycleData(data, cycles)));
  } catch (err) {
    yield put(fetchAllCyclesMetricsFail(err));
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

/* experimental */
const getCycleData = (data, cycleName) => {
  // sort by associate
  const sortedMetrics = sortMetircsByAssociate(data);
  // pull out cycle specific metrics
  const cycleMetrics = getCycleMetrics(sortedMetrics);
  // format sorted metrics into Associate objects
  const formattedAssociates = sortedMetrics.map((associate) => formatAssociateData(associate, cycleName));
  // sort assessments scores from formatted associates
  // re-enable for assessment aggregation
  // const sortedAssessments = sortMetricsByAssessment(formattedAssociates);

  // format Associates into Cycle object
  const formattedCycle = formatCycleData(cycleMetrics, formattedAssociates, cycleName);
  // get associate level aggregations
  const associateAggregations = getAssociateAggregations(formattedAssociates);
  // get cycle level aggregations
  const cycleAggregation = getCycleAggregations(associateAggregations, cycleName);
  // get assessment level aggregations
  return { formattedCycle, cycleAggregation };
}
/* experimental */


const formatCycleDatas = (data, cycleName) => {
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

const formatAllCycleData = (data, cycles) => {
  const associateMetadata = {};
  const cycleAggr = {};
  const cycleMetadata = {};
  const cycleMetrics = {};

  /* experimental */
  const formattedCycles = [];
  const cycleAggregations = [];
  /* experimental */

  // for each cycle, collect data
  for (let i = 0; i < data.length; i++) {
    let [associateAggr, metadata, associateMeta, sortedMetrics, cycleName] = formatCycleDatas(data[i], cycles[i]);

    for (let [key, value] of Object.entries(associateMeta)) {
      associateMetadata[key] = value;
    }
    cycleAggr[cycleName] = associateAggr;
    cycleMetadata[cycleName] = metadata;
    cycleMetrics[cycleName] = sortedMetrics;

    /* experimental */
    const { formattedCycle, cycleAggregation } = getCycleData(data[i], cycles[i]);
    cycleAggregations.push(cycleAggregation);
    formattedCycles.push(formattedCycle);
    /* experimental */
  }
  // all cycle aggregations
  const allCycleAggr = calcAllCyclesPercentiles(cycleAggr);
  // get overall aggregations

  // const allCycleAggregations = getAllCyclesAggregations(cycleAggregation);
  // console.log('allCycle', allCycleAggregations);

  return [cycleAggr, cycleMetadata, associateMetadata, cycleMetrics, allCycleAggr, cycleAggregations, formattedCycles];
}