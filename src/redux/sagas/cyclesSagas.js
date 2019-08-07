import { put, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_ALL_CYCLES_METRICS, POST_CYCLE_METRICS } from '../actionTypes';
import {
  fetchAllCyclesMetricsSuccess,
  fetchAllCyclesMetricsFail
} from '../actions';
import {
  sortMetircsByAssociate,
  formatAssociateData,
  getCycleMetrics,
  formatCycleData,
  getAssociateAggregations,
  getCycleAggregations,
  getAllCyclesAggregations
} from '../../shared/dataService';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_ALL_CYCLES_METRICS, fetchAllCyclesMetrics)
    // takeEvery(POST_CYCLE_METRICS, postCycleMetrics)
  ]);
}

function* fetchAllCyclesMetrics() {
  try {
    const res = yield axios.get('/api');
    const { cycles, data } = res.data;
    const {
      allCycleAggregations,
      cycleAggregations,
      formattedCycles
    } = formatAllCycleData(data, cycles);
    yield put(
      fetchAllCyclesMetricsSuccess(
        allCycleAggregations,
        cycleAggregations,
        formattedCycles
      )
    );
  } catch (err) {
    yield put(fetchAllCyclesMetricsFail(err));
  }
}

// function* postCycleMetrics({ formData, cycleName, history }) {
//   try {
//     const res = yield axios.post('/api/' + cycleName, formData);
//     yield put(postCycleMetricsSuccess(formatCycleDatas(res.data, cycleName)));
//     history.push('/cycle')
//   } catch (err) {
//     yield put(postCycleMetricsFail(err));
//   }
// }

const getCycleData = (data, cycleName) => {
  // sort by associate
  const sortedMetrics = sortMetircsByAssociate(data);
  // pull out cycle specific metrics
  const cycleMetrics = getCycleMetrics(sortedMetrics);
  // format sorted metrics into Associate objects
  const formattedAssociates = sortedMetrics.map(associate =>
    formatAssociateData(associate, cycleName)
  );
  // sort assessments scores from formatted associates
  // re-enable for assessment aggregation
  // const sortedAssessments = sortMetricsByAssessment(formattedAssociates);

  // format Associates into Cycle object
  const formattedCycle = formatCycleData(
    cycleMetrics,
    formattedAssociates,
    cycleName
  );
  // get associate level aggregations
  const associateAggregations = getAssociateAggregations(formattedAssociates);
  // get cycle level aggregations
  const cycleAggregation = getCycleAggregations(
    associateAggregations,
    cycleName
  );
  // get assessment level aggregations
  return { formattedCycle, cycleAggregation };
};

const formatAllCycleData = (data, cycles) => {
  const formattedCycles = [];
  const cycleAggregations = [];

  // for each cycle, collect data
  for (let i = 0; i < data.length; i++) {
    const { formattedCycle, cycleAggregation } = getCycleData(
      data[i],
      cycles[i]
    );
    cycleAggregations.push(cycleAggregation);
    formattedCycles.push(formattedCycle);
  }
  const allCycleAggregations = getAllCyclesAggregations(cycleAggregations);
  // console.log('allCycle', allCycleAggregations);

  return { allCycleAggregations, cycleAggregations, formattedCycles };
};
