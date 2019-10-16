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
  formatStaffData,
  getAssessmentAggregations
} from '../../shared/dataService';
import { getToken } from './selectors';
import { Metric, Associate } from '../../models/types';


/*
  Does this application need sagas, absolutely not, it's over/pre-optimization but I hold on to the dream that
  this little guy will one day be something and maybe then it'll make sense
*/
export default function* watchCycle() {
  yield all([takeEvery(FETCH_ALL_CYCLES_METRICS, fetchAllCyclesMetrics)]);
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
      assessments,
      assessmentAggregations,
      cycles,
      cycleAggregations,
      cycleMetadata
    } = formatAllCycleData(data);
    yield put(
      fetchAllCyclesMetricsSuccess(
        assessments,
        assessmentAggregations,
        cycles,
        cycleAggregations,
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

/*
  one day, in neverneverland, we'll have a graphql server do all this for us, til then, we have the worlds fattest client
*/
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
  const cycleAggregation = getCycleAggregations(associateAggregations);
  // get assessment level aggregations
  const assessmentAggregation = getAssessmentAggregations(formattedAssociates);
  return { formattedCycle, cycleAggregation, assessmentAggregation };
};

const formatAllCycleData = (data: any) => {
  const assessments: any = {
    projects: [],
    quizzes: [],
    softSkills: []
  };
  const assessmentAggregations: any = {
    projects: [],
    quizzes: [],
    softSkills: []
  };
  const cycles = [];
  const cycleAggregations = [];
  const cycleMetadata = {};

  // for each cycle, collect data
  for (let i = 0; i < data.length; i++) {
    const metadata = data[i].metadata;
    const {
      formattedCycle,
      cycleAggregation,
      assessmentAggregation: { projects, quizzes, softSkills }
    } = getCycleData(data[i].data, metadata);

    cycleAggregations.push(cycleAggregation);
    cycles.push(formattedCycle);
    assessmentAggregations.projects.push(...projects);
    assessmentAggregations.quizzes.push(...quizzes);
    assessmentAggregations.softSkills.push(...softSkills);
    cycleMetadata[metadata.name] = metadata.formattedName;
    cycleMetadata[metadata.formattedName] = metadata.name;
    formattedCycle.associates.forEach((associate: Associate) => {
      assessments.projects.push(...associate.projects);
      assessments.quizzes.push(...associate.quizzes);
      assessments.softSkills.push(...associate.softSkills);
    });
  }

  return {
    cycleAggregations,
    cycles,
    assessmentAggregations,
    assessments,
    cycleMetadata
  };
};
