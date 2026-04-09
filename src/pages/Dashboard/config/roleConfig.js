


export const roleConfig = {
  superadmin: {
    label: "Super Admin",
    sidebar: [
      { name: "Dashboard", path: "/superadmin/dashboard", icon: "dashboard" },
      { name: "Colleges", path: "/superadmin/colleges", icon: "building" },
      { name: "Admins", path: "/superadmin/admins", icon: "users" },
      { name: "Teachers", path: "/superadmin/teachers", icon: "chalkboard" },
      { name: "Students", path: "/superadmin/students", icon: "users" },
      { name: "Colleges", path: "/superadmin/colleges", icon: "building" },
      { name: "Courses", path: "/superadmin/courses", icon: "book" },
      { name: "Settings", path: "/superadmin/settings", icon: "settings" },
      { name: "Join Requests", path: "/superadmin/JoinRequests", icon: "userPlus" },
    ],
    permissions: ["all"],
  },
  admin: {
    label: "College Admin",
    profile: {
      name: "", path: "admin/profile", icon: "dashboard",
    },

    sidebar: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },

      { name: "About Institute", path: "/admin/aboutInstitute", icon: "building" },
      { name: "Students", path: "/admin/students", icon: "users" },
      { name: "Teachers", path: "/admin/teachers", icon: "chalkboard" },

      { name: "Courses", path: "/admin/courses", icon: "book" },

      { name: "Join Requests", path: "/admin/JoinRequests", icon: "userPlus" },
      //{ name: "Subjects", path: "/hod/subjects", icon: "book" },
      { name: "Timetable", path: "/admin/timetable", icon: "calendar" },
      { name: "Reports", path: "/admin/reports", icon: "chart" },
      { name: "Settings", path: "/admin/settings", icon: "settings" },
    ],

    // ✅ COLLEGE-LEVEL FULL CONTROL (NOT SYSTEM)
    permissions: [
      "manage_students",
      "manage_teachers",
      "manage_courses",
      "manage_requests",
      "view_reports",
      "edit_college_data"
    ],
  },

  hod: {
    label: "Head of Department",
    sidebar: [
      { name: "Join Requests", path: "/hod/JoinRequests", icon: "userPlus" },
      { name: "Dashboard", path: "/hod/dashboard", icon: "dashboard" },
      { name: "Classes", path: "/hod/classes", icon: "door" },
      { name: "Teachers", path: "/hod/teachers", icon: "chalkboard" },
      { name: "Students", path: "/hod/students", icon: "users" },
      { name: "Subjects", path: "/hod/subjects", icon: "book" },
      { name: "Timetable", path: "/hod/timetable", icon: "calendar" },
      { name: "Reports", path: "/hod/reports", icon: "chart" },
      { name: "Settings", path: "/hod/settings", icon: "settings" },
    ],
    permissions: ["manage_department", "view_department_data"],
  },

  teacher: {
    label: "Teacher",
    sidebar: [
      // { name: "Join Requests", path: "/admin/JoinRequests", icon: "userPlus" },
      { name: "Dashboard", path: "/teacher/dashboard", icon: "dashboard" },
      { name: "Classes", path: "/teacher/classes", icon: "door" },
      { name: "Students", path: "/teacher/students", icon: "users" },
      { name: "Assignments", path: "/teacher/assignments", icon: "clipboard" },
      { name: "Attendance", path: "/teacher/attendance", icon: "checkSquare" },
      { name: "Subjects", path: "/teacher/subjects", icon: "book" },
      { name: "Timetable", path: "/teacher/timetable", icon: "calendar" },
      { name: "Settings", path: "/teacher/settings", icon: "settings" },
    ],
    permissions: ["manage_class", "mark_attendance", "create_assignments"],
  },

  student: {
    label: "Student",
    sidebar: [
      { name: "Dashboard", path: "/student/dashboard", icon: "dashboard" },
      { name: "Profile", path: "/student/profile", icon: "user" },
      { name: "Subjects", path: "/student/subjects", icon: "book" },
      { name: "Assignments", path: "/student/assignments", icon: "clipboard" },
      { name: "Attendance", path: "/student/attendance", icon: "checkSquare" },
      { name: "Grades", path: "/student/grades", icon: "award" },
      { name: "Timetable", path: "/student/timetable", icon: "calendar" },
      { name: "Settings", path: "/student/settings", icon: "settings" },
    ],
    permissions: ["view_own", "submit_assignments"],
  },
};

export const getRoutesByRole = (role) => roleConfig[role]?.sidebar || [];
export const hasPermission = (role, permission) => {
  const config = roleConfig[role];
  return config?.permissions.includes("all") || config?.permissions.includes(permission);
};
