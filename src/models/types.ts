export enum AssessmentType {
  EXERCISE = 'Exercise',
  PROJECT = 'Project (Score)',
  QUIZ = 'Quiz',
  SOFT_SKILLS = 'Soft Skill Assessment'
}

export enum AttendanceType {
  EXCUSED_ABSENCE = 'Excused Absence',
  EXCUSED_LATE = 'Excused Late Arrival',
  OPTIONAL = 'Optional Attendance',
  UNEXCUSED_ABSENCE = 'Unexcused Absence',
  UNEXCUSED_LATE = 'Unexcused Late Arrival',
}

export enum ModuleType {
  BASICS = 'Development Basics and Front End',
  DATABASES = 'Databases',
  FINAL = 'Final Project',
  FRONTEND = 'Front End Frameworks (React)',
  GROUP = 'Group Project',
  LOGIC_LAYER = 'Logic Layer (Java)',
}

export enum StaffRole {
  TRAINER = 'Trainer',
  TA = 'TA'
}

export interface Aggregation {
  attemptPass: number;
  name: string;
  projects: number;
  quizzes: number;
  softSkills: number;
}

export interface Assessment {
  associate: string;
  attemptNumber: number;
  cycle: string;
  date: Date;
  module: ModuleType;
  name: string;
  score: number;
  type: AssessmentType;
}

export interface AssessmentAggregation {
  average: number;
  module: string;
  name: string;
  scores: number[];
  type: AssessmentType;
}

export interface Attendance {
  events: AttendanceEvent[];
  count: {
    'Excused Absence': number;
    'Unexcused Absence': number;
    'Excused Late Arrival': number;
    'Unexcused Late Arrival': number;
    'Optional Attendance': number;
  }
}

export class Associate implements Person {
  active: boolean;
  attendance: Attendance;
  cycle: string;
  daysInCycle: number;
  endDate: Date | null;
  exercises: Metric[];
  exitReason: string | null;
  metrics: Metric[];
  name: string;
  modules: Module[];
  projects: Metric[];
  quizzes: Metric[];
  softSkills: Metric[];
  startDate: Date;

  constructor() {
    this.active = false;
    this.attendance = {
      events: [],
      count: {
        [AttendanceType.EXCUSED_ABSENCE]: 0,
        [AttendanceType.UNEXCUSED_ABSENCE]: 0,
        [AttendanceType.EXCUSED_LATE]: 0,
        [AttendanceType.UNEXCUSED_LATE]: 0,
        [AttendanceType.OPTIONAL]: 0
      }
    };
    this.cycle = '';
    this.daysInCycle = 0;
    this.endDate = null;
    this.exercises = [];
    this.exitReason = null;
    this.metrics = [];
    this.name = '';
    this.modules = [
      {
        daysInModule: 0,
        endDate: null,
        startDate: null,
        type: 'Development Basics and Front End',
      },
      {
        daysInModule: 0,
        endDate: null,
        startDate: null,
        type: 'Databases',
      },
      {
        daysInModule: 0,
        endDate: null,
        startDate: null,
        type: 'Logic Layer (Java)',
      },
      {
        daysInModule: 0,
        endDate: null,
        startDate: null,
        type: 'Front End Frameworks (React)',
      },
      {
        daysInModule: 0,
        endDate: null,
        startDate: null,
        type: 'Group Project',
      },
      {
        daysInModule: 0,
        endDate: null,
        startDate: null,
        type: 'Final Project',
      }
    ];
    this.projects = [];
    this.quizzes = [];
    this.softSkills = [];
    this.startDate = new Date();
  }
}

export interface AttendanceEvent {
  date: Date;
  type: string;
}

export class Cycle {
  active: boolean;
  associates: Associate[];
  currentNumberOfAssociates: number;
  endDate: Date | null;
  name: string;
  fileId: string;
  staff: Staff[];
  startDate: Date;
  totalNumberOfAssociates: number;
  type: string;

  constructor() {
    this.active = false;
    this.associates = [];
    this.currentNumberOfAssociates = 0;
    this.endDate = null;
    this.name = '';
    this.fileId = '';
    this.staff = [];
    this.startDate = new Date();
    this.totalNumberOfAssociates = 0;
    this.type = '';
  }
}

export interface CycleAggregation extends Aggregation {
  aggregations: Aggregation[];
  attemptPassScores: number[];
  projectScores: number[];
  quizScores: number[];
  softSkillsScores: number[];
}

export interface Metric {
  Date: string;
  Interaction: string;
  'Interaction Type': string;
  Person: string;
  Score: string;
  [key: string]: any;
}

export interface Module {
  daysInModule: number;
  endDate: Date | null;
  modulePause?: Date;
  moduleResume?: Date;
  startDate: Date | null;
  type: string;
}

export interface Person {
  active: boolean;
  cycle: string;
  endDate: Date | null;
  metrics: Metric[];
  name: string;
  startDate: Date;
}

export class Staff implements Person {
  active: boolean;
  cycle: string;
  endDate: Date | null;
  metrics: Metric[];
  name: string;
  role: StaffRole;
  startDate: Date;

  constructor() {
    this.active = false;
    this.cycle = '';
    this.endDate = null;
    this.metrics = [];
    this.name = '';
    this.role = StaffRole.TRAINER;
    this.startDate = new Date();
  }
}
