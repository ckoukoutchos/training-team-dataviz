// eventually to be moved to config file/DB

export default {
  attendance: {
    'Excused Absence': 0,
    'Unexcused Absence': 1,
    'Excused Late Arrival': 2,
    'Unexcused Late Arrival': 3,
    'Optional Attendance': 4
  },
  cycles: [
    'mlPortland2019',
    'tradChicago2019',
    'tradDenver2019',
    'tradBoston2019',
    'tradBaltimore2019'
  ],
  'Interaction Type': {
    quizzes: 'Quiz',
    projects: 'Project (Score)',
    softSkills: 'Soft Skill Assessment'
  },
  cycleMetadate: [
    'Staff change',
    'Cycle End Date',
    'Cycle Start Date',
    'Associate Start'
  ],
  maxTimePerModule: [42, 28, 70, 56, 28, 14],
  mlModules: [
    'Development Basics and Front End',
    'Databases',
    'Logic Layer (Java)',
    'Front End Frameworks (React)',
    'Frontend Post-group',
    'Group Project',
    'Group Post-Frontend',
    'Final Project'
  ],
  modules: [
    'Development Basics and Front End',
    'Databases',
    'Logic Layer (Java)',
    'Frontend Frameworks (React)',
    'Group Project',
    'Final Project'
  ],
  'Project (Score)': {
    HTML_CSS_Page_Match_Project_v2: {
      'Max Score': 30,
      Module: 'Development Basics and Front End'
    },
    JavaScript_Form_Validation_Project_v2: {
      'Max Score': 30,
      Module: 'Development Basics and Front End'
    },
    MongoDB_Database_Project_v3: {
      'Max Score': 30,
      Module: 'Databases'
    },
    PostgreSQL_Database_Project_v3: {
      'Max Score': 30,
      Module: 'Databases'
    },
    Garden_Center_API_Project_v4: {
      'Max Score': 30,
      Module: 'Logic Layer (Java)'
    },
    Catalyte_Pet_Emporium_API_Project_v2: {
      'Max Score': 30,
      Module: 'Logic Layer (Java)'
    },
    Garden_Center_Front_End_Project_v2: {
      'Max Score': 30,
      Module: 'Frontend Frameworks (React)'
    },
    Redux_Garden_Center_Front_End_Project_v2: {
      'Max Score': 30,
      Module: 'Frontend Frameworks (React)'
    },
    E_Commerce_Group_Project_v1: {
      'Max Score': 81,
      Module: 'Group Project'
    },
    Final_Health_Project_v3: {
      'Max Score': 30,
      Module: 'Final Project'
    },
    Garden_Center_API_Project_v5: {
      'Max Score': 30,
      Module: 'Logic Layer (Java)'
    }
  },
  Quiz: {
    Quiz_Introductory_v1: {
      'Max Score': 17,
      Module: 'Development Basics and Front End'
    },
    Quiz_HTML_and_CSS_v1: {
      'Max Score': 12,
      Module: 'Development Basics and Front End'
    },
    Quiz_JavaScript_v1: {
      'Max Score': 49,
      Module: 'Development Basics and Front End'
    },
    Quiz_Intro_to_Java_v1: {
      'Max Score': 19,
      Module: 'Logic Layer (Java)'
    },
    Quiz_Relational_Databases_v1: {
      'Max Score': 30,
      Module: 'Databases'
    },
    Quiz_Document_Databases_v1: {
      'Max Score': 16,
      Module: 'Databases'
    },
    Quiz_Java_Unit_Testing_And_OOP_v1: {
      'Max Score': 37,
      Module: 'Logic Layer (Java)'
    },
    Quiz_React_js_v1: {
      'Max Score': 34,
      Module: 'Frontend Frameworks (React)'
    },
    Quiz_React_js_v2: {
      'Max Score': 14,
      Module: 'Frontend Frameworks (React)'
    },
    Quiz_Redux_v1: {
      'Max Score': 27,
      Module: 'Frontend Frameworks (React)'
    },
    Quiz_Redux_v2: {
      'Max Score': 10,
      Module: 'Frontend Frameworks (React)'
    },
    Quiz_Spring_With_Java_v2: {
      'Max Score': 14,
      Module: 'Logic Layer (Java)'
    },
    Quiz_Document_Databases_v2: {
      'Max Score': 10,
      Module: 'Databases'
    },
    Quiz_Relational_Databases_v2: {
      'Max Score': 16,
      Module: 'Databases'
    },
    Quiz_Intro_to_Java_v2: {
      'Max Score': 14,
      Module: 'Logic Layer (Java)'
    },
    Quiz_Java_Unit_Testing_And_OOP_v2: {
      'Max Score': 22,
      Module: 'Logic Layer (Java)'
    },
    Quiz_JavaScript_v2: {
      'Max Score': 26,
      Module: 'Development Basics and Front End'
    },
    Quiz_Introductory_v2: {
      'Max Score': 14,
      Module: 'Development Basics and Front End'
    }
  },
  required: {
    'Development Basics and Front End': {
      projects: [
        'HTML_CSS_Page_Match_Project_v2',
        'JavaScript_Form_Validation_Project_v2'
      ],
      quizzes: [
        'Quiz_Introductory_v2',
        'Quiz_HTML_and_CSS_v1',
        'Quiz_JavaScript_v2'
      ],
      exercises: [
        'Git_Workflow_Exercise_v1',
        'JavaScript_Calculator_Exercise_v1',
        'JavaScript_Debugging_Hangman_Exercise_v1',
        'Javascript_Memory_Game_Exercise_v1'
      ]
    },
    Databases: {
      projects: [
        'MongoDB_Database_Project_v3',
        'PostgreSQL_Database_Project_v3'
      ],
      quizzes: ['Quiz_Relational_Databases_v2', 'Quiz_Document_Databases_v2'],
      exercises: []
    },
    'Logic Layer (Java)': {
      projects: [
        'Garden_Center_API_Project_v5',
        'Catalyte_Pet_Emporium_API_Project_v2'
      ],
      quizzes: [
        'Quiz_Intro_to_Java_v2',
        'Quiz_Java_Unit_Testing_And_OOP_v2',
        'Quiz_Spring_With_Java_v2'
      ],
      exercises: [
        'Java_Logic_Exercise_v1',
        'Logic_Layer_War_Exercise_v1',
        'Unit_Testing_Part_1_Exercise_v1',
        'API_Data_Access_Exercise_v2',
        'Unit_Testing_Part_2_Exercise_v2',
        'Java_Integration_Testing_Exercise_v1'
      ]
    },
    'Front End Frameworks (React)': {
      projects: [
        'Garden_Center_Front_End_Project_v2',
        'Redux_Garden_Center_Front_End_Project_v2'
      ],
      quizzes: ['Quiz_React_js_v2', 'Quiz_Redux_v2'],
      exercises: [
        'Garden_Center_Frontend_Prototype_Exercise_v1',
        'Frontend_Frameworks_Memory_Game_Exercise_v1',
        'Garden_Center_Frontend_Nav_Bar_Exercise_v1',
        'Garden_Center_Frontend_Customers_Exercise_v1',
        'Garden_Center_Frontend_Testing_Exercise_v1',
        'Garden_Center_Frontend_Fetching_Exercise_v1',
        'Garden_Center_Frontend_Error_Handling_Exercise_v1',
        'Garden_Center_Frontend_Routing_Exercise_v1',
        'Garden_Center_Frontend_Authentication_Exercise_v1'
      ]
    },
    'Group Project': {
      projects: [],
      quizzes: [],
      exercises: []
    },
    'Final Project': {
      projects: [],
      quizzes: [],
      exercises: []
    }
  },
  'Soft Skill Assessment': {
    'Problem Solving': { 'Max Score': 5 },
    'Self Awareness and Self Improvement': { 'Max Score': 5 },
    'Project Execution': { 'Max Score': 5 },
    Professionalism: { 'Max Score': 5 },
    Communication: { 'Max Score': 5 }
  },
  staff: [
    'Eric Queen',
    'Corbin Koukoutchos',
    'Dan Reuther',
    'Katlyn Beck',
    'Greg Fisher',
    'Taylor Elam',
    'Tony Richards',
    'Dan Lawless',
    'William Newman',
    'Hayes McCardell',
    'Josh Tucker',
    'Kyle Pike',
    'James Jowers'
  ]
};
