// 🏫 Colleges
export const colleges = [
  {
    _id: "col1",
    role: "college", // ✅ ADDED
    collegeName: "ABC Engineering College",
    code: "ABC123",
    status: "active",
    joinedAt: new Date("2024-01-10")
  },
  {
    _id: "col2",
    role: "college",
    collegeName: "XYZ Institute of Technology",
    code: "XYZ456",
    status: "active",
    joinedAt: new Date("2024-02-15")
  },
  {
    _id: "col3",
    role: "college",
    collegeName: "Global Tech University",
    code: "GTU789",
    status: "active",
    joinedAt: new Date("2024-03-20")
  }
];

// 🌿 Branches
const branches = ["CSE", "ECE", "ME", "CE", "EE", "IT"];

// 📚 Subjects
const subjectsMap = {
  CSE: ["DSA", "OS", "DBMS", "AI"],
  ECE: ["Signals", "VLSI", "Communication"],
  ME: ["Thermo", "Mechanics", "Production"],
  CE: ["Structure", "Survey", "Geotech"],
  EE: ["Circuits", "Machines", "Power"],
  IT: ["Web", "Cloud", "Cyber Security"]
};

// 📊 Status list
const statuses = ["success", "pending", "rejected"];

// 👩‍🏫 Teachers
export const teachers = [];

colleges.forEach((col, cIndex) => {
  for (let i = 1; i <= 6; i++) {
    const branch = branches[i % 6];
    const isPending = i % 4 === 0;

    teachers.push({
      _id: `t${cIndex}${i}`,
      role: "teacher", // ✅ ADDED
      name: `Teacher_${col.code}_${i}`,
      email: `teacher${cIndex}${i}@mail.com`,
      department: branch,
      subjects: subjectsMap[branch].slice(0, 2),
      collegeId: col._id,
      class: `${branch}-${(i % 3) + 1}`,
      status: isPending ? "pending" : "success",

      requestedAt: new Date(Date.now() - i * 10000000),
      joinedAt: isPending ? null : new Date()
    });
  }
});

// 👨‍🎓 Students
export const students = [];

colleges.forEach((col, cIndex) => {
  branches.forEach((branch, bIndex) => {
    for (let i = 1; i <= 10; i++) {
      const isPending = i % 5 === 0;

      students.push({
        _id: `s${cIndex}${bIndex}${i}`,
        role: "student", // ✅ ADDED
        name: `Student_${branch}_${i}`,
        email: `student${cIndex}${bIndex}${i}@mail.com`,
        rollNo: `${branch}${100 + i}`,
        class: `${branch}-${(i % 3) + 1}`,
        branch,
        year: `${(i % 4) + 1}`,
        subjects: subjectsMap[branch],
        collegeId: col._id,

        status: isPending ? "pending" : "success",
        requestedAt: new Date(Date.now() - i * 5000000),
        joinedAt: isPending ? null : new Date()
      });
    }
  });
});

// 👤 Current User (FIXED)
export const currentUser = {
  role: "teacher",
  collegeId: "col1", // ✅ IMPORTANT FIX
  class: "CSE-1"
};