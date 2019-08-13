/* global gapi */
import { put, all, takeEvery, select } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_ALL_CYCLES_METRICS } from '../actionTypes';
import {
  fetchAllCyclesMetricsSuccess,
  fetchAllCyclesMetricsFail,
  signOut
} from '../actions';
import {
  sortMetircsByAssociate,
  formatAssociateData,
  getCycleMetrics,
  formatCycleData,
  getAssociateAggregations,
  getCycleAggregations,
  getAllCyclesAggregations,
  sortMetricsByAssessmentType,
  formatAssessments
} from '../../shared/dataService';
import { History } from 'history';
import Metadata from '../../shared/metadata';
import { getToken } from './selectors';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_ALL_CYCLES_METRICS, fetchAllCyclesMetrics)
  ]);
}

function* getHeaders() {
	const token = yield select(getToken);
	return { headers: { 'x-access-token': token }};
}

function* fetchAllCyclesMetrics(): IterableIterator<{}> {
  try {
	const headers = yield getHeaders();
	const res = yield axios.get('/api/cycle', headers);
	const data = res.data;
    const {
      allCycleAggregations,
      cycleAggregations,
      formattedCycles,
      assessmentAggregations
    } = formatAllCycleData(data);
    yield put(
      fetchAllCyclesMetricsSuccess(
        allCycleAggregations,
        cycleAggregations,
        formattedCycles,
        assessmentAggregations
      )
    );
  } catch (err) {
	if(err.message && err.message.includes('401')) {
		let auth2 = gapi.auth2.getAuthInstance();
		yield auth2.signOut();
		yield put(signOut());
	}
	yield put(fetchAllCyclesMetricsFail(err));
  }
}

const getCycleData = (data: any, fileId: string, cycleName: string) => {
  // sort by associate
  const sortedMetrics = sortMetircsByAssociate(data);
  // pull out cycle specific metrics
  const cycleMetrics = getCycleMetrics(sortedMetrics);
  // format sorted metrics into Associate objects
  const formattedAssociates = sortedMetrics.map((associate: any) =>
    formatAssociateData(associate, cycleName)
  );
  // format Associates into Cycle object
  const formattedCycle = formatCycleData(
    cycleMetrics,
    formattedAssociates,
	cycleName,
	fileId
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

const formatAllCycleData = (data: any) => {
  const formattedCycles = [];
  const cycleAggregations = [];

  // for each cycle, collect data
  for (let i = 0; i < data.length; i++) {
    const { formattedCycle, cycleAggregation } = getCycleData(
		data[i].data, data[i].fileId, data[i].name
    );
    cycleAggregations.push(cycleAggregation);
    formattedCycles.push(formattedCycle);
  }
  // get overall aggregations
  const allCycleAggregations = getAllCyclesAggregations(cycleAggregations);
  // sort assessments by type
  const sortedAssessments = sortMetricsByAssessmentType(formattedCycles);
  // format assessments & calc average
  const assessmentAggregations = {
    projects: formatAssessments(
      sortedAssessments.projects,
      Metadata['Project (Score)']
    ),
    quizzes: formatAssessments(sortedAssessments.quizzes, Metadata.Quiz),
    softSkills: formatAssessments(
      sortedAssessments.softSkills,
      Metadata['Soft Skill Assessment']
    )
  };

  return { allCycleAggregations, cycleAggregations, formattedCycles, assessmentAggregations };
};
