import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import styles from "./timetable.module.css";

import {
  deleteTimetable,
  getTimetables,
  saveTimetable,
} from "../../../../api/timetableApi";

import {
  getInstituteConfig,
} from "../../../../api/configApi";

import {
  getMyInstitute,
} from "../../../../api/instituteApi";

import {
  getConfigDepartments,
  getDepartmentCourseOptions,
  getId,
  getScopedSubjects,
  getStructureOptions,
} from "../../utils/configRuntime";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeSlots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-1:00",
  "2:00-3:00",
  "3:00-4:00",
];

function TimetablePage() {

  const { user, token } =
    useAuth();

  const role =
    user?.role?.toLowerCase();

  const isAdmin =
    role === "admin";

  const isHod =
    role === "hod";

  const isTeacher =
    role === "teacher";

  const isStudent =
    role === "student";

  const canEdit =
    isAdmin || isHod;

  const [allTables, setAllTables] =
    useState([]);

  const [config, setConfig] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [meta, setMeta] =
    useState({
      type: "",
      department: "",
      course: "",
      semester: "",
    });

  const [grid, setGrid] =
    useState({});

  /* LOAD CONFIG */

  useEffect(() => {

    if (!token)
      return;

    const load = async () => {

      try {

        const [
          institute,
          configData,
        ] = await Promise.all([
          getMyInstitute(),
          getInstituteConfig(),
        ]);

        setConfig(configData);

        setMeta({
          type:
            institute?.type || "",

          department:
            isHod
              ? String(
                  getId(
                    user?.departmentId
                  ) || ""
                )
              : "",

          course: "",
          semester: "",
        });

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load setup"
        );
      }
    };

    load();

  }, [token]);

  /* FETCH TIMETABLES */

  const fetchTables =
    async () => {

      try {

        const data =
          await getTimetables();

        const formatted =
          (
            Array.isArray(data)
              ? data
              : []
          ).map((table) => {

            const newGrid = {};

            Object.keys(
              table.grid || {}
            ).forEach((key) => {

              const value =
                table.grid[key];

              newGrid[key] =
                value
                  ? {

                      subject:
                        String(
                          getId(
                            value.subject
                          ) || ""
                        ),

                      teacher:
                        String(
                          getId(
                            value.teacher
                          ) || ""
                        ),

                      subjectName:
                        value.subject?.name ||
                        value.subjectName ||
                        "Subject",

                      teacherName:
                        value.teacher?.name ||
                        value.teacherName ||
                        "Teacher",

                    }
                  : null;
            });

            return {

              _id:
                table._id,

              meta: {

                department:
                  String(
                    getId(
                      table.department
                    ) || ""
                  ),

                course:
                  String(
                    getId(
                      table.course
                    ) || ""
                  ),

                semester:
                  String(
                    table.semester || ""
                  ),

                departmentName:
                  table.department?.name ||
                  "Department",

                courseName:
                  table.course?.name ||
                  "Course",

              },

              grid:
                newGrid,

            };
          });

        let filtered =
          formatted;

        /* ADMIN */

        if (isAdmin) {

          filtered =
            formatted;
        }

        /* HOD */

        else if (isHod) {

          const hodDepartment =
            String(
              getId(
                user?.departmentId
              ) || ""
            );

          filtered =
            formatted.filter(
              (table) =>

                String(
                  table.meta.department
                ) ===
                hodDepartment
            );
        }

        /* TEACHER */

        else if (isTeacher) {

          const teacherIds = [

            String(
              getId(user?._id)
            ),

            String(
              getId(
                user?.teacherId
              )
            ),

            String(
              getId(
                user?.profileId
              )
            ),

          ].filter(Boolean);

          const teacherSubjects =
            getScopedSubjects(
              config,
              {}
            )
              .filter((scope) => {

                const scopeTeacherId =
                  String(
                    getId(
                      scope.teacher
                    ) || ""
                  );

                return teacherIds.includes(
                  scopeTeacherId
                );
              })
              .map((scope) =>
                String(
                  getId(
                    scope.subject
                  ) || ""
                )
              );

          filtered =
            formatted.filter(
              (table) =>

                Object.values(
                  table.grid || {}
                ).some((cell) => {

                  if (!cell)
                    return false;

                  return teacherSubjects.includes(
                    String(
                      cell.subject
                    )
                  );
                })
            );
        }

        /* STUDENT */

        else if (isStudent) {

          const departmentId =
            String(
              getId(
                user?.departmentId
              ) || ""
            );

          const courseId =
            String(
              getId(
                user?.courseId
              ) || ""
            );

          const semester =
            String(
              user?.semester || ""
            );

          filtered =
            formatted.filter(
              (table) =>

                String(
                  table.meta.department
                ) ===
                  departmentId &&

                String(
                  table.meta.course
                ) ===
                  courseId &&

                String(
                  table.meta.semester
                ) ===
                  semester
            );
        }

        setAllTables(
          filtered
        );

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load timetable"
        );
      }
    };

  useEffect(() => {

    if (config) {
      fetchTables();
    }

  }, [config]);

  /* OPTIONS */

  const departments =
    useMemo(
      () =>
        getConfigDepartments(
          config
        ),
      [config]
    );

  const courses =
    useMemo(
      () =>
        getDepartmentCourseOptions(
          config,
          meta.department
        ),
      [
        config,
        meta.department,
      ]
    );

  const semesters =
    useMemo(
      () =>
        getStructureOptions(
          config,
          meta.department,
          meta.course
        ),
      [
        config,
        meta.department,
        meta.course,
      ]
    );

  const subjects =
    useMemo(() => {

      const scopes =
        getScopedSubjects(
          config,
          {
            departmentId:
              meta.department,

            courseId:
              meta.course,

            semester:
              meta.semester,
          }
        );

      return scopes.map(
        (s) => ({

          subjectId:
            String(
              getId(
                s.subject
              ) || ""
            ),

          teacherId:
            String(
              getId(
                s.teacher
              ) || ""
            ),

          subjectName:
            s.subject?.name ||
            "Subject",

          teacherName:
            s.teacher?.name ||
            "Teacher",

        })
      );

    }, [config, meta]);

  /* TEACHER CONFLICT */

  const isTeacherBusy =
    (
      teacherId,
      currentKey
    ) => {

      const currentBusy =
        Object.entries(grid).some(
          ([key, value]) =>

            key !== currentKey &&

            String(
              value?.teacher
            ) ===
            String(
              teacherId
            )
        );

      if (currentBusy)
        return true;

      const busyInOtherTables =
        allTables.some((table) => {

          if (
            editingId &&
            table._id === editingId
          ) {
            return false;
          }

          const cell =
            table.grid?.[
              currentKey
            ];

          if (!cell)
            return false;

          return (
            String(
              cell.teacher
            ) ===
            String(
              teacherId
            )
          );
        });

      return busyInOtherTables;
    };

  /* CELL CHANGE */

  const handleCellChange =
    (
      day,
      time,
      subjectId
    ) => {

      const key =
        `${day}_${time}`;

      if (!subjectId) {

        setGrid((prev) => ({

          ...prev,

          [key]: null,

        }));

        return;
      }

      const scope =
        subjects.find(
          (s) =>
            s.subjectId ===
            subjectId
        );

      if (!scope)
        return;

      if (
        scope.teacherId &&
        isTeacherBusy(
          scope.teacherId,
          key
        )
      ) {

        alert(
          `${scope.teacherName} is already assigned during ${day} ${time}`
        );

        return;
      }

      setGrid((prev) => ({

        ...prev,

        [key]: {

          subject:
            scope.subjectId,

          teacher:
            scope.teacherId,

          subjectName:
            scope.subjectName,

          teacherName:
            scope.teacherName,

        },

      }));
    };

  /* EDIT */

  const handleEdit =
    (table) => {

      if (!canEdit)
        return;

      setEditingId(
        table._id
      );

      setMeta({

        ...meta,

        department:
          table.meta.department,

        course:
          table.meta.course,

        semester:
          table.meta.semester,

      });

      setGrid(
        table.grid
      );

      setShowForm(true);
    };

  /* SAVE */

  const handleSave =
    async () => {

      if (!canEdit)
        return;

      try {

        setSaving(true);

        const formatted =
          {};

        Object.keys(grid)
          .forEach((key) => {

            const cell =
              grid[key];

            if (
              cell?.subject &&
              cell?.teacher
            ) {

              formatted[key] = {

                subject:
                  cell.subject,

                teacher:
                  cell.teacher,

              };
            }
          });

        await saveTimetable({

          _id:
            editingId,

          ...meta,

          grid:
            formatted,

        });

        setShowForm(false);

        setEditingId(null);

        setGrid({});

        fetchTables();

      } catch (err) {

        console.error(err);

        alert(
          "Failed to save timetable"
        );

      } finally {

        setSaving(false);
      }
    };

  /* DELETE */

  const handleDelete =
    async (id) => {

      if (!canEdit)
        return;

      try {

        await deleteTimetable(
          id
        );

        fetchTables();

      } catch (err) {

        console.error(err);
      }
    };

  return (

    <div className={styles.container}>

      {canEdit && (

        <button
          className={
            styles.createBtn
          }
          onClick={() =>
            setShowForm(
              !showForm
            )
          }
        >

          {showForm
            ? "Close"
            : "+ Create Timetable"}

        </button>

      )}

      {error && (
        <p>{error}</p>
      )}

      {/* FORM */}

      {canEdit &&
        showForm && (

        <div
          className={
            styles.createBox
          }
        >

          <select
            value={
              meta.department
            }
            disabled={isHod}
            onChange={(e) =>
              setMeta({
                ...meta,
                department:
                  e.target.value,
              })
            }
          >

            <option value="">
              Department
            </option>

            {departments.map(
              (d) => (

                <option
                  key={getId(
                    d.department
                  )}
                  value={getId(
                    d.department
                  )}
                >

                  {
                    d.department?.name
                  }

                </option>

              )
            )}

          </select>

          <select
            value={
              meta.course
            }
            onChange={(e) =>
              setMeta({
                ...meta,
                course:
                  e.target.value,
              })
            }
          >

            <option value="">
              Course
            </option>

            {courses.map(
              (c) => (

                <option
                  key={getId(
                    c.course
                  )}
                  value={getId(
                    c.course
                  )}
                >

                  {
                    c.course?.name
                  }

                </option>

              )
            )}

          </select>

          <select
            value={
              meta.semester
            }
            onChange={(e) =>
              setMeta({
                ...meta,
                semester:
                  e.target.value,
              })
            }
          >

            <option value="">
              Semester
            </option>

            {semesters.map(
              (s) => (

                <option
                  key={s.number}
                  value={s.number}
                >

                  {s.label}

                </option>

              )
            )}

          </select>

          <div
            className={
              styles.grid
            }
          >

            <div></div>

            {days.map((day) => (

              <div
                key={day}
                className={
                  styles.header
                }
              >

                {day}

              </div>

            ))}

            {timeSlots.map(
              (time) => (

                <div
                  key={time}
                  style={{
                    display:
                      "contents",
                  }}
                >

                  <div
                    className={
                      styles.time
                    }
                  >
                    {time}
                  </div>

                  {days.map(
                    (day) => {

                      const key =
                        `${day}_${time}`;

                      const cell =
                        grid[key] ||
                        {};

                      return (

                        <div
                          key={key}
                          className={
                            styles.cell
                          }
                        >

                          <select
                            value={
                              cell.subject ||
                              ""
                            }
                            onChange={(e) =>
                              handleCellChange(
                                day,
                                time,
                                e.target.value
                              )
                            }
                          >

                            <option value="">
                              Subject
                            </option>

                            {subjects.map(
                              (s) => (

                                <option
                                  key={
                                    s.subjectId
                                  }
                                  value={
                                    s.subjectId
                                  }
                                >

                                  {
                                    s.subjectName
                                  }

                                </option>

                              )
                            )}

                          </select>

                          <input
                            disabled
                            value={
                              cell.teacherName ||
                              ""
                            }
                            placeholder="Teacher"
                          />

                        </div>

                      );
                    }
                  )}

                </div>

              )
            )}

          </div>

          <button
            onClick={
              handleSave
            }
            disabled={
              saving
            }
          >

            {saving
              ? "Saving..."
              : editingId
                ? "Update Timetable"
                : "Save Timetable"}

          </button>

        </div>

      )}

      {/* TABLE */}

      {allTables.length === 0 ? (

        <div
          className={
            styles.tableBox
          }
        >

          <p
            className={
              styles.empty
            }
          >
            No timetable found
          </p>

        </div>

      ) : (

        allTables.map(
          (table) => (

            <div
              key={table._id}
              className={
                styles.tableBox
              }
            >

              <div
                className={
                  styles.caption
                }
              >

                <h3>

                  {
                    table.meta
                      .departmentName
                  }

                  {" • "}

                  {
                    table.meta
                      .courseName
                  }

                  {" • "}

                  Semester {" "}

                  {
                    table.meta
                      .semester
                  }

                </h3>

                {canEdit && (

                  <div>

                    <button
                      onClick={() =>
                        handleEdit(
                          table
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          table._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                )}

              </div>

              <div
                className={
                  styles.grid
                }
              >

                <div></div>

                {days.map((day) => (

                  <div
                    key={day}
                    className={
                      styles.header
                    }
                  >
                    {day}
                  </div>

                ))}

                {timeSlots.map(
                  (time) => (

                    <div
                      key={time}
                      style={{
                        display:
                          "contents",
                      }}
                    >

                      <div
                        className={
                          styles.time
                        }
                      >
                        {time}
                      </div>

                      {days.map(
                        (day) => {

                          const cell =
                            table.grid?.[
                              `${day}_${time}`
                            ];

                          return (

                            <div
                              key={
                                day + time
                              }
                              className={
                                styles.cell
                              }
                            >

                              {cell ? (

                                <>

                                  <strong>
                                    {
                                      cell.subjectName
                                    }
                                  </strong>

                                  <span>
                                    {
                                      cell.teacherName
                                    }
                                  </span>

                                </>

                              ) : (

                                <span
                                  className={
                                    styles.empty
                                  }
                                >
                                  -
                                </span>

                              )}

                            </div>

                          );
                        }
                      )}

                    </div>

                  )
                )}

              </div>

            </div>

          )
        )

      )}

    </div>

  );
}

export default TimetablePage;