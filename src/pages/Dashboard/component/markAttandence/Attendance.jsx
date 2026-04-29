// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../../../../context/authContext";
// import styles from "./attendance.module.css";

// import { getUsers } from "../../../../api/userAPI";
// import { getInstituteConfig } from "../../../../api/configApi";
// import { getAttendance, markAttendance } from "../../../../api/attandenceApi";
// import { getTeacherSubjectScopes, getId } from "../../utils/configRuntime";

// const getScopeKey = (scope) =>
//   [
//     scope.subjectId,
//     scope.classId || "",
//     scope.departmentId || "",
//     scope.courseId || "",
//     scope.semester || "",
//   ].join(":");

// export default function Attendance() {
//   const { user, token } = useAuth();

//   if (user?.role !== "teacher") {
//     return (
//       <div className={styles.center}>
//         Only assigned teachers can mark attendance
//       </div>
//     );
//   }

//   const today = new Date().toISOString().split("T")[0];

//   const [students, setStudents] = useState([]);
//   const [subjectScopes, setSubjectScopes] = useState([]);
//   const [selectedScopeKey, setSelectedScopeKey] = useState("");
//   const [allowedStudents, setAllowedStudents] = useState([]);
//   const [attendanceState, setAttendanceState] = useState({});
//   const [attendanceHistory, setAttendanceHistory] = useState([]);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const loadData = async () => {
//     setError("");
//     try {
//       const [users, config, history] = await Promise.all([
//         getUsers({ role: "student" }),
//         getInstituteConfig(),
//         getAttendance(),
//       ]);

//       const scopes = getTeacherSubjectScopes(config, user._id);
//       setStudents(Array.isArray(users) ? users : []);
//       setSubjectScopes(scopes);
//       setSelectedScopeKey(scopes[0] ? getScopeKey(scopes[0]) : "");
//       setAttendanceHistory(Array.isArray(history) ? history : []);
//     } catch (err) {
//       console.error("Attendance load error:", err.response?.data || err);
//       setError(err.response?.data?.msg || err.message || "Failed to load attendance data");
//     }
//   };

//   useEffect(() => {
//     if (!token || !user?._id) return;
//     loadData();
//   }, [token, user]);

//   const selectedScope = useMemo(
//     () => subjectScopes.find((scope) => getScopeKey(scope) === selectedScopeKey) || null,
//     [selectedScopeKey, subjectScopes]
//   );

//   useEffect(() => {
//     if (!selectedScope) {
//       setAllowedStudents([]);
//       return;
//     }

//     let filtered = students;

//     if (selectedScope.classId) {
//       filtered = students.filter(
//         (student) => getId(student.classId) === selectedScope.classId
//       );
//     } else {
//       filtered = students.filter(
//         (student) =>
//           getId(student.departmentId) === selectedScope.departmentId &&
//           getId(student.courseId) === selectedScope.courseId &&
//           Number(student.semester) === Number(selectedScope.semester)
//       );
//     }

//     setAllowedStudents(filtered);
//     setAttendanceState({});
//   }, [selectedScope, students]);

//   const toggle = (id) => {
//     setAttendanceState((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!selectedScope) return;

//     try {
//       setError("");

//       const payload = {
//         subject: selectedScope.subjectId,
//         students: allowedStudents.map((student) => ({
//           student: student._id,
//           status: attendanceState[student._id] ? "present" : "absent",
//         })),
//       };

//       if (selectedScope.classId) {
//         payload.classId = selectedScope.classId;
//         payload.section = user.section || "A";
//       } else {
//         payload.department = selectedScope.departmentId;
//         payload.course = selectedScope.courseId;
//         payload.semester = selectedScope.semester;
//       }

//       await markAttendance(payload);
//       setMessage("Attendance saved successfully");
//       await loadData();
//     } catch (err) {
//       console.error("Attendance save error:", err.response?.data || err);
//       setError(err.response?.data?.msg || err.message || "Error saving attendance");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h2>Attendance</h2>
//         <span>{today}</span>
//       </div>

//       {error ? <p>{error}</p> : null}
//       {message ? <p>{message}</p> : null}

//       <select value={selectedScopeKey} onChange={(e) => setSelectedScopeKey(e.target.value)}>
//         <option value="">Select Subject</option>
//         {subjectScopes.map((scope) => (
//           <option key={getScopeKey(scope)} value={getScopeKey(scope)}>
//             {scope.subject?.name}
//             {scope.className
//               ? ` - ${scope.className}`
//               : scope.courseName
//                 ? ` - ${scope.courseName} / Semester ${scope.semester}`
//                 : ""}
//           </option>
//         ))}
//       </select>

//       <div className={styles.table}>
//         {allowedStudents.map((student) => (
//           <div key={student._id} className={styles.row}>
//             <span>{student.rollNumber}</span>
//             <span>{student.name}</span>

//             <div
//               className={`${styles.box} ${
//                 attendanceState[student._id] ? styles.present : ""
//               }`}
//               onClick={() => toggle(student._id)}
//             />
//           </div>
//         ))}
//       </div>

//       {selectedScope && allowedStudents.length > 0 && (
//         <button className={styles.submit} onClick={handleSubmit}>
//           Save Attendance
//         </button>
//       )}

//       {attendanceHistory.length > 0 && (
//         <div className={styles.table}>
//           <h3>Attendance History</h3>
//           {attendanceHistory.map((entry) => {
//             const presentCount = (entry.students || []).filter((student) => student.status === "present").length;
//             const absentCount = (entry.students || []).filter((student) => student.status === "absent").length;
//             return (
//               <div key={entry._id} className={styles.row}>
//                 <span>{entry.subject?.name || "Subject"}</span>
//                 <span>{new Date(entry.date).toLocaleDateString()}</span>
//                 <span>P: {presentCount}</span>
//                 <span>A: {absentCount}</span>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

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

  const [students, setStudents] = useState([]);
  const [subjectScopes, setSubjectScopes] = useState([]);
  const [selectedScopeKey, setSelectedScopeKey] = useState("");
  const [allowedStudents, setAllowedStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🚀 LOAD DATA
  const loadData = async () => {
    setError("");
    try {
      const users = await getUsers({ role: "student" });
      const config = await getInstituteConfig();
      const history = await getAttendance();

      const scopes = getTeacherSubjectScopes(config, user._id);

      console.log("Scopes:", scopes);

      setStudents(Array.isArray(users) ? users : []);
      setSubjectScopes(scopes || []);
      setSelectedScopeKey(scopes[0] ? getScopeKey(scopes[0]) : "");
      setAttendanceHistory(Array.isArray(history) ? history : []);

      if (!scopes || scopes.length === 0) {
        setError("No subject assigned to this teacher");
      }

    } catch (err) {
      console.error("Load error:", err.response?.data || err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    if (!token || !user?._id) return;
    loadData();
  }, [token, user]);

  // 🎯 SELECTED SUBJECT
  const selectedScope = useMemo(
    () => subjectScopes.find((s) => getScopeKey(s) === selectedScopeKey) || null,
    [selectedScopeKey, subjectScopes]
  );

  // 🎯 FILTER STUDENTS
  useEffect(() => {
    if (!selectedScope) {
      setAllowedStudents([]);
      return;
    }

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
    setAttendanceState({});
  }, [selectedScope, students]);

  // 🎯 TOGGLE PRESENT/ABSENT
  const toggle = (id) => {
    setAttendanceState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ SUBMIT ATTENDANCE
  const handleSubmit = async () => {
    if (!selectedScope) {
      return setError("Please select subject");
    }

    if (allowedStudents.length === 0) {
      return setError("No students found");
    }

    try {
      setError("");
      setMessage("");

      const studentsPayload = allowedStudents.map((student) => ({
        student: student._id,
        status: attendanceState[student._id] ? "present" : "absent",
      }));

      const payload = {
        subject: selectedScope.subjectId,
        students: studentsPayload,
      };

      // 🔥 CLASS BASED
      if (selectedScope.classId) {
        payload.classId = selectedScope.classId;
        payload.section = user.section || "A";
      }
      // 🔥 COURSE BASED
      else {
        payload.department = selectedScope.departmentId;
        payload.course = selectedScope.courseId;
        payload.semester = selectedScope.semester;
      }

      console.log("Submitting:", payload);

      const res = await markAttendance(payload);

      if (res) {
        setMessage("✅ Attendance saved in DB");
        await loadData();
      } else {
        setError("Failed to save attendance");
      }

    } catch (err) {
      console.error("Save error:", err.response?.data || err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Attendance</h2>
        <span>{today}</span>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* SUBJECT SELECT */}
      <select
        value={selectedScopeKey}
        onChange={(e) => setSelectedScopeKey(e.target.value)}
      >
        <option value="">Select Subject</option>
        {subjectScopes.map((scope) => (
          <option key={getScopeKey(scope)} value={getScopeKey(scope)}>
            {scope.subject?.name}
          </option>
        ))}
      </select>

      {/* STUDENT LIST */}
      <div className={styles.table}>
        {allowedStudents.map((student) => (
          <div key={student._id} className={styles.row}>
            <span>{student.rollNumber}</span>
            <span>{student.name}</span>

            <div
              className={`${styles.box} ${
                attendanceState[student._id] ? styles.present : ""
              }`}
              onClick={() => toggle(student._id)}
            />
          </div>
        ))}
      </div>

      {/* SAVE BUTTON */}
      {selectedScope && allowedStudents.length > 0 && (
        <button className={styles.submit} onClick={handleSubmit}>
          Save Attendance
        </button>
      )}
    </div>
  );
}