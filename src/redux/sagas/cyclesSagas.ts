import { put, all, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_ALL_CYCLES_METRICS, POST_CYCLE_METRICS } from '../actionTypes';
import {
  fetchAllCyclesMetricsSuccess,
  fetchAllCyclesMetricsFail,
  postCycleMetricsFail
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

export default function* watchCycle() {
  yield all([
    takeEvery(FETCH_ALL_CYCLES_METRICS, fetchAllCyclesMetrics),
    //@ts-ignore
    takeEvery(POST_CYCLE_METRICS, postCycleMetrics)
  ]);
}

function* fetchAllCyclesMetrics(): IterableIterator<{}> {
  try {
    const res = yield axios.get('/api');
    const { cycles, data } = res.data;
    const {
      allCycleAggregations,
      cycleAggregations,
      formattedCycles,
      assessmentAggregations
    } = formatAllCycleData(data, cycles);
    yield put(
      fetchAllCyclesMetricsSuccess(
        allCycleAggregations,
        cycleAggregations,
        formattedCycles,
        assessmentAggregations
      )
    );
  } catch (err) {
    yield put(fetchAllCyclesMetricsFail(err));
  }
}

function* postCycleMetrics({
  formData,
  cycleName,
  history
}: {
  formData: FormData;
  cycleName: string;
  history: History;
}): IterableIterator<{}> {
  try {
    yield axios.post('/api/' + cycleName, formData);
    yield fetchAllCyclesMetrics();
    history.push('/');
  } catch (err) {
    yield put(postCycleMetricsFail(err));
  }
}

const getCycleData = (data: any, cycleName: string) => {
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

const formatAllCycleData = (data: any, cycles: string[]) => {
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
