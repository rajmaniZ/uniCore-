import { useState, useEffect } from "react";
import { useData } from "../../context/dataContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./attendance.module.css";

const ITEMS_PER_PAGE = 10;

export default function Attendance() {
  const { students, attendance, markAttendance } = useData();
  const { currentUser, isLoading } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [attendanceState, setAttendanceState] = useState({});
  const [page, setPage] = useState(1);

  if (isLoading) return <div className={styles.center}>Loading...</div>;
  if (!currentUser) return <div className={styles.center}>Login required</div>;

  const role = currentUser.role;

  // ✅ ROLE BASE FILTER
  const baseStudents = students.filter(s => {
    if (role === "teacher") return currentUser.classes.includes(s.class);
    if (role === "hod") return s.branch === currentUser.department;
    return true;
  });

  // ✅ DEPARTMENT
  const departments = [...new Set(baseStudents.map(s => s.branch))];

  // ✅ COURSE (mock logic)
  const courses = ["B.tech", "M.tech"];

  // ✅ YEAR → SEMESTER mapping
  const semesterMap = {
    "1": ["1", "2"],
    "2": ["3", "4"],
    "3": ["5", "6"],
    "4": ["7", "8"],
  };

  const semesters = semesterMap[year] || [];

  // ✅ SUBJECT (dynamic)
  const availableSubjects = [
    ...new Set(
      baseStudents
        .filter(s =>
          (!department || s.branch === department) &&
          (!year || s.year === year) &&
          (!semester || s.semester === semester)
        )
        .flatMap(s => s.subjects)
    )
  ];

  // ✅ CLASS (subject controlled)
  const availableClasses = [
    ...new Set(
      baseStudents
        .filter(s =>
          (!department || s.branch === department) &&
          (!year || s.year === year) &&
          (!semester || s.semester === semester) &&
          (!subject || s.subjects.includes(subject))
        )
        .map(s => s.class)
    )
  ];

  // ✅ FINAL STUDENTS
  const finalStudents = baseStudents.filter(s =>
    s.class === selectedClass &&
    (!subject || s.subjects.includes(subject))
  );

  // ✅ PAGINATION
  const totalPages = Math.ceil(finalStudents.length / ITEMS_PER_PAGE);
  const paginated = finalStudents.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // ✅ LOAD EXISTING
  useEffect(() => {
    const existing = attendance.find(
      a =>
        a.subject === subject &&
        a.class === selectedClass &&
        a.date === today
    );

    if (existing) {
      const map = {};
      existing.records.forEach(r => {
        if (r.status === "present") map[r.studentId] = true;
      });
      setAttendanceState(map);
    } else {
      setAttendanceState({});
    }
  }, [subject, selectedClass]);

  const toggle = (id) => {
    setAttendanceState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = () => {
    const records = finalStudents.map(s => ({
      studentId: s._id,
      status: attendanceState[s._id] ? "present" : "absent"
    }));

    markAttendance({
      subject,
      class: selectedClass,
      date: today,
      teacherId: currentUser._id,
      createdAt: new Date(),
      records
    });
  };

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h2>Attendance</h2>
        <span>{today}</span>
      </div>

      {/* 🔥 FILTERS */}
      <div className={styles.filters}>

        {(role === "admin" || role === "hod") && (
          <select onChange={e => setDepartment(e.target.value)}>
            <option>Department</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        )}

        {(role === "admin") && (
          <select onChange={e => setCourse(e.target.value)}>
            <option>Course</option>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
        )}

        <select onChange={e => {
          setYear(e.target.value);
          setSemester("");
        }}>
          <option>Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <select onChange={e => setSemester(e.target.value)}>
          <option>Semester</option>
          {semesters.map(s => <option key={s}>{s}</option>)}
        </select>

        <select onChange={e => setSubject(e.target.value)}>
          <option>Subject</option>
          {availableSubjects.map(s => <option key={s}>{s}</option>)}
        </select>

        <select onChange={e => setSelectedClass(e.target.value)}>
          <option>Class</option>
          {availableClasses.map(c => <option key={c}>{c}</option>)}
        </select>

      </div>

      {/* TABLE */}
      <div className={styles.table}>
        {paginated.length === 0 && (
          <div className={styles.empty}>No students</div>
        )}

        {paginated.map(s => (
          <div key={s._id} className={styles.row}>
            <span>{s.rollNo}</span>
            <span>{s.name}</span>

            <div
              className={`${styles.box} ${
                attendanceState[s._id] ? styles.present : ""
              }`}
              onClick={() => toggle(s._id)}
            />
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
        <span>{page} / {totalPages || 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
      </div>

      {subject && selectedClass && (
        <button className={styles.submit} onClick={handleSubmit}>
          Submit
        </button>
      )}
    </div>
  );
}