// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../../../../context/authContext";
// import styles from "./timetable.module.css";

// import {
//   deleteTimetable,
//   getTimetables,
//   saveTimetable,
// } from "../../../../api/timetableApi";
// import { getInstituteConfig } from "../../../../api/configApi";
// import { getMyInstitute } from "../../../../api/instituteApi";
// import {
//   getConfigClasses,
//   getConfigDepartments,
//   getDepartmentCourseOptions,
//   getId,
//   getScopedSubjects,
//   getStructureOptions,
// } from "../../utils/configRuntime";

// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const timeSlots = [
//   "9:00-10:00",
//   "10:00-11:00",
//   "11:00-12:00",
//   "12:00-1:00",
//   "2:00-3:00",
//   "3:00-4:00",
// ];

// function TimetablePage() {
//   const { user, token } = useAuth();
//   const role = user?.role?.toLowerCase();

//   const [allTables, setAllTables] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [config, setConfig] = useState(null);
//   const [institute, setInstitute] = useState(null);
//   const [error, setError] = useState("");

//   const [meta, setMeta] = useState({
//     type: "",
//     department: "",
//     course: "",
//     semester: "",
//     year: "",
//     className: "",
//   });

//   const [grid, setGrid] = useState({});
//   const [originalGrid, setOriginalGrid] = useState({});

//   useEffect(() => {
//     if (!token || !user?._id) return;

//     const load = async () => {
//       setError("");

//       try {
//         const [inst, configData] = await Promise.all([
//           getMyInstitute(),
//           getInstituteConfig(),
//         ]);

//         setInstitute(inst);
//         setConfig(configData);
//         setMeta((prev) => ({
//           ...prev,
//           type: inst?.type || "",
//           department:
//             role === "hod" ? getId(user?.departmentId) : prev.department,
//         }));
//       } catch (err) {
//         console.error("Timetable setup error:", err.response?.data || err);
//         setError(err.response?.data?.msg || err.message || "Failed to load timetable setup");
//       }
//     };

//     load();
//   }, [role, token, user]);

//   const fetchTables = async () => {
//     try {
//       const data = await getTimetables();

//       const formatted = (Array.isArray(data) ? data : []).map((table) => {
//         const newGrid = {};

//         Object.keys(table.grid || {}).forEach((key) => {
//           const value = table.grid[key];
//           newGrid[key] = value
//             ? {
//                 subject: value.subject?._id,
//                 teacher: value.teacher?._id,
//                 label: `${value.subject?.name || "Subject"} / ${value.teacher?.name || "Teacher"}`,
//               }
//             : null;
//         });

//         return {
//           _id: table._id,
//           meta: {
//             type: table.type,
//             department: table.department?._id || "",
//             departmentName: table.department?.name || "",
//             course: table.course?._id || "",
//             courseName: table.course?.name || "",
//             semester: table.semester || "",
//             year: table.year || "",
//             className: table.class?._id || "",
//             classLabel: table.class?.name || "",
//           },
//           grid: newGrid,
//         };
//       });

//       setAllTables(formatted);
//     } catch (err) {
//       console.error("Timetable fetch error:", err.response?.data || err);
//       setError(err.response?.data?.msg || err.message || "Failed to load timetables");
//     }
//   };

//   useEffect(() => {
//     if (!token || !user?._id) return;
//     fetchTables();
//   }, [token, user?._id]);

//   const departmentOptions = useMemo(() => {
//     const departments = getConfigDepartments(config);
//     if (role !== "hod") return departments;
//     return departments.filter((entry) => idsEqual(entry?.department, user?.departmentId));
//   }, [config, role, user?.departmentId]);

//   const courseOptions = useMemo(
//     () => getDepartmentCourseOptions(config, meta.department),
//     [config, meta.department]
//   );

//   const semesterOptions = useMemo(
//     () => getStructureOptions(config, meta.department, meta.course),
//     [config, meta.department, meta.course]
//   );

//   const classOptions = useMemo(() => getConfigClasses(config), [config]);

//   const availableSubjectScopes = useMemo(() => {
//     if (meta.type === "school") {
//       return getScopedSubjects(config, { classId: meta.className });
//     }

//     return getScopedSubjects(config, {
//       departmentId: meta.department,
//       courseId: meta.course,
//       semester: meta.semester,
//     });
//   }, [config, meta]);

//   const subjectMap = useMemo(
//     () =>
//       availableSubjectScopes.reduce((map, scope) => {
//         map[scope.subjectId] = scope;
//         return map;
//       }, {}),
//     [availableSubjectScopes]
//   );

//   const setMetaField = (field, value) => {
//     setMeta((prev) => {
//       const next = { ...prev, [field]: value };

//       if (field === "department") {
//         next.course = "";
//         next.semester = "";
//       }

//       if (field === "course") {
//         next.semester = "";
//       }

//       if (field === "type") {
//         next.department = role === "hod" ? getId(user?.departmentId) : "";
//         next.course = "";
//         next.semester = "";
//         next.className = "";
//       }

//       if (field === "className") {
//         next.department = role === "hod" ? getId(user?.departmentId) : next.department;
//         next.course = "";
//         next.semester = "";
//       }

//       return next;
//     });

//     setGrid({});
//     setOriginalGrid({});
//   };

//   const handleCellChange = (day, time, field, value) => {
//     const key = `${day}_${time}`;

//     setGrid((prev) => {
//       const current = prev[key] || {};

//       if (field === "subject") {
//         const selectedScope = subjectMap[value];
//         return {
//           ...prev,
//           [key]: {
//             subject: value,
//             teacher: selectedScope?.teacherId || "",
//           },
//         };
//       }

//       return {
//         ...prev,
//         [key]: {
//           ...current,
//           [field]: value,
//         },
//       };
//     });
//   };

//   const handleEdit = (table) => {
//     setShowForm(true);
//     setEditMode(true);
//     setMeta({
//       type: table.meta.type,
//       department: table.meta.department || "",
//       course: table.meta.course || "",
//       semester: table.meta.semester || "",
//       year: table.meta.year || "",
//       className: table.meta.className || "",
//     });
//     setGrid(table.grid);
//     setOriginalGrid(table.grid);
//   };

//   const handleDelete = async (table) => {
//     if (!window.confirm("Delete this timetable?")) return;

//     try {
//       await deleteTimetable(table._id);
//       await fetchTables();
//     } catch (err) {
//       console.error("Timetable delete error:", err.response?.data || err);
//       setError(err.response?.data?.msg || err.message || "Delete failed");
//     }
//   };

//   const checkConflict = (candidateGrid) => {
//     const slotMap = {};

//     for (const key of Object.keys(candidateGrid)) {
//       const teacher = candidateGrid[key]?.teacher;
//       if (!teacher) continue;

//       if (!slotMap[key]) slotMap[key] = new Set();
//       if (slotMap[key].has(teacher)) return true;
//       slotMap[key].add(teacher);
//     }

//     return false;
//   };

//   const checkDuplicate = () =>
//     allTables.some((table) => {
//       if (meta.type === "college") {
//         return (
//           table.meta.department === meta.department &&
//           table.meta.course === meta.course &&
//           String(table.meta.semester) === String(meta.semester)
//         );
//       }

//       return table.meta.className === meta.className;
//     });

//   const handleSave = async () => {
//     const formattedGrid = {};
//     let hasData = false;

//     for (const key of Object.keys(grid)) {
//       const cell = grid[key];
//       if (!cell) continue;

//       const hasSubject = !!cell.subject;
//       const hasTeacher = !!cell.teacher;

//       if ((hasSubject && !hasTeacher) || (!hasSubject && hasTeacher)) {
//         setError(`Invalid cell at ${key}`);
//         return;
//       }

//       if (!hasSubject && !hasTeacher) continue;

//       hasData = true;
//       formattedGrid[key] = {
//         subject: cell.subject,
//         teacher: cell.teacher,
//       };
//     }

//     if (!hasData) {
//       setError("Empty timetable not allowed");
//       return;
//     }

//     if (!editMode && checkDuplicate()) {
//       setError("Duplicate timetable exists");
//       return;
//     }

//     if (checkConflict(formattedGrid)) {
//       setError("Teacher conflict detected");
//       return;
//     }

//     const payload = {
//       type: meta.type,
//       grid: formattedGrid,
//     };

//     if (meta.type === "school") {
//       if (meta.className) payload.classId = meta.className;
//     } else {
//       if (meta.department) payload.department = meta.department;
//       if (meta.course) payload.course = meta.course;
//       if (meta.semester) payload.semester = Number(meta.semester);
//       if (meta.year) payload.year = Number(meta.year);
//     }

//     try {
//       setError("");
//       await saveTimetable(payload);
//       setShowForm(false);
//       setEditMode(false);
//       setGrid({});
//       setOriginalGrid({});
//       await fetchTables();
//     } catch (err) {
//       console.error("Timetable save error:", err.response?.data || err);
//       setError(err.response?.data?.msg || err.message || "Save failed");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {(role === "admin" || role === "hod") && (
//         <button
//           onClick={() => {
//             setShowForm(!showForm);
//             setEditMode(false);
//             setGrid({});
//             setOriginalGrid({});
//             setError("");
//           }}
//         >
//           {showForm ? "Close" : "+ Create Timetable"}
//         </button>
//       )}

//       {error ? <p>{error}</p> : null}

//       {showForm && (
//         <div className={styles.createBox}>
//           <h3>{editMode ? "Edit Timetable" : "Create Timetable"}</h3>

//           {meta.type === "college" && (
//             <>
//               <select
//                 value={meta.department}
//                 onChange={(e) => setMetaField("department", e.target.value)}
//                 disabled={role === "hod"}
//               >
//                 <option value="">Department</option>
//                 {departmentOptions.map((departmentEntry) => (
//                   <option
//                     key={getId(departmentEntry?.department)}
//                     value={getId(departmentEntry?.department)}
//                   >
//                     {departmentEntry?.department?.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={meta.course}
//                 onChange={(e) => setMetaField("course", e.target.value)}
//                 disabled={!meta.department}
//               >
//                 <option value="">Course</option>
//                 {courseOptions.map((courseEntry) => (
//                   <option key={getId(courseEntry?.course)} value={getId(courseEntry?.course)}>
//                     {courseEntry?.course?.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={meta.semester}
//                 onChange={(e) => setMetaField("semester", e.target.value)}
//                 disabled={!meta.course}
//               >
//                 <option value="">Semester</option>
//                 {semesterOptions.map((semesterEntry) => (
//                   <option key={semesterEntry.number} value={semesterEntry.number}>
//                     {semesterEntry.label}
//                   </option>
//                 ))}
//               </select>
//             </>
//           )}

//           {meta.type === "school" && (
//             <select
//               value={meta.className}
//               onChange={(e) => setMetaField("className", e.target.value)}
//             >
//               <option value="">Class</option>
//               {classOptions.map((classEntry) => (
//                 <option key={getId(classEntry?.class)} value={getId(classEntry?.class)}>
//                   {classEntry?.class?.name}
//                 </option>
//               ))}
//             </select>
//           )}

//           <div className={styles.grid}>
//             <div></div>
//             {days.map((day) => <div key={day}>{day}</div>)}

//             {timeSlots.map((time) => (
//               <div key={time} style={{ display: "contents" }}>
//                 <div>{time}</div>

//                 {days.map((day) => {
//                   const key = `${day}_${time}`;
//                   const cell = grid[key] || {};
//                   const original = originalGrid[key];
//                   const teacherOptions = cell.subject && subjectMap[cell.subject]?.teacher
//                     ? [subjectMap[cell.subject]]
//                     : [];

//                   const isEdited =
//                     original &&
//                     (original.subject !== cell.subject ||
//                       original.teacher !== cell.teacher);

//                   return (
//                     <div
//                       key={key}
//                       className={`${styles.cellBox} ${isEdited ? styles.editedCell : ""}`}
//                     >
//                       <select
//                         value={cell.subject || ""}
//                         onChange={(e) => handleCellChange(day, time, "subject", e.target.value)}
//                       >
//                         <option value="">Subject</option>
//                         {availableSubjectScopes.map((scope) => (
//                           <option key={scope.subjectId} value={scope.subjectId}>
//                             {scope.subject?.name}
//                           </option>
//                         ))}
//                       </select>

//                       <select
//                         value={cell.teacher || ""}
//                         onChange={(e) => handleCellChange(day, time, "teacher", e.target.value)}
//                         disabled
//                       >
//                         <option value="">Teacher</option>
//                         {teacherOptions.map((scope) => (
//                           <option key={scope.teacherId} value={scope.teacherId}>
//                             {scope.teacher?.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>

//           <button onClick={handleSave}>Save</button>
//         </div>
//       )}

//       {allTables.map((table) => (
//         <div key={table._id} className={styles.tableBox}>
//           <div className={styles.heading}>
//             {table.meta.type === "college"
//               ? `${table.meta.departmentName} | ${table.meta.courseName} | Sem ${table.meta.semester}`
//               : `Class ${table.meta.classLabel}`}
//           </div>

//           {(role === "admin" || role === "hod") && (
//             <>
//               <button onClick={() => handleEdit(table)}>Edit</button>
//               <button onClick={() => handleDelete(table)}>Delete</button>
//             </>
//           )}

//           <div className={styles.grid}>
//             <div></div>
//             {days.map((day) => <div key={day}>{day}</div>)}

//             {timeSlots.map((time) => (
//               <div key={time} style={{ display: "contents" }}>
//                 <div>{time}</div>
//                 {days.map((day) => {
//                   const value = table.grid[`${day}_${time}`];
//                   return <div key={day + time}>{value?.label || "-"}</div>;
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function idsEqual(left, right) {
//   return getId(left) && getId(left) === getId(right);
// }

// export default TimetablePage;

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import styles from "./timetable.module.css";

import {
  deleteTimetable,
  getTimetables,
  saveTimetable,
} from "../../../../api/timetableApi";

import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";

import {
  getConfigClasses,
  getConfigDepartments,
  getDepartmentCourseOptions,
  getId,
  getScopedSubjects,
  getStructureOptions,
} from "../../utils/configRuntime";

/* ================= CONSTANTS ================= */

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const timeSlots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-1:00",
  "2:00-3:00",
  "3:00-4:00",
];

function TimetablePage() {
  const { user, token } = useAuth();
  const role = user?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const isHod = role === "hod";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const canEdit = isAdmin || isHod;

  const [allTables, setAllTables] = useState([]);
  const [config, setConfig] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  const [meta, setMeta] = useState({
    type: "",
    department: "",
    course: "",
    semester: "",
    className: "",
  });

  const [grid, setGrid] = useState({});
  const [originalGrid, setOriginalGrid] = useState({});

  /* ================= LOAD ================= */

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const [inst, configData] = await Promise.all([
          getMyInstitute(),
          getInstituteConfig(),
        ]);

        setConfig(configData);

        setMeta({
          type: inst?.type,
          department: isHod ? getId(user?.departmentId) : "",
          course: "",
          semester: "",
          className: "",
        });

      } catch {
        setError("Setup failed");
      }
    };

    load();
  }, [token]);

  /* ================= FETCH ================= */

  const fetchTables = async () => {
    try {
      const data = await getTimetables();

      const formatted = (Array.isArray(data) ? data : []).map((table) => {
        const newGrid = {};

        Object.keys(table.grid || {}).forEach((key) => {
          const value = table.grid[key];
          newGrid[key] = value
            ? {
                subject: getId(value.subject),
                teacher: getId(value.teacher),
                label: `${value.subject?.name || "Subject"} / ${value.teacher?.name || "Teacher"}`,
              }
            : null;
        });

        return {
          _id: table._id,
          meta: {
            department: table.department?._id,
            course: table.course?._id,
            semester: table.semester,
            departmentName: table.department?.name,
            courseName: table.course?.name,
          },
          grid: newGrid,
        };
      });

      /* ================= ROLE FILTER ================= */

      let filtered = formatted;

      if (isHod) {
        filtered = filtered.filter(
          (t) => getId(t.meta.department) === getId(user.departmentId)
        );
      }

      if (isTeacher) {
        const currentTeacherId = getId(user?._id || user?.id || user);
        filtered = filtered.filter((t) =>
          Object.values(t.grid).some(
            (c) => c?.teacher && getId(c.teacher) === currentTeacherId
          )
        );
      }

      if (isStudent) {
        filtered = filtered.filter(
          (t) =>
            getId(t.meta.department) === getId(user.departmentId) &&
            getId(t.meta.course) === getId(user.courseId) &&
            String(t.meta.semester) === String(user.semester)
        );
      }

      setAllTables(filtered);

    } catch {
      setError("Failed to load timetables");
    }
  };

  useEffect(() => {
    fetchTables();
  }, [token]);

  /* ================= OPTIONS ================= */

  const departments = useMemo(
    () => getConfigDepartments(config),
    [config]
  );

  const courses = useMemo(
    () => getDepartmentCourseOptions(config, meta.department),
    [config, meta.department]
  );

  const semesters = useMemo(
    () => getStructureOptions(config, meta.department, meta.course),
    [config, meta.department, meta.course]
  );

  const subjects = useMemo(() => {
    const scopes = getScopedSubjects(config, {
      departmentId: meta.department,
      courseId: meta.course,
      semester: meta.semester,
    });

    return scopes.map((s) => ({
      subjectId: getId(s.subject),
      teacherId: getId(s.teacher),
      subjectName: s.subject?.name,
    }));
  }, [config, meta]);

  /* ================= HANDLER ================= */

  const handleCellChange = (day, time, subjectId) => {
    const key = `${day}_${time}`;
    const scope = subjects.find((s) => s.subjectId === subjectId);

    setGrid((prev) => ({
      ...prev,
      [key]: {
        subject: subjectId,
        teacher: scope?.teacherId,
      },
    }));
  };

  const handleSave = async () => {
    if (!canEdit) return;
    const formatted = {};

    Object.keys(grid).forEach((key) => {
      const c = grid[key];
      if (c?.subject && c?.teacher) formatted[key] = c;
    });

    await saveTimetable({
      ...meta,
      grid: formatted,
    });

    setShowForm(false);
    setGrid({});
    fetchTables();
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;
    await deleteTimetable(id);
    fetchTables();
  };

  /* ================= UI ================= */

  return (
    <div className={styles.container}>

      {canEdit && (
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "+ Create"}
        </button>
      )}

      {error && <p>{error}</p>}

      {canEdit && showForm && (
        <div className={styles.createBox}>

          <select
            value={meta.department}
            disabled={isHod}
            onChange={(e) =>
              setMeta({ ...meta, department: e.target.value })
            }
          >
            <option value="">Department</option>
            {departments.map((d) => (
              <option key={getId(d.department)} value={getId(d.department)}>
                {d.department?.name}
              </option>
            ))}
          </select>

          <select
            value={meta.course}
            onChange={(e) =>
              setMeta({ ...meta, course: e.target.value })
            }
          >
            <option value="">Course</option>
            {courses.map((c) => (
              <option key={getId(c.course)} value={getId(c.course)}>
                {c.course?.name}
              </option>
            ))}
          </select>

          <select
            value={meta.semester}
            onChange={(e) =>
              setMeta({ ...meta, semester: e.target.value })
            }
          >
            <option value="">Semester</option>
            {semesters.map((s) => (
              <option key={s.number} value={s.number}>
                {s.label}
              </option>
            ))}
          </select>

          {/* GRID */}
          <div className={styles.grid}>
            <div></div>
            {days.map((d) => <div key={d}>{d}</div>)}

            {timeSlots.map((time) => (
              <div key={time} style={{ display: "contents" }}>
                <div>{time}</div>

                {days.map((day) => {
                  const key = `${day}_${time}`;
                  const cell = grid[key] || {};

                  return (
                    <div key={key}>
                      <select
                        value={cell.subject || ""}
                        onChange={(e) =>
                          handleCellChange(day, time, e.target.value)
                        }
                      >
                        <option value="">Subject</option>
                        {subjects.map((s) => (
                          <option key={s.subjectId} value={s.subjectId}>
                            {s.subjectName}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <button onClick={handleSave}>Save</button>
        </div>
      )}

      {/* DISPLAY */}
      {allTables.map((t) => (
        <div key={t._id} className={styles.tableBox}>

          <h3>
            {t.meta.departmentName} | {t.meta.courseName} | Sem {t.meta.semester}
          </h3>

          {canEdit && (
            <button onClick={() => handleDelete(t._id)}>Delete</button>
          )}

          <div className={styles.grid}>
            <div></div>
            {days.map((d) => <div key={d}>{d}</div>)}

            {timeSlots.map((time) => (
              <div key={time} style={{ display: "contents" }}>
                <div>{time}</div>

                {days.map((day) => {
                  const cell = t.grid[`${day}_${time}`];
                  return (
                    <div key={day + time}>
                      {cell ? cell.label : "-"}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}

export default TimetablePage;
