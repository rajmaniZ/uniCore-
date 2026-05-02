
export const colleges = [
  {
    _id: "col1",
    type: "college", 

    collegeName: "ABC Engineering College",
    code: "ABC123",
    status: "active",

    about: "Leading engineering college with modern infrastructure and research focus.",

    media: {
      logo: "/images/college/logo.png",
      building: "/images/college/building.jpg",
      gallery: [
        "/images/college/1.jpg",
        "/images/college/2.jpg"
      ]
    },

    address: "123 Tech Park, City",
    phone: "+91 9876543210",
    email: "admin@abc.edu",
    website: "www.abc.edu",
    establishedYear: 2005,

    joinedAt: new Date("2024-01-10"),

    structure: {
      CSE: {
        hod: {
          name: "Dr. Priya Sharma",
          email: "hod.cse@abc.edu",
          empId: "EMP001"
        },

        courses: {
          "B.tech": {
            duration: 4,
            system: "semester",

            structure: {
              1: {
                subjects: [
                  { name: "Maths", code: "M101" },
                  { name: "Physics", code: "P101" }
                ]
              },
              2: {
                subjects: [
                  { name: "Data Structures", code: "CS201" }
                ]
              }
            }
          }
        }
      }
    }
  },

  {
    _id: "col2",
    type: "college",

    collegeName: "XYZ Institute of Technology",
    code: "XYZ456",
    status: "active",

    about: "Tech-focused institute with strong placement records.",

    media: {
      logo: "/images/xyz/logo.png",
      building: "/images/xyz/building.jpg",
      gallery: []
    },

    address: "456 Innovation Hub",
    phone: "+91 9876543211",
    email: "admin@xyz.edu",
    website: "www.xyz.edu",
    establishedYear: 2010,

    joinedAt: new Date("2024-02-15"),

    structure: {}
  }
];

export const schools = [
  {
    _id: "sch1",
    type: "school",

    name: "Sunrise Public School",
    code: "SCH001",

    about: "CBSE school focused on academics and extracurricular growth.",

    media: {
      logo: "/images/school/logo.png",
      building: "/images/school/building.jpg",
      gallery: []
    },

    structure: {
      "1": {
        sections: ["A", "B"],
        subjects: {
          common: [
            { name: "Maths", code: "M101" },
            { name: "English", code: "E101" }
          ]
        }
      },

      "9": {
        sections: ["A"],
        streams: ["Science"],
        subjects: {
          Science: [
            { name: "Physics", code: "P101" }
          ]
        }
      }
    }
  }
];

export const branches = ["IT","CSE", "ECE", "ME", "CE", "EE" ];

export const subjectsMap = {
  CSE: [
    { name: "Data Structures", code: "CS201" },
    { name: "Operating Systems", code: "CS301" },
    { name: "DBMS", code: "CS302" },
    { name: "AI/ML", code: "CS401" },
  ],
  ECE: [
    { name: "Signals & Systems", code: "EC201" },
    { name: "VLSI Design", code: "EC301" },
    { name: "Communication", code: "EC302" },
  ],
  ME: [
    { name: "Thermodynamics", code: "ME201" },
    { name: "Mechanics", code: "ME202" },
    { name: "Production", code: "ME301" },
  ],
  CE: [
    { name: "Structures", code: "CE201" },
    { name: "Surveying", code: "CE202" },
    { name: "Geotechnics", code: "CE301" },
  ],
  EE: [
    { name: "Circuits", code: "EE201" },
    { name: "Machines", code: "EE301" },
    { name: "Power Systems", code: "EE302" },
  ],
  IT: [
    { name: "Web Development", code: "IT201" },
    { name: "Cloud Computing", code: "IT301" },
    { name: "Cyber Security", code: "IT302" },
  ],
};

export const users = [
  {
    _id: "super1",
    role: "superadmin",          
    name: "System Admin",
    email: "super@campus.com",
    password: "admin123",
    status: "active",
  },
  {
    _id: "admin1",
    role: "admin",               
    name: "Dr. Rajesh Kumar",
    email: "admin@abc.edu",
    password: "admin123",
    collegeId: "col1",
    phone: "+91 9876543210",
    status: "active",
    joinedAt: new Date("2024-01-15"),
  },
  {
    _id: "hod1",
    role: "hod",
    name: "Dr. Priya Sharma",
    email: "hod.cse@abc.edu",
    password: "hod123",
    collegeId: "col1",
    department: "CSE",
    empId: "EMP001",
    phone: "+91 9876543211",
    status: "active",
  },
  {
    _id: "t1",
    role: "teacher",
    name: "Prof. John Smith",
    email: "john@abc.edu",
    password: "teacher123",
    collegeId: "col1",
    department: "CSE",
    empId: "EMP101",
    subjects: ["CS201", "CS301"],
    classes: ["CSE-1", "CSE-2"],
    phone: "+91 9876543212",
    status: "active",
    joinedAt: new Date("2024-02-01"),
  },
  {
    _id: "t2",
    role: "teacher",
    name: "Prof. Alice Johnson",
    email: "alice@abc.edu",
    password: "teacher123",
    collegeId: "col1",
    department: "CSE",
    empId: "EMP102",
    subjects: ["CS302", "CS401"],
    classes: ["CSE-1", "CSE-3"],
    phone: "+91 9876543213",
    status: "active",
    joinedAt: new Date("2024-02-05"),
  },
  {
    _id: "p1",
    role: "principal",
    name: "Dr. Ramesh Gupta",
    email: "principal@abc.edu",
    password: "principal123",
    collegeId: "col1",
    phone: "+91 9876543214",
    status: "active",
  },
  {
    _id: "s_demo",
    role: "student",
    name: "Demo Student",
    email: "student01@abc.edu",
    password: "student123",
    rollNo: "CSE2024001",
    class: "CSE-1",
    branch: "CSE",
    year: "2",
    semester: "4",
    subjects: ["CS201", "CS301", "CS302", "CS401"],
    collegeId: "col1",
    phone: "+91 9876500000",
    address: "1 Main Street, City",
    status: "active",
    gpa: "8.75",
    joinedAt: new Date("2024-01-20"),
  },
];

export const students = [];
const classes = ["CSE-1", "CSE-2", "CSE-3", "ECE-1", "ECE-2", "ME-1", "ME-2"];

classes.forEach((cls, classIndex) => {
  const branch = cls.split("-")[0];
  for (let i = 1; i <= 15; i++) {
    students.push({
      _id: `s${classIndex}${i}`,
      role: "student",
      name: `Student ${cls}-${i}`,
      email: `student${classIndex}${i}@abc.edu`,
      password: "student123",
      rollNo: `${branch}${2024}${String(i).padStart(3, "0")}`,
      class: cls,
      branch,
      year: String((classIndex % 4) + 1),
      semester: String(((classIndex % 4) + 1) * 2),
      subjects: subjectsMap[branch]?.map((s) => s.code) || [],
      collegeId: "col1",
      phone: `+91 98765${String(classIndex).padStart(2, "0")}${String(i).padStart(3, "0")}`,
      address: `${i} Main Street, City`,
      status: "active",
      gpa: (7 + Math.random() * 3).toFixed(2),
      joinedAt: new Date("2024-01-20"),
    });
  }
});

export const teachers = users.filter((u) => u.role === "teacher");

export const joinRequests = [
  {
    _id: "req1",
    name: "Amit Kumar",
    email: "amit@gmail.com",
    role: "student",
    class: "CSE-2",
    branch: "CSE",
    year: "2",
    rollNo: "CSE2024101",
    collegeCode: "ABC123",
    phone: "+91 9876500001",
    status: "pending",
    requestedAt: new Date(Date.now() - 3600000),
  },
  {
    _id: "req2",
    name: "Dr. Neha Singh",
    email: "neha@gmail.com",
    role: "teacher",
    department: "CSE",
    empId: "EMP201",
    subjects: ["CS201", "CS301"],
    collegeCode: "ABC123",
    phone: "+91 9876500002",
    status: "pending",
    requestedAt: new Date(Date.now() - 7200000),
  },
  {
    _id: "req3",
    name: "Rahul Verma",
    email: "rahul@gmail.com",
    role: "student",
    class: "ECE-1",
    branch: "ECE",
    year: "1",
    rollNo: "ECE2024050",
    collegeCode: "ABC123",
    phone: "+91 9876500003",
    status: "pending",
    requestedAt: new Date(Date.now() - 10800000),
  },
];

export const attendance = [
  {
    _id: "att1",
    class: "CSE-1",
    subject: "CS201",
    date: "2024-04-10",
    teacherId: "t1",
    records: [
      { studentId: "s01", status: "present" },
      { studentId: "s02", status: "present" },
      { studentId: "s03", status: "absent" },
      { studentId: "s_demo", status: "present" },
      { studentId: "s05", status: "late" },
    ],
  },
  {
    _id: "att2",
    class: "CSE-1",
    subject: "CS301",
    date: "2024-04-10",
    teacherId: "t1",
    records: [
      { studentId: "s01", status: "present" },
      { studentId: "s02", status: "absent" },
      { studentId: "s_demo", status: "present" },
      { studentId: "s04", status: "present" },
      { studentId: "s05", status: "present" },
    ],
  },
];

export const assignments = [
  {
    _id: "assign1",
    description: "Implement singly and doubly linked list with all operations",
    subject: "CS201",
    class: "CSE-1",
    teacherId: "t1",
    deadline: new Date(Date.now() + 86400000 * 3),
    maxMarks: 100,
    createdAt: new Date(Date.now() - 86400000 * 2),
    status: "active",
  },
  {
    _id: "assign2",
    description: "Implement FCFS, SJF, and Round Robin scheduling algorithms",
    subject: "CS301",
    class: "CSE-1",
    teacherId: "t1",
    deadline: new Date(Date.now() + 86400000 * 7),
    maxMarks: 100,
    createdAt: new Date(Date.now() - 86400000),
    status: "active",
  },
  {
    _id: "assign3",
    description: "Design ER diagram for Library Management System",
    subject: "CS302",
    class: "CSE-1",
    teacherId: "t2",
    deadline: new Date(Date.now() + 86400000 * 5),
    maxMarks: 50,
    createdAt: new Date(),
    status: "active",
  },
];

export const submissions = [
  {
    _id: "sub1",
    assignmentId: "assign1",
    studentId: "s_demo",
    file: "/submissions/linkedlist_demo.pdf",
    submittedAt: new Date(Date.now() - 86400000),
    status: "graded",
    marks: 85,
    feedback: "Good implementation, but missing edge cases",
  },
];

export const announcements = [
  {
    _id: "ann1",
    Exam:" Schedule",
    message: "Mid-semester exams will start from April 20th. Check timetable.",
    target: "all",
    targetClass: null,
    createdBy: "admin1",
    createdAt: new Date(Date.now() - 86400000 * 2),
    priority: "high",
  },
  {
    _id: "ann2",
    message: "Tomorrow DSA class is cancelled due to faculty meeting.",
    target: "class",
    targetClass: "CSE-1",
    createdBy: "t1",
    createdAt: new Date(Date.now() - 3600000),
    priority: "medium",
  },
];

export const timetable = {
  "CSE-1": {
    Monday: [
      { time: "9:00-10:00", subject: "CS201", teacher: "t1", room: "101" },
      { time: "10:00-11:00", subject: "CS301", teacher: "t1", room: "101" },
      { time: "11:30-12:30", subject: "CS302", teacher: "t2", room: "102" },
    ],
    Tuesday: [
      { time: "9:00-10:00", subject: "CS302", teacher: "t2", room: "102" },
      { time: "10:00-11:00", subject: "CS201", teacher: "t1", room: "101" },
      { time: "2:00-4:00", subject: "CS201-Lab", teacher: "t1", room: "Lab1" },
    ],
  },
};

export const getStats = (collegeId) => {
  const collegeStudents = students.filter((s) => s.collegeId === collegeId);
  const collegeTeachers = teachers.filter((t) => t.collegeId === collegeId);
  const pendingRequests = joinRequests.filter(
    (r) =>
      r.status === "pending" &&
      r.collegeCode === colleges.find((c) => c._id === collegeId)?.code
  );
  return {
    totalStudents: collegeStudents.length,
    totalTeachers: collegeTeachers.length,
    pendingRequests: pendingRequests.length,
    departments: [...new Set(collegeStudents.map((s) => s.branch))].length,
  };
};
