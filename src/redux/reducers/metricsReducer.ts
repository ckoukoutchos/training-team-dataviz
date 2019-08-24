import { ActionTypes, FETCH_ALL_CYCLES_METRICS_SUCCESS } from '../actionTypes';
import {
  Cycle,
  CycleAggregation,
  AssessmentTypeAggregation
} from '../../models/types';

interface MetricsState {
  assessments: AssessmentTypeAggregation;
  assessmentAggregations: AssessmentTypeAggregation;
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
}

const initalState = {
  cycleAggregations: [],
  cycles: [],
  assessments: {
    projects: [],
    quizzes: [],
    softSkills: []
  },
  assessmentAggregations: {
    projects: [],
    quizzes: [],
    softSkills: []
  }
};

const metricsReducer = (
  state: MetricsState = initalState,
  action: ActionTypes
): MetricsState => {
  switch (action.type) {
    case FETCH_ALL_CYCLES_METRICS_SUCCESS:
      return {
        assessments: {
          projects: action.assessments.projects,
          quizzes: action.assessments.quizzes,
          softSkills: action.assessments.softSkills
        },
        assessmentAggregations: {
          projects: action.assessmentAggregations.projects,
          quizzes: action.assessmentAggregations.quizzes,
          softSkills: action.assessmentAggregations.softSkills
        },
        cycleAggregations: action.cycleAggregations,
        cycles: action.cycles
      };
    default:
      return state;
  }
};

export default metricsReducer;
