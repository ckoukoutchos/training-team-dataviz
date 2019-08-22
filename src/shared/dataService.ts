import Metadata from './metadata';
import {
  Metric,
  Cycle,
  Associate,
  Module,
  Aggregation,
  CycleAggregation,
  Staff,
  StaffRole,
  AttendanceEvent
} from '../models/types';

export const calcDaysInModules = (
  modules: Module[],
  exitDate: Date | null
): Module[] => {
  modules.forEach((module: Module) => {
    if (module.startDate && module.endDate) {
      module.daysInModule = calcDaysSince(module.startDate, module.endDate);
      // if module started but cut short by cycle exit
    } else if (module.startDate && !module.endDate && exitDate) {
      module.daysInModule = calcDaysSince(module.startDate, exitDate);
      // if still on-going
    } else if (module.startDate) {
      module.daysInModule = calcDaysSince(module.startDate);
    }
    // subtract module pause period
    if (module.modulePause && module.moduleResume) {
      module.daysInModule -= calcDaysSince(
        module.modulePause,
        module.moduleResume
      );
      // subtract on-going pause period
    } else if (module.modulePause) {
      module.daysInModule -= calcDaysSince(module.modulePause);
    }
  });
  return modules;
};

export const calcDaysSince = (
  startDate: Date,
  endDate?: Date | null
): number => {
  if (endDate) {
    return Math.round((endDate.valueOf() - startDate.valueOf()) / 86400000);
  } else {
    // if no end date, calc time btw now and start
    return Math.round((Date.now() - startDate.valueOf()) / 86400000);
  }
};

export const calcAttemptPassRatio = (metrics: Metric[]) => {
  let attempt = 0;
  let pass = 0;
  for (const metric of metrics) {
    attempt++;
    if (metric.Score === 'Completed' || metric.Score === 'Pass') {
      pass++;
    }
  }
  // if zero attempts, return zero
  return attempt ? Math.round((pass / attempt) * 100) : 0;
};

export const calcAssessmentAvg = (
  metrics: Metric[],
  maxScores: any
): number => {
  // return 0 if no metrics were taken
  if (!metrics.length) {
    return 0;
  }
  // adds up scores of all associate metrics and Max Scores for those metrics
  const metricAvg = metrics.reduce(
    (acc: any, curr: any) => {
      return [
        acc[0] + Number(curr.Score),
        acc[1] + maxScores[curr.Interaction]['Max Score']
      ];
    },
    [0, 0]
  );
  // convert to percent and round to nearest int
  return Math.round((metricAvg[0] / metricAvg[1]) * 100);
};

export const calcAssessmentsScore = (
  projects: number,
  quizzes: number,
  softSkills: number
): number => {
  if (softSkills && quizzes && projects) {
    return Math.round(projects * 0.45 + softSkills * 0.45 + quizzes * 0.1);
  } else if (projects && quizzes) {
    return Math.round(projects * 0.7 + quizzes * 0.3);
  } else if (projects) {
    return projects;
  } else {
    return 0;
  }
};

export const calcAttendanceScore = (associate: Associate): number => {
  const attendanceModifier =
    associate.attendance.count['Excused Absence'] * -0.5 +
    associate.attendance.count['Unexcused Absence'] * -5 +
    associate.attendance.count['Excused Late Arrival'] * -0.2 +
    associate.attendance.count['Unexcused Late Arrival'] * -1;

  const daysInCycle = associate.endDate
    ? calcDaysSince(associate.startDate, associate.endDate)
    : calcDaysSince(associate.startDate);
  const daysOff = associate.cycle[0] === 'm' ? 4 : 2;
  const daysInClass = daysInCycle - Math.round((daysInCycle / 7) * daysOff);
  const attendanceScore = Math.round(
    ((daysInClass + attendanceModifier) / daysInClass) * 100
  );
  return attendanceScore;
};

const calcCombinedScore = (
  assessments: number,
  attendance: number,
  moduleTime?: number
) => {
  return moduleTime
    ? Math.round(assessments * 0.5 + attendance * 0.25 + moduleTime * 0.25)
    : Math.round(assessments * 0.6 + attendance * 0.4);
};

const calcCompositeScore = (
  scores: number[],
  associateScore: number
): number => {
  const combinedScoreAvg = calcScoreAvg(scores);
  const SD = calcStandardDeviation(scores);
  const associateDeviation = (associateScore - combinedScoreAvg) / SD;
  let compositeScore = 0;
  if (Math.abs(associateDeviation) < 0.5) {
    compositeScore = 3;
  } else if (associateDeviation >= 0.5 && associateDeviation < 1) {
    compositeScore = 4;
  } else if (associateDeviation >= 1) {
    compositeScore = 5;
  } else if (associateDeviation <= -0.5 && associateDeviation > -1) {
    compositeScore = 2;
  } else {
    compositeScore = 1;
  }
  return compositeScore;
};

const calcModuleTimeScore = (modules: Module[]): number => {
  const workedModules = modules.filter(
    (module: Module, index: number) => module.daysInModule > 0 && index < 4
  );
  const workedModuleTimes = workedModules.map(
    (module: Module, index: number) => {
      // if module in-progress and less than half alloted time, just give 100%
      if (
        module.daysInModule < Metadata.maxTimePerModule[index] * 0.6 &&
        !module.endDate
      ) {
        return 1;
      }
      // 0.6 is ratio of ML to traditional cycle module lengths
      return (Metadata.maxTimePerModule[index] / module.daysInModule) * 0.6;
    }
  );

  const total = workedModuleTimes.reduce(
    (acc: any, curr: any) => acc + curr,
    0
  );
  return Math.round((total / workedModuleTimes.length) * 100);
};

export const calcPercent = (score: number, maxScore: number): number => {
  return Math.round((score / maxScore) * 100);
};

export const calcPercentiles = (scores: number[], avg: number): number => {
  const index = scores.findIndex((score: number) => avg <= score);
  return Math.round(((index + 1) / scores.length) * 100);
};

export const calcScoreAvg = (scores: number[]): number => {
  const total = scores.reduce((acc: number, curr: number) => acc + curr, 0);
  // if zero attempts, return zero
  return scores.length ? Math.round(total / scores.length) : 0;
};

export const calcStandardDeviation = (scores: number[]): number => {
  const scoreAvg = calcScoreAvg(scores);
  const meanSquares = scores.map((score: any) => Math.pow(score - scoreAvg, 2));
  const meanSquaresAvg = calcScoreAvg(meanSquares);
  return Math.round(Math.sqrt(meanSquaresAvg));
};

export const combineScores = (
  cycles: CycleAggregation[],
  type: string
): number[] => {
  return cycles.reduce(
    (acc: number[], curr: CycleAggregation) => acc.concat(curr[type]),
    []
  );
};

export const convertStringToDateObject = (date: string): Date => {
  const splitDate = date.split('/');
  return new Date(
    Number('20' + splitDate[2]),
    Number(splitDate[0]) - 1,
    Number(splitDate[1])
  );
};

export const formatAssociateData = (
  metrics: Metric[],
  cycle: string
): Associate => {
  const associate = new Associate();
  associate.name = metrics[0].Person;
  associate.cycle = cycle;
  associate.metrics = metrics;

  for (const metric of metrics) {
    const type = metric['Interaction Type'];
    // if a module event, find matching module on Associate object
    const module = associate.modules.find(
      (module: Module) => module.type === metric.Interaction
    );

    switch (type) {
      case 'Module Completed':
        if (module) {
          module.endDate = convertStringToDateObject(metric.Date);
        }
        break;
      case 'Module Started':
        if (module) {
          module.startDate = convertStringToDateObject(metric.Date);
          module.type = metric.Interaction;
        }
        break;
      case 'Module Pause':
        if (module) {
          module.modulePause = convertStringToDateObject(metric.Date);
        }
        break;
      case 'Module Resume':
        if (module) {
          module.moduleResume = convertStringToDateObject(metric.Date);
        }
        break;
      case 'Associate Start':
        associate.active = true;
        associate.startDate = convertStringToDateObject(metric.Date);
        break;
      case 'Attendance Event':
        associate.attendance.events.push({
          date: convertStringToDateObject(metric.Date),
          type: metric.Interaction
        });
        associate.attendance.count[metric.Interaction]++;
        break;
      case 'Exercise':
        associate.exercises.push(metric);
        break;
      case 'Quiz':
        associate.quizzes.push(metric);
        break;
      case 'Project (Score)':
        associate.projects.push(metric);
        break;
      case 'Soft Skill Assessment':
        associate.softSkills.push(metric);
        break;
      default:
        break;
    }
    // multiple exit types, boolean check simpler than cases
    if (RegExp('Cycle Exit').test(type)) {
      associate.active = false;
      associate.endDate = convertStringToDateObject(metric.Date);
      // Interaction for graduates is empty string
      associate.exitReason = metric.Interaction
        ? metric.Interaction
        : 'Graduated';
    }
  }
  associate.daysInCycle = calcDaysSince(associate.startDate, associate.endDate);
  associate.modules = calcDaysInModules(associate.modules, associate.endDate);

  return associate;
};

export const formatAttendanceEvents = (
  attendance: AttendanceEvent[]
): { day: string; value: number }[] =>
  attendance.map((event: AttendanceEvent) => ({
    day: event.date.toISOString().split('T')[0],
    value: Metadata.attendance[event.type]
  }));

export const formatCycleData = (
  metrics: { [key: string]: string },
  staff: Staff[],
  associates: Associate[],
  cycleName: string,
  fileId: string
): Cycle => {
  const cycle = new Cycle();
  cycle.name = cycleName;
  cycle.fileId = fileId;
  cycle.type = cycleName[0] === 'm' ? 'Mastery Learning' : 'Traditional Cycle';

  cycle.associates = associates;
  cycle.staff = staff;

  const [total, current] = getCycleAssociateCount(associates);
  cycle.totalNumberOfAssociates = total;
  cycle.currentNumberOfAssociates = current;

  cycle.startDate = convertStringToDateObject(metrics.startDate);
  cycle.active = true;

  if (metrics.endDate) {
    cycle.endDate = convertStringToDateObject(metrics.endDate);
    cycle.active = false;
  }
  return cycle;
};

export const formatStaffData = (
  metrics: Metric[],
  cycleName: string
): Staff => {
  const staff = new Staff();
  staff.name = metrics[0].Person;
  staff.cycle = cycleName;
  staff.metrics = metrics;

  for (const metric of metrics) {
    const type = metric.Interaction;

    switch (type) {
      case 'Trainer Start':
        staff.role = StaffRole.TRAINER;
        staff.startDate = convertStringToDateObject(metric.Date);
        staff.active = true;
        break;
      case 'TA Start':
        staff.role = StaffRole.TA;
        staff.startDate = convertStringToDateObject(metric.Date);
        staff.active = true;
        break;
      case 'Trainer Exit':
        staff.endDate = convertStringToDateObject(metric.Date);
        staff.active = false;
        break;
      case 'TA Exit':
        staff.endDate = convertStringToDateObject(metric.Date);
        staff.active = false;
        break;
      default:
        break;
    }
  }
  return staff;
};

export const formatPercentile = (percentile: number): string => {
  if (percentile % 10 === 1) {
    return percentile + 'st';
  } else if (percentile % 10 === 2) {
    return percentile + 'nd';
  } else if (percentile % 10 === 3) {
    return percentile + 'rd';
  } else {
    return percentile + 'th';
  }
};

export const getAllCyclesAggregations = (cycles: CycleAggregation[]): any => {
  const attemptPassScores = combineScores(cycles, 'exerciseScores');
  const projectScores = combineScores(cycles, 'projectScores');
  const quizScores = combineScores(cycles, 'quizScores');
  const softSkillsScores = combineScores(cycles, 'softSkillsScores');
  return {
    aggregations: cycles,
    attemptPass: calcScoreAvg(attemptPassScores),
    attemptPassScores: attemptPassScores.sort((a: number, b: number) => a - b),
    name: 'allCycles',
    projects: calcScoreAvg(projectScores),
    projectScores: projectScores.sort((a: number, b: number) => a - b),
    quizzes: calcScoreAvg(quizScores),
    quizScores: quizScores.sort((a: number, b: number) => a - b),
    softSkills: calcScoreAvg(softSkillsScores),
    softSkillsScores: softSkillsScores.sort((a: number, b: number) => a - b)
  };
};

export const getAssociateAggregations = (
  associates: Associate[]
): Aggregation[] =>
  associates.map(
    (associate: Associate): Aggregation => {
      const projects = calcAssessmentAvg(
        associate.projects,
        Metadata['Project (Score)']
      );
      const quizzes = calcAssessmentAvg(associate.quizzes, Metadata.Quiz);
      const softSkills = calcAssessmentAvg(
        associate.softSkills,
        Metadata['Soft Skill Assessment']
      );
      const assessments = calcAssessmentsScore(projects, quizzes, softSkills);
      const attendance = calcAttendanceScore(associate);
      const moduleTime = calcModuleTimeScore(associate.modules);

      return {
        assessments,
        attendance,
        combined: calcCombinedScore(assessments, attendance, moduleTime),
        composite: 0,
        cycle: associate.cycle,
        exercises: calcAttemptPassRatio(associate.exercises),
        name: associate.name,
        moduleTime,
        projects,
        quizzes,
        softSkills
      };
    }
  );

export const getCycleAggregations = (
  aggregations: Aggregation[]
): CycleAggregation => {
  const assessments = [];
  const attendance = [];
  const combined: number[] = [];
  const exercises = [];
  const moduleTime = [];
  const exerciseScores = [];
  const projectScores = [];
  const quizScores = [];
  const softSkillsScores = [];
  // grab scores for each assessment type
  for (const aggregation of aggregations) {
    // if avg is zero, ignore
    if (aggregation.assessments) {
      assessments.push(aggregation.assessments);
    }
    if (aggregation.attendance) {
      attendance.push(aggregation.attendance);
    }
    if (aggregation.combined) {
      combined.push(aggregation.combined);
    }
    if (aggregation.exercises) {
      exercises.push(aggregation.exercises);
    }
    if (aggregation.moduleTime) {
      moduleTime.push(aggregation.moduleTime);
    }
    if (aggregation.exercises) {
      exerciseScores.push(aggregation.exercises);
    }
    if (aggregation.projects) {
      projectScores.push(aggregation.projects);
    }
    if (aggregation.quizzes) {
      quizScores.push(aggregation.quizzes);
    }
    if (aggregation.softSkills) {
      softSkillsScores.push(aggregation.softSkills);
    }
  }

  aggregations.forEach((aggregation: Aggregation) => {
    aggregation.composite = calcCompositeScore(combined, aggregation.combined);
  });

  return {
    aggregations,
    assessments: calcScoreAvg(assessments),
    assessmentsScores: assessments.sort((a: number, b: number) => a - b),
    attendance: calcScoreAvg(attendance),
    attendanceScores: attendance.sort((a: number, b: number) => a - b),
    combined: calcScoreAvg(combined),
    combinedScores: combined.sort((a: number, b: number) => a - b),
    composite: 0,
    cycle: aggregations[0].cycle,
    exercises: calcScoreAvg(exercises),
    exerciseScores: exerciseScores.sort((a: number, b: number) => a - b),
    moduleTime: calcScoreAvg(moduleTime),
    moduleTimeScores: moduleTime.sort((a: number, b: number) => a - b),
    name: aggregations[0].cycle,
    projects: calcScoreAvg(projectScores),
    projectScores: projectScores.sort((a: number, b: number) => a - b),
    quizzes: calcScoreAvg(quizScores),
    quizScores: quizScores.sort((a: number, b: number) => a - b),
    softSkills: calcScoreAvg(softSkillsScores),
    softSkillsScores: softSkillsScores.sort((a: number, b: number) => a - b)
  };
};

export const getCycleAssociateCount = (associates: Associate[]): number[] => {
  const activeCount = associates.filter(
    (associate: Associate) => !associate.endDate
  );
  return [associates.length, activeCount.length];
};

export const getItemInArrayByName = (array: any[], name: string): any => {
  return array.find((item: any) => item.name === name);
};

export const formatAssessments = (
  assessments: Metric[],
  maxScores: any
): any[] => {
  const formattedAssessments = {};
  // format into obj for each assessment
  assessments.forEach((assessment: Metric) => {
    if (formattedAssessments[assessment.Interaction]) {
      // if assessment already added
      formattedAssessments[assessment.Interaction].scores.push(
        Number(assessment.Score)
      );
      formattedAssessments[assessment.Interaction].metrics.push(assessment);
    } else {
      // if not added, create field
      formattedAssessments[assessment.Interaction] = {
        average: 0,
        metrics: [assessment],
        module: maxScores[assessment.Interaction].Module,
        name: assessment.Interaction,
        scores: [Number(assessment.Score)]
      };
    }
  });
  // calc average
  for (const assessment in formattedAssessments) {
    //@ts-ignore
    const metrics = formattedAssessments[assessment].metrics;
    formattedAssessments[assessment].average = calcAssessmentAvg(
      metrics,
      maxScores
    );
  }
  return Object.values(formattedAssessments);
};

export const getUrlParams = (urlHistory: any) => {
  const url = urlHistory.location.pathname.split('/');
  // get associate name from url and format to use ' ' instead of '-'
  const associate = url[url.length - 1].split('-').join(' ');
  // get cycle name
  const cycle = url[2];

  return { url, cycle, associate };
};

export const sortMetricsByAssessmentType = (cycles: Cycle[]) => {
  const projects: any = [];
  const quizzes: any = [];
  const softSkills: any = [];

  // this is gross, should re-think data structures to potentially avoid
  cycles.forEach((cycle: Cycle) => {
    cycle.associates.forEach((associate: Associate) => {
      // add cycle name to metric
      const formattedProjects = associate.projects.map((item: any) => ({
        ...item,
        cycle: associate.cycle
      }));
      const formattedQuizzes = associate.quizzes.map((item: any) => ({
        ...item,
        cycle: associate.cycle
      }));
      const formattedSoftSkills = associate.softSkills.map((item: any) => ({
        ...item,
        cycle: associate.cycle
      }));
      projects.push(...formattedProjects);
      quizzes.push(...formattedQuizzes);
      softSkills.push(...formattedSoftSkills);
    });
  });

  return { projects, quizzes, softSkills };
};

export const sortMetircsByPerson = (
  metrics: Metric[]
): {
  associates: Metric[][];
  cycle: { [key: string]: string };
  staff: Metric[][];
} => {
  const associates = {};
  const cycle = {};
  const staff = {};

  for (const metric of metrics) {
    // associates
    if (!Metadata.staff.includes(metric.Person) && metric.Person !== '') {
      associates[metric.Person]
        ? associates[metric.Person].push(metric)
        : (associates[metric.Person] = [metric]);
      // cycles
    } else if (metric.Person === '') {
      metric['Interaction Type'] === 'Cycle Start Date'
        ? (cycle['startDate'] = metric.Date)
        : (cycle['endDate'] = metric.Date);
      // staff
    } else {
      staff[metric.Person]
        ? staff[metric.Person].push(metric)
        : (staff[metric.Person] = [metric]);
    }
  }
  return {
    associates: Object.values(associates),
    cycle,
    staff: Object.values(staff)
  };
};
