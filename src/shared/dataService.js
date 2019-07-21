import MasterData from './masterData';

export const calcDaysSince = (startDate, endDate) => {
  // format as Date object
  const startDateSplit = startDate.split('/');
  const startDateObj = new Date('20' + startDateSplit[2], startDateSplit[0], startDateSplit[1]);

  if (endDate) {
    // if end date provided, format as Date object and calc time btw start and end
    const endDateSplit = endDate.split('/');
    const endDateObj = new Date('20' + endDateSplit[2], endDateSplit[0], endDateSplit[1]);
    const cycleLength = (endDateObj - startDateObj) / 86400000;
    return Math.round(cycleLength);
  } else {
    // if no end date, calc time btw now and start
    const daysSinceStart = (Date.now() - startDateObj) / 86400000;
    return Math.round(daysSinceStart);
  }
}

export const calcProjectScoreAvg = (associate) => {
  // filter out associate projects
  const projects = associate.filter(item => item['Interaction Type'] === 'Project (Score)');

  // return 0 if no projects were taken
  if (!projects.length) {
    return 0;
  }

  // adds up score of all associate projects and Max Scores for those projects
  const projectAvgs = projects.reduce((acc, curr) => {
    return [acc[0] + Number(curr.Score), acc[1] + 30];
  }, [0, 0]);

  // convert to percent and round to nearest int
  return Math.round((projectAvgs[0] / projectAvgs[1]) * 100);
}

export const calcQuizScoreAvg = (associate) => {
  // filter out associate quizzes
  const quizzes = associate.filter(item => item['Interaction Type'] === 'Quiz');

  // return 0 if no quizzes were taken
  if (!quizzes.length) {
    return 0;
  }

  // adds up score of all associate quizzes and Max Scores for those quizzes
  const quizAvgs = quizzes.reduce((acc, curr) => {
    return [acc[0] + Number(curr.Score), acc[1] + MasterData.Quizzes[curr.Interaction]['Max Score']];
  }, [0, 0]);

  // convert to percent and round to nearest int
  return Math.round((quizAvgs[0] / quizAvgs[1]) * 100);
}

export const calcSoftSkillsScoreAvg = (associate) => {
  // filter out associate softSkills
  const softSkills = associate.filter(item => item['Interaction Type'] === 'Soft Skill Assessment');

  // return 0 if no soft skills were taken
  if (!softSkills.length) {
    return 0;
  }

  // adds up score of all associate softSkills and Max Scores for those soft skills
  const softSkillsAvgs = softSkills.reduce((acc, curr) => {
    return [acc[0] + Number(curr.Score), acc[1] + 5];
  }, [0, 0]);

  // convert to percent and round to nearest int
  return Math.round((softSkillsAvgs[0] / softSkillsAvgs[1]) * 100);
}

export const sortCycleByAssociate = (data) => {
  const associates = {};
  for (const item of data) {
    // ignore training staff and empty Person
    if (!MasterData.staff.includes(item.Person) && item.Person !== '') {
      // if field doesn't exist, add one
      if (associates[item.Person]) {
        associates[item.Person].push(item);
      } else {
        associates[item.Person] = [item];
      }
    }
  }
  return Object.values(associates);
}