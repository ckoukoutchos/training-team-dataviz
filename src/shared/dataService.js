import Metadata from './metadata';
import CONSTS from './constants';

export const calcAssociateAggr = associates => {
  const avgs = {};
  associates.forEach(associate => {
    avgs[associate[0].Person] = {
      projectAvg: calcMetricAvg(associate, CONSTS.projectScore, Metadata['Project (Score)']),
      quizAvg: calcMetricAvg(associate, CONSTS.quiz, Metadata.Quiz),
      softSkillsAvg: calcMetricAvg(associate, CONSTS.softSkills, Metadata['Soft Skill Assessment'])
    };
  });
  return avgs;
}

export const calcCycleAggr = associates => {
  let projectAvg = 0;
  let projectMax = 0;
  let projectMin = 100;
  let quizAvg = 0;
  let quizMax = 0;
  let quizMin = 100;
  let softSkillsAvg = 0;
  let softSkillsMax = 0;
  let softSkillsMin = 100;
  let numProjects = Object.keys(associates).length;
  let numQuizzes = Object.keys(associates).length;
  let numSoftSkills = Object.keys(associates).length;

  for (const associate in associates) {
    projectAvg += associates[associate].projectAvg;

    if (associates[associate].projectAvg === 0) {
      numProjects--;
    }
    quizAvg += associates[associate].quizAvg;

    if (associates[associate].quizAvg === 0) {
      numQuizzes--;
    }
    softSkillsAvg += associates[associate].softSkillsAvg;

    if (associates[associate].softSkillsAvg === 0) {
      numSoftSkills--;
    }

    if (associates[associate].projectAvg > projectMax) {
      projectMax = associates[associate].projectAvg;
    }
    if (associates[associate].projectAvg < projectMin && associates[associate].projectAvg !== 0) {
      projectMin = associates[associate].projectAvg;
    }
    if (associates[associate].quizAvg > quizMax) {
      quizMax = associates[associate].quizAvg;
    }
    if (associates[associate].quizAvg < quizMin && associates[associate].quizAvg !== 0) {
      quizMin = associates[associate].quizAvg;
    }
    if (associates[associate].softSkillsAvg > softSkillsMax) {
      softSkillsMax = associates[associate].softSkillsAvg;
    }
    if (associates[associate].softSkillsAvg < softSkillsMin && associates[associate].softSkillsAvg !== 0) {
      softSkillsMin = associates[associate].softSkillsAvg;
    }
  };

  return {
    projectAvg: Math.round(projectAvg / numProjects),
    projectMax,
    projectMin,
    quizAvg: Math.round(quizAvg / numQuizzes),
    quizMax,
    quizMin,
    softSkillsMax,
    softSkillsMin,
    softSkillsAvg: Math.round(softSkillsAvg / numSoftSkills)
  }
}

export const calcDaysSince = (startDate, endDate) => {
  // format as Date object
  const startDateSplit = startDate.split('/');
  const startDateObj = new Date('20' + startDateSplit[2], startDateSplit[0] - 1, startDateSplit[1]);

  if (endDate) {
    // if end date provided, format as Date object and calc time btw start and end
    const endDateSplit = endDate.split('/');
    const endDateObj = new Date('20' + endDateSplit[2], endDateSplit[0] - 1, endDateSplit[1]);
    const cycleLength = (endDateObj - startDateObj) / 86400000;
    return Math.round(cycleLength);
  } else {
    // if no end date, calc time btw now and start
    const daysSinceStart = (Date.now() - startDateObj) / 86400000;
    return Math.round(daysSinceStart);
  }
}

export const calcDateMarkers = metadata => {
  const startDate = metadata['Associate Start'];
  return Metadata.modules.map(modules => {
    if (metadata[modules].start) {
      return Math.round(calcDaysSince(startDate, metadata[modules].start));
    }
    return 0;
  });
}

export const calcModuleLength = metadata => {
  let prevTotal = 0;
  const moduleLengths = [];
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

export const calcMetricAvg = (associate, metric, maxScores) => {
  const metrics = associate.filter(event => event['Interaction Type'] === metric);

  // return 0 if no metrics were taken
  if (!metrics.length) {
    return 0;
  }

  // adds up scores of all associate metrics and Max Scores for those metrics
  const metricAvg = metrics.reduce((acc, curr) => {
    return [acc[0] + Number(curr.Score), acc[1] + maxScores[curr.Interaction]['Max Score']];
  }, [0, 0]);

  // convert to percent and round to nearest int
  return Math.round((metricAvg[0] / metricAvg[1]) * 100);
}

export const sortMetircsByAssociate = data => {
  const associates = {};

  for (const item of data) {
    // ignore training staff and empty Person
    if (!Metadata.staff.includes(item.Person) && item.Person !== '') {

      // if associate already added, push item
      if (associates[item.Person]) {
        associates[item.Person].push(item);
      } else {
        // if field doesn't exist, add one
        associates[item.Person] = [item];
      }
    }
  }
  return Object.values(associates);
}

export const getAssociateMetadata = data => {
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
        person[event.Interaction].end = event.Date;
      } else if (event['Interaction Type'] === 'Module Started') {
        person[event.Interaction].start = event.Date;
      } else if (event['Interaction Type'] === 'Associate Start') {
        person[event['Interaction Type']] = event.Date;
      } else if (RegExp('Cycle Exit').test(event['Interaction Type'])) {
        person['Cycle Exit'] = event.Date;
      }
    }
    metadata[associate[0].Person] = person;
  }
  return metadata;
}

export const getCycleMetadata = data => {
  const metadata = {};
  data.forEach(event => {
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
      if (!metadata[field]) {
        // staff change need name and date
        if (field !== 'Cycle Start Date' && field !== 'Cycle End Date') {
          metadata[field] = [{ name: event.Person, date: event.Date }];
        } else {
          metadata[field] = [event.Date];
        }
        // otherwise, add to list
      } else {
        if (field !== 'Cycle Start Date' && field !== 'Cycle End Date') {
          metadata[field].push({ name: event.Person, date: event.Date });
        } else {
          metadata[field].push(event.Date);
        }
      }
    }
  });
  return metadata;
}

export const getUrlParams = urlHistory => {
  const url = urlHistory.location.pathname.split('/');
  // get associate name from url and format to use ' ' instead of '-'
  const associate = url[url.length - 1].split('-').join(' ');
  // get cycle name
  const cycle = url[2];

  return { url, cycle, associate };
}