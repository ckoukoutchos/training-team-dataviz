import Metadata from './metadata';
import CONSTS from './constants';
import {
  Metric,
  Cycle,
  Associate,
  Module,
  Aggregation,
  CycleAggregation
} from '../models/types';

export const getAssessmentTableData = (
  name: any,
  values: any,
  allCycleAggr: any
) => ({
  name,
  projectAvg: `${values.projectAvg}% / ${formatPercentile(
    calcPercentiles(allCycleAggr.projectScores, values.projectAvg)
  )}`,
  quizAvg: `${values.quizAvg}% / ${formatPercentile(
    calcPercentiles(allCycleAggr.quizScores, values.quizAvg)
  )}`,
  softSkillsAvg: `${values.softSkillsAvg}% / ${formatPercentile(
    calcPercentiles(allCycleAggr.softSkillsScores, values.softSkillsAvg)
  )}`,
  attemptPass: values.attemptPass + '%'
});

export const calcAssociateAggr = (associates: any) => {
  const avgs = {};
  associates.forEach((associate: any) => {
    //@ts-ignore
    avgs[associate[0].Person] = {
      attemptPass: calcAttemptPassRatio(associate),
      projectAvg: calcMetricAvg(
        associate,
        CONSTS.projectScore,
        Metadata['Project (Score)']
      ),
      quizAvg: calcMetricAvg(associate, CONSTS.quiz, Metadata.Quiz),
      softSkillsAvg: calcMetricAvg(
        associate,
        CONSTS.softSkills,
        Metadata['Soft Skill Assessment']
      )
    };
  });
  return avgs;
};

export const calcCycleAggr = (associates: any) => {
  let attemptAvg = 0;
  let attemptMax = 0;
  let attemptMin = 100;
  let projectAvg = 0;
  let projectMax = 0;
  let projectMin = 100;
  let quizAvg = 0;
  let quizMax = 0;
  let quizMin = 100;
  let softSkillsAvg = 0;
  let softSkillsMax = 0;
  let softSkillsMin = 100;
  let numAttempts = Object.keys(associates).length;
  let numProjects = Object.keys(associates).length;
  let numQuizzes = Object.keys(associates).length;
  let numSoftSkills = Object.keys(associates).length;

  for (const associate in associates) {
    // attempts/pass avg
    attemptAvg += associates[associate].attemptPass;
    if (associates[associate].attemptPass === 0) {
      numAttempts--;
    }
    // project avg
    projectAvg += associates[associate].projectAvg;
    if (associates[associate].projectAvg === 0) {
      numProjects--;
    }
    // quiz avg
    quizAvg += associates[associate].quizAvg;
    if (associates[associate].quizAvg === 0) {
      numQuizzes--;
    }
    // soft skills avg
    softSkillsAvg += associates[associate].softSkillsAvg;
    if (associates[associate].softSkillsAvg === 0) {
      numSoftSkills--;
    }
    // attempt/pass max/min
    if (associates[associate].attemptPass > attemptMax) {
      attemptMax = associates[associate].attemptPass;
    }
    if (
      associates[associate].attemptPass < attemptMin &&
      associates[associate].attemptPass !== 0
    ) {
      attemptMin = associates[associate].attemptPass;
    }
    //project max/min
    if (associates[associate].projectAvg > projectMax) {
      projectMax = associates[associate].projectAvg;
    }
    if (
      associates[associate].projectAvg < projectMin &&
      associates[associate].projectAvg !== 0
    ) {
      projectMin = associates[associate].projectAvg;
    }
    // quiz max/min
    if (associates[associate].quizAvg > quizMax) {
      quizMax = associates[associate].quizAvg;
    }
    if (
      associates[associate].quizAvg < quizMin &&
      associates[associate].quizAvg !== 0
    ) {
      quizMin = associates[associate].quizAvg;
    }
    // soft skills max/min
    if (associates[associate].softSkillsAvg > softSkillsMax) {
      softSkillsMax = associates[associate].softSkillsAvg;
    }
    if (
      associates[associate].softSkillsAvg < softSkillsMin &&
      associates[associate].softSkillsAvg !== 0
    ) {
      softSkillsMin = associates[associate].softSkillsAvg;
    }
  }

  return {
    attemptAvg: numAttempts === 0 ? 0 : Math.round(attemptAvg / numAttempts),
    attemptMax,
    attemptMin,
    projectAvg: numProjects === 0 ? 0 : Math.round(projectAvg / numProjects),
    projectMax,
    projectMin,
    quizAvg: numQuizzes === 0 ? 0 : Math.round(quizAvg / numQuizzes),
    quizMax,
    quizMin,
    softSkillsMax,
    softSkillsMin,
    softSkillsAvg:
      numSoftSkills === 0 ? 0 : Math.round(softSkillsAvg / numSoftSkills)
  };
};

export const calcDaysSince = (startDate: string, endDate?: string) => {
  // format as Date object
  const startDateSplit = startDate.split('/');
  const startDateObj = new Date(
    Number('20' + startDateSplit[2]),
    Number(startDateSplit[0]) - 1,
    Number(startDateSplit[1])
  );

  if (endDate) {
    // if end date provided, format as Date object and calc time btw start and end
    const endDateSplit = endDate.split('/');
    const endDateObj = new Date(
      Number('20' + endDateSplit[2]),
      Number(endDateSplit[0]) - 1,
      Number(endDateSplit[1])
    );
    const cycleLength = (endDateObj.valueOf() - startDateObj.valueOf()) / 86400000;
    return Math.round(cycleLength);
  } else {
    // if no end date, calc time btw now and start
    const daysSinceStart = (Date.now() - startDateObj.valueOf()) / 86400000;
    return Math.round(daysSinceStart);
  }
};

export const calcModuleLength = (metadata: any) => {
  let prevTotal = 0;
  const moduleLengths: any = [];
  const ranges = Metadata.modules.map(modules => {
    if (metadata[modules].start && metadata[modules].end) {
      const days = Math.round(
        calcDaysSince(metadata[modules].start, metadata[modules].end)
      );
      moduleLengths.push(days);
      const range = days + prevTotal;
      prevTotal = range;
      return range;
    } else if (metadata[modules].start) {
      if (metadata['Cycle Exit']) {
        const days = Math.round(
          calcDaysSince(metadata[modules].start, metadata['Cycle Exit'])
        );
        moduleLengths.push(days);
        const range = days + prevTotal;
        return range;
      } else {
        const days = Math.round(calcDaysSince(metadata[modules].start));
        moduleLengths.push(days);
        const range = days + prevTotal;
        return range;
      }
    } else {
      moduleLengths.push(0);
      return 0;
    }
  });
  return { moduleLengths, ranges };
};

export const calcMetricAvg = (associate: any, metric: any, maxScores: any) => {
  const metrics = associate.filter(
    (event: any) => event['Interaction Type'] === metric
  );

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

export const formatCalendarDate = (date: string) => {
  if (date) {
    const dateSplit = date.split('/');
    if (dateSplit[0].length === 1) {
      dateSplit[0] = '0' + dateSplit[0];
    }
    if (dateSplit[1].length === 1) {
      dateSplit[1] = '0' + dateSplit[1];
    }
    return ['20' + dateSplit[2], dateSplit[0], dateSplit[1]].join('-');
  } else {
    const date = new Date(Date.now());
    return date.toISOString();
  }
};

export const formatAttendanceEvents = (attendance: any) =>
  attendance.map((event: any) => ({
    day: formatCalendarDate(event.date),
    value: Metadata.attendance[event.type]
  }));

export const getCycleMetrics = (metrics: Metric[][]): Metric[] => {
  // find metric array with cycle data
  const index = metrics.findIndex(
    metrics =>
      Metadata.staff.includes(metrics[0].Person) || metrics[0].Person === ''
  );
  // remove from associate metrics array and return it
  return metrics.splice(index, 1)[0];
};

export const getAssociateMetadata = (data: any) => {
  const metadata = {};
  for (const associate of data) {
    let person = {
      'Development Basics and Front End': {
        start: null,
        end: null
      },
      Databases: {
        start: null,
        end: null
      },
      'Logic Layer (Java)': {
        start: null,
        end: null
      },
      'Front End Frameworks (React)': {
        start: null,
        end: null
      },
      'Group Project': {
        start: null,
        end: null
      },
      'Final Project': {
        start: null,
        end: null
      }
    };
    for (const event of associate) {
      if (event['Interaction Type'] === 'Module Completed') {
        //@ts-ignore
        person[event.Interaction].end = event.Date;
      } else if (event['Interaction Type'] === 'Module Started') {
        //@ts-ignore
        person[event.Interaction].start = event.Date;
      } else if (event['Interaction Type'] === 'Associate Start') {
        //@ts-ignore
        person[event['Interaction Type']] = event.Date;
      } else if (RegExp('Cycle Exit').test(event['Interaction Type'])) {
        //@ts-ignore
        person['Cycle Exit'] = event.Date;
      }
    }
    //@ts-ignore
    metadata[associate[0].Person] = person;
  }
  return metadata;
};

export const getCycleAssociateCount = (associates: Associate[]): number[] => {
  const activeCount = associates.filter(
    (associate: Associate) => !associate.endDate
  );
  return [associates.length, activeCount.length];
};

export const getCycleMetadata = (data: any) => {
  const metadata = {};
  data.forEach((event: any) => {
    // check for interaction type
    if (
      Metadata.cycleMetadate.includes(event['Interaction Type']) ||
      RegExp('Cycle Exit').test(event['Interaction Type'])
    ) {
      // because our data entry is wonky
      let field;
      if (event.Interaction === '') {
        field = event['Interaction Type'];
      } else if (RegExp('Cycle Exit').test(event['Interaction Type'])) {
        field = 'Associate Leave';
      } else {
        field = event.Interaction;
      }
      // if not already a field, create one
      //@ts-ignore
      if (!metadata[field]) {
        // staff change need name and date
        if (field !== 'Cycle Start Date' && field !== 'Cycle End Date') {
          //@ts-ignore
          metadata[field] = [{ name: event.Person, date: event.Date }];
        } else {
          //@ts-ignore
          metadata[field] = [event.Date];
        }
        // otherwise, add to list
      } else {
        if (field !== 'Cycle Start Date' && field !== 'Cycle End Date') {
          //@ts-ignore
          metadata[field].push({ name: event.Person, date: event.Date });
        } else {
          //@ts-ignore
          metadata[field].push(event.Date);
        }
      }
    }
  });
  return metadata;
};

export const formatPercentile = (percentile: any) => {
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

export const getUrlParams = (urlHistory: any) => {
  const url = urlHistory.location.pathname.split('/');
  // get associate name from url and format to use ' ' instead of '-'
  const associate = url[url.length - 1].split('-').join(' ');
  // get cycle name
  const cycle = url[2];

  return { url, cycle, associate };
};

/*
  experimental
*/

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

export const calcDateMarkers = (associate: Associate) => {
  return associate.modules.map(module => {
    if (module.startDate) {
      return Math.round(calcDaysSince(associate.startDate, module.startDate));
    }
    return 0;
  });
};

export const calcModulesLength = (modules: any[], cycleEndDate: string | null) => {
  let prevTotal = 0;
  const moduleLengths: any = [];
  const ranges = modules.map(module => {
    if (module.startDate && module.endDate) {
      const days = Math.round(
        calcDaysSince(module.startDate, module.endDate)
      );
      moduleLengths.push(days);
      const range = days + prevTotal;
      prevTotal = range;
      return range;
    } else if (module.startDate) {
      if (cycleEndDate) {
        const days = Math.round(
          calcDaysSince(module.startDate, cycleEndDate)
        );
        moduleLengths.push(days);
        return days + prevTotal;
      } else {
        const days = Math.round(calcDaysSince(module.startDate));
        moduleLengths.push(days);
        return days + prevTotal;
      }
    } else {
      moduleLengths.push(0);
      return 0;
    }
  });
  return { moduleLengths, ranges };
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

export const combineScores = (
  cycles: CycleAggregation[],
  type: string
): number[] => {
  return cycles.reduce(
    (acc: number[], curr: CycleAggregation) => acc.concat(curr[type]),
    []
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
          module.endDate = metric.Date;
        }
        break;
      case 'Module Started':
        if (module) {
          module.startDate = metric.Date;
          module.type = metric.Interaction;
        }
        break;
      case 'Associate Start':
        associate.active = true;
        associate['startDate'] = metric.Date;
        break;
      case 'Attendance Event':
        associate.attendance.push({
          date: metric.Date,
          type: metric.Interaction
        });
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
      associate['endDate'] = metric.Date;
      // Interaction for graduates is empty string
      associate.exitReason = metric.Interaction ? metric.Interaction : 'Graduated';
    }
  }
  return associate;
};

export const formatCycleData = (
  metrics: Metric[],
  associates: Associate[],
  cycleName: string
): Cycle => {
  const cycle = new Cycle();
  cycle.name = cycleName;
  cycle.type = cycleName[0] === 'm' ? 'Mastery Learning' : 'Traditional Cycle';
  cycle.metrics = metrics;
  cycle.associates = associates;

  const cycleAssociateCount = getCycleAssociateCount(associates);
  cycle.totalNumberOfAssociates = cycleAssociateCount[0];
  cycle.currentNumberOfAssociates = cycleAssociateCount[1];

  for (const metric of metrics) {
    const type = metric['Interaction Type'];

    switch (type) {
      case 'Cycle Start Date':
        cycle.startDate = metric.Date;
        cycle.active = true;
        break;
      case 'Cycle End Date':
        cycle.endDate = metric.Date;
        cycle.active = false;
        break;
      case 'Staff change':
        if (metric.Interaction === 'Trainer Start') {
          cycle.trainers.push(metric.Person);
        } else if (metric.Interaction === 'TA Start') {
          cycle.TAs.push(metric.Person);
        }
        break;
      default:
        break;
    }
  }
  return cycle;
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
  return array.find((item: any) => item.name === name);;
};

export const getCycleAssessmentAggregations = (associates: Associate[]) => { };

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

export const getAllCyclesAggregations = (cycles: CycleAggregation[]) => {
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

export const sortMetricsByAssessment = (associates: Associate[]) => {
  const projects = {};
  const quizzes = {};
  const softSkills = {};

  for (const associate of associates) {
    // project sorting
    for (const project of associate.projects) {
      // if project already added, push score
      if (projects[project.Interaction]) {
        projects[project.Interaction].push(Number(project.Score));
        // if field doesn't exist, add one
      } else {
        projects[project.Interaction] = [Number(project.Score)];
      }
    }
    // quiz sorting
    for (const quiz of associate.quizzes) {
      // if quiz already added, push score
      if (quizzes[quiz.Interaction]) {
        quizzes[quiz.Interaction].push(Number(quiz.Score));
        // if field doesn't exist, add one
      } else {
        quizzes[quiz.Interaction] = [Number(quiz.Score)];
      }
    }
    // softSkills sorting
    for (const softSkill of associate.softSkills) {
      // if softSkill already added, push score
      if (softSkills[softSkill.Interaction]) {
        softSkills[softSkill.Interaction].push(Number(softSkill.Score));
        // if field doesn't exist, add one
      } else {
        softSkills[softSkill.Interaction] = [Number(softSkill.Score)];
      }
    }
  }
  return { projects, quizzes, softSkills };
};

export const sortMetircsByAssociate = (metrics: Metric[]): Metric[][] => {
  const associates = {};

  for (const metric of metrics) {
    // ignore training staff and empty Person
    if (!Metadata.staff.includes(metric.Person) && metric.Person !== '') {
      // if associate already added, push metric
      if (associates[metric.Person]) {
        associates[metric.Person].push(metric);
      } else {
        // if field doesn't exist, add one
        associates[metric.Person] = [metric];
      }
    } else {
      // if cycle already added, push metric
      if (associates['cycle']) {
        associates['cycle'].push(metric);
      } else {
        // if field doesn't exist, add one
        associates['cycle'] = [metric];
      }
    }
  }
  return Object.values(associates);
};
