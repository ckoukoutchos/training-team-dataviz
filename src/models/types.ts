export interface Aggregation {
  attemptPass: number;
  name: string;
  projects: number;
  quizzes: number;
  softSkills: number;
}

export class Associate {
  active: boolean;
  attendance: Attendance[];
  cycle: string;
  endDate: string | null;
  exercises: Metric[];
  exitReason: string | null;
  metrics: Metric[];
  name: string;
  modules: Module[];
  projects: Metric[];
  quizzes: Metric[];
  softSkills: Metric[];
  startDate: string;

  constructor() {
    this.active = false;
    this.attendance = [];
    this.cycle = '';
    this.endDate = null;
    this.exercises = [];
    this.exitReason = null;
    this.metrics = [];
    this.name = '';
    this.modules = [{
      type: 'Development Basics and Front End',
      startDate: null,
      endDate: null
    }, {
      type: 'Databases',
      startDate: null,
      endDate: null
    }, {
      type: 'Logic Layer (Java)',
      startDate: null,
      endDate: null
    }, {
      type: 'Front End Frameworks (React)',
      startDate: null,
      endDate: null
    }, {
      type: 'Group Project',
      startDate: null,
      endDate: null
    }, {
      type: 'Final Project',
      startDate: null,
      endDate: null
    }];
    this.projects = [];
    this.quizzes = [];
    this.softSkills = [];
    this.startDate = '';
  }
}

export interface Attendance {
  date: string;
  type: string;
}

export class Cycle {
  active: boolean;
  associates: Associate[];
  currentNumberOfAssociates: number;
  endDate: string | null;
  metrics: Metric[];
  name: string;
  startDate: string;
  totalNumberOfAssociates: number;
  trainers: string[];
  TAs: string[];
  type: string;

  constructor() {
    this.active = false;
    this.associates = [];
    this.currentNumberOfAssociates = 0;
    this.endDate = null;
    this.metrics = [];
    this.name = '';
    this.startDate = '';
    this.totalNumberOfAssociates = 0;
    this.trainers = [];
    this.TAs = [];
    this.type = '';
  }
}

export interface Metric {
  Date: string;
  Interaction: string;
  'Interaction Type': string;
  Person: string;
  Score: string;
}

export interface Module {
  endDate: string | null;
  startDate: string | null;
  type: string;
}
