import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import styles from "./attendance.module.css";

import { getUsers } from "../../../../api/userAPI";
import { getInstituteConfig } from "../../../../api/configApi";
import { getAttendance, markAttendance } from "../../../../api/attandenceApi";
import { getTeacherSubjectScopes, getId } from "../../utils/configRuntime";

const getScopeKey = (scope) =>
  [
    scope.subjectId,
    scope.classId || "",
    scope.departmentId || "",
    scope.courseId || "",
    scope.semester || "",
  ].join(":");

export default function Attendance() {
  const { user, token } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const role = user?.role;
  const isTeacher = role === "teacher";
  const isHod = role === "hod";
  const isAdmin = role === "admin";
  const isStudent = role === "student";

  const [config, setConfig] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [students, setStudents] = useState([]);
  const [subjectScopes, setSubjectScopes] = useState([]);
  const [selectedScopeKey, setSelectedScopeKey] = useState("");
  const [allowedStudents, setAllowedStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});

  const [selectedDate, setSelectedDate] = useState(today);

  const [filters, setFilters] = useState({
    department: "",
    course: "",
    semester: "",
    subject: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedScope = useMemo(() => {
    if (!isTeacher) return null;
    return subjectScopes.find((s) => getScopeKey(s) === selectedScopeKey);
  }, [selectedScopeKey, subjectScopes]);

  // ============================
  // LOAD DATA
  // ============================
  const loadData = async () => {
    try {
      setError("");

      const cfg = await getInstituteConfig();
      setConfig(cfg);

      if (isTeacher) {
        const users = await getUsers({ role: "student" });
        const scopes = getTeacherSubjectScopes(cfg, user._id);

        setStudents(users || []);
        setSubjectScopes(scopes || []);
        setSelectedScopeKey(scopes[0] ? getScopeKey(scopes[0]) : "");
      }

      const params = { date: selectedDate };

      if (isTeacher && selectedScope) {
        params.subject = selectedScope.subjectId;
        params.classId = selectedScope.classId;
        params.department = selectedScope.departmentId;
        params.course = selectedScope.courseId;
        params.semester = selectedScope.semester;
      }

      if (isHod) params.department = user.departmentId;

      if (filters.department) params.department = filters.department;
      if (filters.course) params.course = filters.course;
      if (filters.semester) params.semester = filters.semester;
      if (filters.subject) params.subject = filters.subject;

      const data = await getAttendance(params);

      const filtered = data.filter(
        (d) =>
          new Date(d.date).toISOString().split("T")[0] === selectedDate
      );

      setAttendanceHistory(filtered);

    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [selectedDate, selectedScopeKey, filters]);

  // ============================
  // CASCADE FILTER
  // ============================
  const departments = config?.departments || [];

  const selectedDept = departments.find(
    (d) => d.department?._id === filters.department
  );

  const courses = selectedDept?.courses || [];

  const selectedCourse = courses.find(
    (c) => c.course?._id === filters.course
  );

  const semesters = selectedCourse?.structure || [];

  const selectedSem = semesters.find(
    (s) => s.number === Number(filters.semester)
  );

  const subjects = selectedSem?.subjects || [];

  // ============================
  // STUDENT FILTER (TEACHER)
  // ============================
  useEffect(() => {
    if (!isTeacher || !selectedScope) return;

    let filtered = students;

    if (selectedScope.classId) {
      filtered = students.filter(
        (s) => getId(s.classId) === selectedScope.classId
      );
    } else {
      filtered = students.filter(
        (s) =>
          getId(s.departmentId) === selectedScope.departmentId &&
          getId(s.courseId) === selectedScope.courseId &&
          Number(s.semester) === Number(selectedScope.semester)
      );
    }

    setAllowedStudents(filtered);
  }, [selectedScope, students]);

  const toggle = (id) => {
    setAttendanceState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ============================
  // SAVE
  // ============================
  const handleSubmit = async () => {
    if (selectedDate !== today) {
      return setError("Only today's attendance allowed");
    }

    try {
      const payload = {
        subject: selectedScope.subjectId,
        students: allowedStudents.map((s) => ({
          student: s._id,
          status: attendanceState[s._id] ? "present" : "absent",
        })),
      };

      if (selectedScope.classId) {
        payload.classId = selectedScope.classId;
        payload.section = user.section || "A";
      } else {
        payload.department = selectedScope.departmentId;
        payload.course = selectedScope.courseId;
        payload.semester = selectedScope.semester;
      }

      await markAttendance(payload);

      setMessage("Attendance saved");
      loadData();

    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    }
  };

  // ============================
  // UI
  // ============================
  return (
    <div className={styles.container}>
      <h2>Attendance</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* FILTERS */}
      {(isAdmin || isHod) && (
        <div className={styles.filters}>
          <select
            value={filters.department}
            onChange={(e) =>
              setFilters({
                department: e.target.value,
                course: "",
                semester: "",
                subject: "",
              })
            }
          >
            <option value="">Department</option>
            {departments.map((d) => (
              <option key={d.department._id} value={d.department._id}>
                {d.department.name}
              </option>
            ))}
          </select>

          <select
            value={filters.course}
            onChange={(e) =>
              setFilters({
                ...filters,
                course: e.target.value,
                semester: "",
                subject: "",
              })
            }
            disabled={!filters.department}
          >
            <option value="">Course</option>
            {courses.map((c) => (
              <option key={c.course._id} value={c.course._id}>
                {c.course.name}
              </option>
            ))}
          </select>

          <select
            value={filters.semester}
            onChange={(e) =>
              setFilters({
                ...filters,
                semester: e.target.value,
                subject: "",
              })
            }
            disabled={!filters.course}
          >
            <option value="">Semester</option>
            {semesters.map((s) => (
              <option key={s.number} value={s.number}>
                Semester {s.number}
              </option>
            ))}
          </select>

          <select
            value={filters.subject}
            onChange={(e) =>
              setFilters({
                ...filters,
                subject: e.target.value,
              })
            }
            disabled={!filters.semester}
          >
            <option value="">Subject</option>
            {subjects.map((s) => (
              <option key={s.subject._id} value={s.subject._id}>
                {s.subject.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TEACHER */}
      {isTeacher && (
        <>
          <select
            value={selectedScopeKey}
            onChange={(e) => setSelectedScopeKey(e.target.value)}
          >
            {subjectScopes.map((s) => (
              <option key={getScopeKey(s)} value={getScopeKey(s)}>
                {s.subject?.name}
              </option>
            ))}
          </select>

          <div className={styles.table}>
            {allowedStudents.map((s) => (
              <div key={s._id} className={styles.row}>
                <span>{s.rollNumber}</span>
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

          {selectedDate === today && (
            <button onClick={handleSubmit}>Save Attendance</button>
          )}
        </>
      )}

      {/* HISTORY */}
      <h3>Attendance Records</h3>

      {attendanceHistory.length === 0 && <p>No data</p>}

      {attendanceHistory.map((r) => {
        const visibleStudents = isStudent
          ? r.students.filter((s) => s.student._id === user._id)
          : r.students;

        return (
          <div key={r._id} className={styles.card}>
            <h4>{r.subject?.name}</h4>

            {visibleStudents.map((s) => (
              <div key={s._id} className={styles.row}>
                <span>{s.student.rollNumber}</span>
                <span>{s.student.name}</span>
                <span>{s.status}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}