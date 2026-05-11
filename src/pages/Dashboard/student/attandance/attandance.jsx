import { useEffect, useState } from "react";

import { useAuth } from "../../../../context/authContext";

import styles from "./attandance.module.css";

import {
  getAttendance,
} from "./../../../../api/attandenceApi";

const months = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

const getMonthDays = (
  year,
  monthIndex
) => {
  const days = [];

  const date = new Date(
    year,
    monthIndex,
    1
  );

  while (
    date.getMonth() === monthIndex
  ) {
    if (date.getDay() !== 0) {
      days.push(new Date(date));
    }

    date.setDate(
      date.getDate() + 1
    );
  }

  return days;
};

function Subject() {

  const { user } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [subjects, setSubjects] =
    useState([]);

  const year =
    new Date().getFullYear();

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance =
    async () => {

      try {

        setLoading(true);

        const response =
          await getAttendance();

        const attendanceRecords =
          Array.isArray(response)
            ? response
            : response?.attendance || [];

        const grouped = {};

        attendanceRecords.forEach(
          (record) => {

            const subject =
              record.subject;

            if (!subject?._id)
              return;

            const subjectId =
              subject._id;

            if (
              !grouped[
                subjectId
              ]
            ) {
              grouped[
                subjectId
              ] = {
                subject,
                present: [],
                absent: [],
                holiday: [],
              };
            }

            const date =
              new Date(
                record.date
              )
                .toISOString()
                .split("T")[0];

            /*
              IMPORTANT:
              backend attendance
              stored inside students[]
            */

            record.students?.forEach(
              (
                studentEntry
              ) => {

                const studentId =
                  studentEntry
                    .student?._id ||
                  studentEntry.student;

                /*
                  FILTER CURRENT USER
                */

                if (
                  String(studentId) !==
                  String(user?._id)
                ) {
                  return;
                }

                const status =
                  studentEntry.status;

                if (
                  status ===
                  "present"
                ) {
                  grouped[
                    subjectId
                  ].present.push(
                    date
                  );
                }

                if (
                  status ===
                  "absent"
                ) {
                  grouped[
                    subjectId
                  ].absent.push(
                    date
                  );
                }

                if (
                  status ===
                  "holiday"
                ) {
                  grouped[
                    subjectId
                  ].holiday.push(
                    date
                  );
                }
              }
            );
          }
        );

        setSubjects(
          Object.values(
            grouped
          )
        );

      } catch (err) {

        console.error(
          "Attendance Error:",
          err
        );

      } finally {

        setLoading(false);

      }
    };

  const getStatus = (
    dateStr,
    subjectData
  ) => {

    if (
      subjectData.holiday.includes(
        dateStr
      )
    ) {
      return "holiday";
    }

    if (
      subjectData.present.includes(
        dateStr
      )
    ) {
      return "present";
    }

    if (
      subjectData.absent.includes(
        dateStr
      )
    ) {
      return "absent";
    }

    return "empty";
  };

  if (loading) {

    return (
      <div
        className={
          styles.loading
        }
      >
        Loading attendance...
      </div>
    );
  }

  if (!subjects.length) {

    return (
      <div
        className={
          styles.empty
        }
      >
        No attendance data found
      </div>
    );
  }

  return (

    <div
      className={
        styles.container
      }
    >

      {subjects.map(
        (subjectData) => {

          const subject =
            subjectData.subject;

          const totalClasses =
            subjectData.present.length +
            subjectData.absent.length;

          const attendancePercentage =
            totalClasses > 0
              ? Math.round(
                  (
                    subjectData.present
                      .length /
                    totalClasses
                  ) * 100
                )
              : 0;

          return (

            <div
              key={
                subject._id
              }
              className={
                styles.card
              }
            >

              {/* HEADER */}

              <div
                className={
                  styles.header
                }
              >

                <div>

                  <h3>
                    {
                      subject.name
                    }
                  </h3>

                  <span>
                    {subject.code ||
                      "No Code"}
                  </span>

                </div>

                <div
                  className={
                    styles.stats
                  }
                >

                  <div
                    className={
                      styles.presentBox
                    }
                  >
                    Present:
                    {" "}
                    {
                      subjectData
                        .present
                        .length
                    }
                  </div>

                  <div
                    className={
                      styles.absentBox
                    }
                  >
                    Absent:
                    {" "}
                    {
                      subjectData
                        .absent
                        .length
                    }
                  </div>

                  <div
                    className={
                      styles.percentBox
                    }
                  >
                    {
                      attendancePercentage
                    }%
                  </div>

                </div>

              </div>

              {/* GRID */}

              <div
                className={
                  styles.wrapper
                }
              >

                {/* DAYS */}

                <div
                  className={
                    styles.days
                  }
                >

                  {[
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].map(
                    (d) => (
                      <div
                        key={d}
                      >
                        {d}
                      </div>
                    )
                  )}

                </div>

                {/* MONTHS */}

                <div
                  className={
                    styles.monthRow
                  }
                >

                  {months.map(
                    (
                      m,
                      idx
                    ) => {

                      const monthIndex =
                        new Date(
                          `${m} 1, ${year}`
                        ).getMonth();

                      const days =
                        getMonthDays(
                          year,
                          monthIndex
                        );

                      return (

                        <div
                          key={
                            idx
                          }
                          className={
                            styles.monthBlock
                          }
                        >

                          <div
                            className={
                              styles.grid
                            }
                          >

                            {(() => {

                              const columns =
                                [];

                              const firstDay =
                                new Date(
                                  year,
                                  monthIndex,
                                  1
                                );

                              let start =
                                firstDay.getDay();

                              start =
                                start === 0
                                  ? 5
                                  : start - 1;

                              let col =
                                Array(
                                  6
                                ).fill(
                                  null
                                );

                              let row =
                                start;

                              days.forEach(
                                (
                                  d
                                ) => {

                                  col[
                                    row
                                  ] =
                                    d;

                                  row++;

                                  if (
                                    row === 6
                                  ) {

                                    columns.push(
                                      col
                                    );

                                    col =
                                      Array(
                                        6
                                      ).fill(
                                        null
                                      );

                                    row = 0;
                                  }
                                }
                              );

                              if (
                                col.some(
                                  (
                                    v
                                  ) =>
                                    v !==
                                    null
                                )
                              ) {
                                columns.push(
                                  col
                                );
                              }

                              return columns.map(
                                (
                                  column,
                                  cIdx
                                ) => (

                                  <div
                                    key={
                                      cIdx
                                    }
                                    className={
                                      styles.column
                                    }
                                  >

                                    {column.map(
                                      (
                                        d,
                                        rIdx
                                      ) => {

                                        if (!d)
                                          return null;

                                        const dateStr =
                                          d
                                            .toISOString()
                                            .split(
                                              "T"
                                            )[0];

                                        const status =
                                          getStatus(
                                            dateStr,
                                            subjectData
                                          );

                                        return (

                                          <div
                                            key={
                                              rIdx
                                            }
                                            className={`${styles.box}

                                            ${
                                              status ===
                                              "present"
                                                ? styles.green
                                                : ""
                                            }

                                            ${
                                              status ===
                                              "absent"
                                                ? styles.red
                                                : ""
                                            }

                                            ${
                                              status ===
                                              "holiday"
                                                ? styles.yellow
                                                : ""
                                            }
                                            
                                            `}
                                          >
                                            {d.getDate()}
                                          </div>
                                        );
                                      }
                                    )}

                                  </div>
                                )
                              );
                            })()}

                          </div>

                          <div
                            className={
                              styles.monthLabel
                            }
                          >
                            {m}
                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* LEGEND */}

              <div
                className={
                  styles.legend
                }
              >

                <div
                  className={
                    styles.legendItem
                  }
                >

                  <span
                    className={`${styles.legendColor} ${styles.green}`}
                  ></span>

                  Present

                </div>

                <div
                  className={
                    styles.legendItem
                  }
                >

                  <span
                    className={`${styles.legendColor} ${styles.red}`}
                  ></span>

                  Absent

                </div>

                <div
                  className={
                    styles.legendItem
                  }
                >

                  <span
                    className={`${styles.legendColor} ${styles.yellow}`}
                  ></span>

                  Holiday

                </div>

              </div>

            </div>
          );
        }
      )}

    </div>
  );
}

export default Subject;