
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

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
      teacherName: s.teacher?.name,   
    }));
  }, [config, meta]);

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

          {}
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
                      <select value={cell.teacher || ""} disabled>
                        <option value="">Teacher</option>
                        {subjects
                          .filter((s) => s.subjectId === cell.subject)  
                          .map((s) => (
                            <option key={s.teacherId} value={s.teacherId}>
                              {s.teacherName}   
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

      {}
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
