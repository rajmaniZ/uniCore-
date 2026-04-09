import { createContext, useContext, useState } from 'react';
import { 
  students as initialStudents,
  teachers as initialTeachers,
  colleges as initialColleges,
  attendance as initialAttendance,
  assignments as initialAssignments,
  announcements as initialAnnouncements,
  submissions as initialSubmissions,
} from '../mockData/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [colleges, setColleges] = useState(initialColleges);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  // Attendance functions
  const markAttendance = (attendanceData) => {
    setAttendance(prev => [...prev, { ...attendanceData, _id: `att_${Date.now()}` }]);
  };

  const getAttendanceByClass = (className, subject) => {
    return attendance.filter(a => 
      a.class === className && (!subject || a.subject === subject)
    );
  };

  const getStudentAttendance = (studentId) => {
    return attendance.filter(a => 
      a.records.some(r => r.studentId === studentId)
    );
  };

  // Assignment functions
  const createAssignment = (assignmentData) => {
    const newAssignment = {
      ...assignmentData,
      _id: `assign_${Date.now()}`,
      createdAt: new Date(),
    };
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const submitAssignment = (submissionData) => {
    const newSubmission = {
      ...submissionData,
      _id: `sub_${Date.now()}`,
      submittedAt: new Date(),
      status: 'submitted',
    };
    setSubmissions(prev => [...prev, newSubmission]);
    return newSubmission;
  };

  const gradeSubmission = (submissionId, marks, feedback) => {
    setSubmissions(prev =>
      prev.map(s => s._id === submissionId 
        ? { ...s, marks, feedback, status: 'graded' } 
        : s
      )
    );
  };

  // Announcement functions
  const createAnnouncement = (announcementData) => {
    const newAnnouncement = {
      ...announcementData,
      _id: `ann_${Date.now()}`,
      createdAt: new Date(),
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
    return newAnnouncement;
  };

  const value = {
    students,
    setStudents,
    teachers,
    setTeachers,
    colleges,
    setColleges,
    attendance,
    markAttendance,
    getAttendanceByClass,
    getStudentAttendance,
    assignments,
    createAssignment,
    submissions,
    submitAssignment,
    gradeSubmission,
    announcements,
    createAnnouncement,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
