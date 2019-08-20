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
  sortMetircsByPerson,
  formatAssociateData,
  formatCycleData,
  getAssociateAggregations,
  getCycleAggregations,
  getAllCyclesAggregations,
  sortMetricsByAssessmentType,
  formatAssessments,
  formatStaffData
} from '../../shared/dataService';
import Metadata from '../../shared/metadata';
import { getToken } from './selectors';
import { Metric } from '../../models/types';

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_ALL_CYCLES_METRICS, fetchAllCyclesMetrics)
  ]);
}

function* getHeaders() {
  const token = yield select(getToken);
  return { headers: { 'x-access-token': token } };
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
      assessmentAggregations,
      cycleMetadata
    } = formatAllCycleData(data);
    yield put(
      fetchAllCyclesMetricsSuccess(
        allCycleAggregations,
        cycleAggregations,
        formattedCycles,
        assessmentAggregations,
        cycleMetadata
      )
    );
  } catch (err) {
    if (err.message && err.message.includes('401')) {
      //@ts-ignore
      let auth2 = gapi.auth2.getAuthInstance();
      yield auth2.signOut();
      yield put(signOut());
    }
    yield put(fetchAllCyclesMetricsFail(err));
  }
}

const getCycleData = (data: Metric[], metadata: any) => {
  const cycleName = metadata.name;
  // sort metrics by associate/staff/cycle
  const { associates, cycle, staff } = sortMetircsByPerson(data);
  // format sorted metrics into Associate objects
  const formattedAssociates = associates.map((associate: Metric[]) =>
    formatAssociateData(associate, cycleName)
  );
  // format sorted metrics into Staff objects
  const formattedStaff = staff.map((staff: Metric[]) =>
    formatStaffData(staff, cycleName)
  );
  // format metrics into Cycle object
  const formattedCycle = formatCycleData(
    cycle,
    formattedStaff,
    formattedAssociates,
    cycleName,
    metadata.fileId
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
  const cycleMetadata = {};

  // for each cycle, collect data
  for (let i = 0; i < data.length; i++) {
    const metadata = data[i].metadata;
    const { formattedCycle, cycleAggregation } = getCycleData(
      data[i].data, metadata
    );
    cycleAggregations.push(cycleAggregation);
    formattedCycles.push(formattedCycle);
    cycleMetadata[metadata.name] = metadata.formattedName;
    cycleMetadata[metadata.formattedName] = metadata.name;
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

  return { allCycleAggregations, cycleAggregations, formattedCycles, assessmentAggregations, cycleMetadata };
};
