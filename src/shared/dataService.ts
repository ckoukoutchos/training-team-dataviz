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

export const calcDaysInModules = (modules: Module[], exitDate: Date | null): Module[] => {
  modules.forEach((module: Module) => {
    if (module.startDate && module.endDate) {
      module.daysInModule = calcDaysSince(module.startDate, module.endDate);
      // if module started but cut short by cycle exit
    } else if (module.startDate && !module.endDate && exitDate) {
      module.daysInModule = calcDaysSince(module.startDate, exitDate)
      // if still on-going
    } else if (module.startDate) {
      module.daysInModule = calcDaysSince(module.startDate);
    }
    // subtract module pause period
    if (module.modulePause && module.moduleResume) {
      module.daysInModule -= calcDaysSince(module.modulePause, module.moduleResume);
      // subtract on-going pause period
    } else if (module.modulePause) {
      module.daysInModule -= calcDaysSince(module.modulePause);
    }
  });
  return modules;
}

export const calcDaysSince = (startDate: Date, endDate?: Date | null): number => {
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
    if (metric['Interaction Type'] === 'Exercise') {
      if (metric.Score === 'Completed' || metric.Score === 'Pass') {
        pass++;
      }
    } else {
      // because some peeps don't enter scores right
      if (metric.Score.trim() !== '') {
        if (Number(metric.Score) / 30 >= 0.9) {
          pass++;
        }
      }
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

export const calcPercent = (score: number, maxScore: number): number => {
  return Math.round((score / maxScore) * 100);
}

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
  const meanSquares = scores.map((score: any) =>
    Math.pow(score - scoreAvg, 2)
  );
  const meanSquaresAvg = calcScoreAvg(meanSquares);
  return Math.round(Math.sqrt(meanSquaresAvg));
}

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
}

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

export const formatAttendanceEvents = (attendance: AttendanceEvent[]): { day: string, value: number }[] =>
  attendance.map((event: AttendanceEvent) => {
    const day = event.date.toISOString().split('T')[0];
    return {
      day,
      value: Metadata.attendance[event.type]
    }
  });

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

export const formatStaffData = (metrics: Metric[], cycleName: string): Staff => {
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
      default: break;
    }
  }
  return staff;
}

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

export const getAssociateAggregations = (
  associates: Associate[]
): Aggregation[] => {
  const aggregations = [];
  for (const associate of associates) {
    aggregations.push({
      attemptPass: calcAttemptPassRatio(
        associate.exercises.concat(associate.projects)
      ),
      name: associate.name,
      projects: calcAssessmentAvg(
        associate.projects,
        Metadata['Project (Score)']
      ),
      quizzes: calcAssessmentAvg(associate.quizzes, Metadata.Quiz),
      softSkills: calcAssessmentAvg(
        associate.softSkills,
        Metadata['Soft Skill Assessment']
      )
    });
  }
  return aggregations;
};

export const getItemInArrayByName = (array: any[], name: string): any => {
  return array.find((item: any) => item.name === name);
};

export const getCycleAggregations = (
  associates: Aggregation[],
  cycleName: string
): CycleAggregation => {
  const attemptPassScores = [];
  const projectScores = [];
  const quizScores = [];
  const softSkillsScores = [];
  // grab scores for each assessment type
  for (const associate of associates) {
    // if assessment avg is zero, ignore
    if (associate.attemptPass) {
      attemptPassScores.push(associate.attemptPass);
    }
    if (associate.projects) {
      projectScores.push(associate.projects);
    }
    if (associate.quizzes) {
      quizScores.push(associate.quizzes);
    }
    if (associate.softSkills) {
      softSkillsScores.push(associate.softSkills);
    }
  }
  return {
    aggregations: associates,
    attemptPass: calcScoreAvg(attemptPassScores),
    attemptPassScores: attemptPassScores.sort((a: number, b: number) => a - b),
    name: cycleName,
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

export const formatAssessments = (assessments: Metric[], maxScores: any): any[] => {
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

export const getAllCyclesAggregations = (
  cycles: CycleAggregation[]
): CycleAggregation => {
  const attemptPassScores = combineScores(cycles, 'attemptPassScores');
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
      const formattedProjects = associate.projects.map((item: any) => ({ ...item, cycle: associate.cycle }));
      const formattedQuizzes = associate.quizzes.map((item: any) => ({ ...item, cycle: associate.cycle }));
      const formattedSoftSkills = associate.softSkills.map((item: any) => ({ ...item, cycle: associate.cycle }));
      projects.push(...formattedProjects);
      quizzes.push(...formattedQuizzes);
      softSkills.push(...formattedSoftSkills);
    });
  });

  return { projects, quizzes, softSkills };
};

export const sortMetircsByPerson = (metrics: Metric[]): { associates: Metric[][], cycle: { [key: string]: string }, staff: Metric[][] } => {
  const associates = {};
  const cycle = {};
  const staff = {};

  for (const metric of metrics) {
    // associates
    if (!Metadata.staff.includes(metric.Person) && metric.Person !== '') {
      associates[metric.Person] ?
        associates[metric.Person].push(metric) :
        associates[metric.Person] = [metric];
      // cycles
    } else if (metric.Person === '') {
      metric['Interaction Type'] === 'Cycle Start Date' ?
        cycle['startDate'] = metric.Date :
        cycle['endDate'] = metric.Date;
      // staff
    } else {
      staff[metric.Person] ?
        staff[metric.Person].push(metric) :
        staff[metric.Person] = [metric];
    }
  }
  return { associates: Object.values(associates), cycle, staff: Object.values(staff) };
};
