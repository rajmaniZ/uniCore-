export const roleConfig = {
  superadmin: {
    label: "Super Admin",
    sidebar: [
      { name: "Dashboard", path: "/superadmin/dashboard", icon: "dashboard" },
      { name: "Teachers", path: "/superadmin/teachers", icon: "chalkboard" },
      { name: "Students", path: "/superadmin/students", icon: "users" },
      { name: "Join Requests", path: "/superadmin/joinRequests", icon: "userPlus" },
      { name: "Profile", path: "/superadmin/profile", icon: "user" },
      { name: "Settings", path: "/superadmin/settings", icon: "settings" },
    ],
    permissions: ["all"],
  },
  admin: {
    label: "Admin",
    sidebar: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
      { name: "Institute", path: "/admin/aboutInstitute", icon: "building" },
      { name: "Students", path: "/admin/students", icon: "users" },
      { name: "Teachers", path: "/admin/teachers", icon: "chalkboard" },
      { name: "Subjects", path: "/admin/subjects", icon: "book" },
      { name: "Join Requests", path: "/admin/joinRequests", icon: "userPlus" },
      { name: "Attendance", path: "/admin/attendance", icon: "checkSquare" },
      { name: "Timetable", path: "/admin/timetable", icon: "calendar" },
      { name: "Profile", path: "/admin/profile", icon: "user" },
      { name: "Settings", path: "/admin/settings", icon: "settings" },
    ],
    permissions: ["manage_students", "manage_teachers", "manage_structure", "manage_requests"],
  },
  hod: {
    label: "Head of Department",
    sidebar: [
      { name: "Dashboard", path: "/hod/dashboard", icon: "dashboard" },
      { name: "Students", path: "/hod/students", icon: "users" },
      { name: "Teachers", path: "/hod/teachers", icon: "chalkboard" },
      { name: "Subjects", path: "/hod/subjects", icon: "book" },
      { name: "Join Requests", path: "/hod/joinRequests", icon: "userPlus" },
      { name: "Attendance", path: "/hod/attendance", icon: "checkSquare" },
      { name: "Timetable", path: "/hod/timetable", icon: "calendar" },
      { name: "Profile", path: "/hod/profile", icon: "user" },
      { name: "Settings", path: "/hod/settings", icon: "settings" },
    ],
    permissions: ["manage_department", "view_department_data"],
  },
  teacher: {
    label: "Teacher",
    sidebar: [
      { name: "Dashboard", path: "/teacher/dashboard", icon: "dashboard" },
      { name: "Assignments", path: "/teacher/assignment", icon: "clipboard" },
      { name: "Subjects", path: "/teacher/subjects", icon: "book" },
      { name: "Attendance", path: "/teacher/attendance", icon: "checkSquare" },
      { name: "Timetable", path: "/teacher/timetable", icon: "calendar" },
      { name: "Profile", path: "/teacher/profile", icon: "user" },
      { name: "Settings", path: "/teacher/settings", icon: "settings" },
    ],
    permissions: ["mark_attendance", "create_assignments", "review_submissions"],
  },
  student: {
    label: "Student",
    sidebar: [
      { name: "Dashboard", path: "/student/dashboard", icon: "dashboard" },
      { name: "Assignments", path: "/student/submitAssignment", icon: "clipboard" },
      { name: "Subjects", path: "/student/subjects", icon: "book" },
      { name: "Attendance", path: "/student/attendance", icon: "checkSquare" },
      { name: "Timetable", path: "/student/timetable", icon: "calendar" },
      { name: "Profile", path: "/student/profile", icon: "user" },
      { name: "Settings", path: "/student/settings", icon: "settings" },
    ],
    permissions: ["view_own", "submit_assignments"],
  },
};

export const getRoutesByRole = (role) => roleConfig[role?.toLowerCase()]?.sidebar || [];

export const hasPermission = (role, permission) => {
  const permissions = roleConfig[role?.toLowerCase()]?.permissions || [];
  return permissions.includes("all") || permissions.includes(permission);
};
