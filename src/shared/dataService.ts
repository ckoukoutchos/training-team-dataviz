import Metadata from './metadata';
import CONSTS from './constants';
import { Metric, Cycle, Associate, Module } from '../models/types';

export const calcAllCyclesPercentiles = (cycleAggr: any) => {
  const projectScores: any = [];
  const quizScores: any = [];
  const softSkillsScores: any = [];
  for (const cycle in cycleAggr) {
    for (const associate in cycleAggr[cycle]) {
      projectScores.push(cycleAggr[cycle][associate].projectAvg);
      quizScores.push(cycleAggr[cycle][associate].quizAvg);
      softSkillsScores.push(cycleAggr[cycle][associate].softSkillsAvg);
    }
  }
  // sort in ascending order
  projectScores.sort((a: number, b: number) => a - b);
  quizScores.sort((a: number, b: number) => a - b);
  softSkillsScores.sort((a: number, b: number) => a - b);
  // calc percentiles for each
  const projectPercentiles = CONSTS.percentiles.map(perc =>
    projectScores[Math.round(projectScores.length * perc)]
  );
  const quizPercentiles = CONSTS.percentiles.map(perc =>
    quizScores[Math.round(quizScores.length * perc)]
  );
  const softSkillsPercentiles = CONSTS.percentiles.map(perc =>
    softSkillsScores[Math.round(softSkillsScores.length * perc)]
  );
  return { projectPercentiles, projectScores, quizPercentiles, quizScores, softSkillsPercentiles, softSkillsScores };
}

export const calcAssociateAggr = (associates: any) => {
  const avgs = {};
  associates.forEach((associate: any) => {
    //@ts-ignore
    avgs[associate[0].Person] = {
      attemptPass: calcAttemptPassRatio(associate),
      projectAvg: calcMetricAvg(associate, CONSTS.projectScore, Metadata['Project (Score)']),
      quizAvg: calcMetricAvg(associate, CONSTS.quiz, Metadata.Quiz),
      softSkillsAvg: calcMetricAvg(associate, CONSTS.softSkills, Metadata['Soft Skill Assessment'])
    };
  });
  return avgs;
}

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
    if (associates[associate].attemptPass < attemptMin && associates[associate].attemptPass !== 0) {
      attemptMin = associates[associate].attemptPass;
    }
    //project max/min
    if (associates[associate].projectAvg > projectMax) {
      projectMax = associates[associate].projectAvg;
    }
    if (associates[associate].projectAvg < projectMin && associates[associate].projectAvg !== 0) {
      projectMin = associates[associate].projectAvg;
    }
    // quiz max/min
    if (associates[associate].quizAvg > quizMax) {
      quizMax = associates[associate].quizAvg;
    }
    if (associates[associate].quizAvg < quizMin && associates[associate].quizAvg !== 0) {
      quizMin = associates[associate].quizAvg;
    }
    // soft skills max/min
    if (associates[associate].softSkillsAvg > softSkillsMax) {
      softSkillsMax = associates[associate].softSkillsAvg;
    }
    if (associates[associate].softSkillsAvg < softSkillsMin && associates[associate].softSkillsAvg !== 0) {
      softSkillsMin = associates[associate].softSkillsAvg;
    }
  };

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
    softSkillsAvg: numSoftSkills === 0 ? 0 : Math.round(softSkillsAvg / numSoftSkills)
  }
}

export const calcDaysSince = (startDate: any, endDate?: any) => {
  // format as Date object
  const startDateSplit = startDate.split('/');
  //@ts-ignore
  const startDateObj = new Date('20' + startDateSplit[2], startDateSplit[0] - 1, startDateSplit[1]);

  if (endDate) {
    // if end date provided, format as Date object and calc time btw start and end
    const endDateSplit = endDate.split('/');
    //@ts-ignore
    const endDateObj = new Date('20' + endDateSplit[2], endDateSplit[0] - 1, endDateSplit[1]);
    const cycleLength = (endDateObj - startDateObj) / 86400000;
    return Math.round(cycleLength);
  } else {
    // if no end date, calc time btw now and start
    const daysSinceStart = (Date.now() - startDateObj) / 86400000;
    return Math.round(daysSinceStart);
  }
}

export const calcDateMarkers = (metadata: any) => {
  const startDate = metadata['Associate Start'];
  return Metadata.modules.map(modules => {
    if (metadata[modules].start) {
      return Math.round(calcDaysSince(startDate, metadata[modules].start));
    }
    return 0;
  });
}

export const calcModuleLength = (metadata: any) => {
  let prevTotal = 0;
  const moduleLengths: any = [];
  const ranges = Metadata.modules.map(modules => {
    if (metadata[modules].start && metadata[modules].end) {
      const days = Math.round(calcDaysSince(metadata[modules].start, metadata[modules].end));
      moduleLengths.push(days);
      const range = days + prevTotal;
      prevTotal = range;
      return range;
    } else if (metadata[modules].start) {
      if (metadata['Cycle Exit']) {
        const days = Math.round(calcDaysSince(metadata[modules].start, metadata['Cycle Exit']));
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
}

export const calcMetricAvg = (associate: any, metric: any, maxScores: any) => {
  const metrics = associate.filter((event: any) => event['Interaction Type'] === metric);

  // return 0 if no metrics were taken
  if (!metrics.length) {
    return 0;
  }

  // adds up scores of all associate metrics and Max Scores for those metrics
  const metricAvg = metrics.reduce((acc: any, curr: any) => {
    return [acc[0] + Number(curr.Score), acc[1] + maxScores[curr.Interaction]['Max Score']];
  }, [0, 0]);

  // convert to percent and round to nearest int
  return Math.round((metricAvg[0] / metricAvg[1]) * 100);
}

export const calcAttemptPassRatio = (metrics: any) => {
  let attempt = 0;
  let pass = 0;
  for (const metric of metrics) {
    if (metric['Interaction Type'] === 'Exercise') {
      attempt++;
      if (metric.Score === 'Completed' || metric.Score === 'Pass') {
        pass++;
      }
    } else if (metric['Interaction Type'] === 'Project (Score)') {
      attempt++;
      // because some peeps don't enter scores right
      if (metric.Score.trim() !== '') {
        if ((metric.Score / 30) >= 0.9) {
          pass++;
        }
      }
    }
  }
  if (!(Math.round((pass / attempt) * 100))) {
    return 0
  } else {
    return Math.round((pass / attempt) * 100);
  }
}

export const calcPercentiles = (scores: any, avg: any) => {
  const index = scores.indexOf(avg);
  return Math.round((index + 1) / scores.length * 100);
}

const formatCalendarDate = (date: any) => {
  const dateSplit = date.split('/');
  if (dateSplit[0].length === 1) {
    dateSplit[0] = '0' + dateSplit[0];
  }
  if (dateSplit[1].length === 1) {
    dateSplit[1] = '0' + dateSplit[1];
  }
  return ['20' + dateSplit[2], dateSplit[0], dateSplit[1]].join('-');
}

export const sortAttendanceEvents = (metrics: any) => {
  const attendance = {
    events: []
  };
  metrics.forEach((event: any) => {
    // convert to correct date format
    const newDateFormat = formatCalendarDate(event.Date);

    // set start date
    if (event['Interaction Type'] === 'Associate Start') {
      //@ts-ignore
      attendance[event['Interaction Type']] = newDateFormat;

      // set cycle exit date
    } else if (RegExp('Cycle Exit').test(event['Interaction Type'])) {
      //@ts-ignore
      attendance['Cycle Exit'] = newDateFormat;

      // set other attendace evts
    } else if (event['Interaction Type'] === 'Attendance Event') {
      attendance.events.push({
        //@ts-ignore
        day: newDateFormat,
        //@ts-ignore
        value: Metadata.attendance[event.Interaction]
      })
    }
  });

  // if no cycle exit date, use current
  //@ts-ignore
  if (!attendance['Cycle Exit']) {
    const date = new Date(Date.now());
    //@ts-ignore
    attendance['Cycle Exit'] = date.toISOString();
  }
  return attendance;
}

export const sortMetircsByAssociate = (metrics: Metric[]): Metric[][] => {
  const associates: any = {};

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
}

export const getCycleMetrics = (metrics: Metric[][]): Metric[] => {
  // find metric array with cycle data
  const index = metrics.findIndex((metrics) => Metadata.staff.includes(metrics[0].Person) || metrics[0].Person === '');
  // remove from associate metrics array and return it
  return metrics.splice(index, 1)[0];
}

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
}

export const getCycleAssociateCount = (associates: Associate[]): number[] => {
  const activeCount = associates.filter((associate: Associate) => !associate.endDate);
  return [associates.length, activeCount.length];
}

export const getCycleMetadata = (data: any) => {
  const metadata = {};
  data.forEach((event: any) => {
    // check for interaction type
    if (Metadata.cycleMetadate.includes(event['Interaction Type']) || RegExp('Cycle Exit').test(event['Interaction Type'])) {
      // because our data entry is wonky
      let field;
      if (event.Interaction === '') {
        field = event['Interaction Type'];
      } else if (RegExp('Cycle Exit').test(event['Interaction Type'])) {
        field = 'Associate Leave';
      } else {
        field = event.Interaction
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
}

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
}

export const getAssessmentTableData = (name: any, values: any, allCycleAggr: any) => ({
  name,
  projectAvg: `${values.projectAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.projectScores, values.projectAvg))}`,
  quizAvg: `${values.quizAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.quizScores, values.quizAvg))}`,
  softSkillsAvg: `${values.softSkillsAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.softSkillsScores, values.softSkillsAvg))}`,
  attemptPass: values.attemptPass + '%'
});

export const getUrlParams = (urlHistory: any) => {
  const url = urlHistory.location.pathname.split('/');
  // get associate name from url and format to use ' ' instead of '-'
  const associate = url[url.length - 1].split('-').join(' ');
  // get cycle name
  const cycle = url[2];

  return { url, cycle, associate };
}

export const formatAssociateData = (metrics: Metric[], cycle: string): Associate => {
  const associate = new Associate();
  associate.name = metrics[0].Person;
  associate.cycle = cycle;
  associate.metrics = metrics;

  for (const metric of metrics) {
    const type = metric['Interaction Type'];
    const module = associate.modules.find((module: Module) => module.type === metric.Interaction);

    switch (type) {
      case 'Module Completed':
        if (module) {
          module.endDate = metric.Date
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
      default: break;
    }
    // multiple exit types, boolean check simpler than cases
    if (RegExp('Cycle Exit').test(type)) {
      associate.active = false;
      associate['endDate'] = metric.Date;
      associate.exitReason = metric.Interaction;
    }
  }
  return associate;
}

export const formatCycleData = (metrics: Metric[], associates: Associate[], cycleName: string) => {
  const cycle = new Cycle();
  cycle.name = cycleName;
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
      case 'Staff Change':
        break;
      default: break;
    }
  }
  return cycle;
}