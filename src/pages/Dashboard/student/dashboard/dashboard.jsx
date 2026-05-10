import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../../context/authContext";

import styles from "./dashboard.module.css";

import { getAssignments } from "../../../../api/assignmentApi";
import { getAttendance } from "../../../../api/attandenceApi";
import { getInstituteConfig } from "../../../../api/configApi";

import {
  getRoleSubjects,
} from "../../utils/configRuntime";

function StudentDashboard() {

  const { user, token } =
    useAuth();

  const [assignments, setAssignments] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!token || !user?._id)
      return;

    const load = async () => {

      setLoading(true);
      setError("");

      try {

        const [
          assignmentData,
          attendanceData,
          config,
        ] = await Promise.all([

          getAssignments(),

          getAttendance(),

          getInstituteConfig(),

        ]);

        setAssignments(
          Array.isArray(
            assignmentData
          )
            ? assignmentData
            : []
        );

        setAttendance(
          Array.isArray(
            attendanceData
          )
            ? attendanceData
            : []
        );

        setSubjects(
          getRoleSubjects(
            config,
            user
          )
        );

      } catch (err) {

        console.error(
          "Student dashboard error:",
          err.response?.data ||
            err
        );

        setError(
          err.response?.data?.msg ||
            err.message ||
            "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }
    };

    load();

  }, [token, user]);

  /* ATTENDANCE */

  const attendanceStats =
    useMemo(() => {

      let present = 0;
      let total = 0;

      attendance.forEach(
        (record) => {

          record.students?.forEach(
            (entry) => {

              const studentId =
                entry.student?._id ||
                entry.student;

              if (
                studentId ===
                user?._id
              ) {

                total += 1;

                if (
                  entry.status ===
                  "present"
                ) {
                  present += 1;
                }
              }
            }
          );
        }
      );

      return {
        present,
        total,
      };

    }, [attendance, user?._id]);

  /* PENDING */

  const pendingAssignments =
    useMemo(
      () =>
        assignments.filter(
          (assignment) => {

            const submission =
              assignment.submission ||
              assignment.mySubmission;

            return !submission;
          }
        ),
      [assignments]
    );

  if (loading) {

    return (
      <div className={styles.loader}>
        Loading dashboard...
      </div>
    );
  }

  return (

    <div className={styles.dashboard}>

      {/* HEADER */}

      <div className={styles.header}>

        <div className={styles.profileSection}>

          <div className={styles.avatar}>
            {(user?.name || "S")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className={styles.profileInfo}>

            <h1 className={styles.name}>
              {user?.name ||
                "Student"}
            </h1>

            <p className={styles.details}>
              {user?.email}
            </p>

            <p className={styles.meta}>
              {user?.department?.name ||
                "Department"}
            </p>

          </div>

        </div>

      </div>

      {/* ERROR */}

      {error ? (

        <section className={styles.card}>
          <p>{error}</p>
        </section>

      ) : null}

      {/* STATS */}

      <div className={styles.statsGrid}>

        <div className={styles.statCard}>

          <h3>Subjects</h3>

          <h1>
            {subjects.length}
          </h1>

        </div>

        <div className={styles.statCard}>

          <h3>Assignments</h3>

          <h1>
            {assignments.length}
          </h1>

        </div>

        <div className={styles.statCard}>

          <h3>Pending</h3>

          <h1>
            {
              pendingAssignments.length
            }
          </h1>

        </div>

        <div className={styles.statCard}>

          <h3>Attendance</h3>

          <h1>

            {attendanceStats.total

              ? `${Math.round(
                  (
                    attendanceStats.present /
                    attendanceStats.total
                  ) * 100
                )}%`

              : "0%"}

          </h1>

        </div>

      </div>

      {/* MAIN */}

      <div className={styles.mainGrid}>

        {/* SUBJECT ATTENDANCE */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Subject Attendance
            </h3>

          </div>

          <div className={styles.subjectList}>

            {subjects.map(
              (subject) => {

                let total = 0;
                let present = 0;

                attendance.forEach(
                  (record) => {

                    const subjectId =
                      record.subject?._id ||
                      record.subject;

                    if (
                      subjectId ===
                      subject._id
                    ) {

                      record.students?.forEach(
                        (entry) => {

                          const studentId =
                            entry.student?._id ||
                            entry.student;

                          if (
                            studentId ===
                            user?._id
                          ) {

                            total++;

                            if (
                              entry.status ===
                              "present"
                            ) {
                              present++;
                            }
                          }
                        }
                      );
                    }
                  }
                );

                const percentage =
                  total > 0
                    ? Math.round(
                        (
                          present /
                          total
                        ) * 100
                      )
                    : 0;

                return (

                  <div
                    key={subject._id}
                    className={
                      styles.subjectCard
                    }
                  >

                    <div
                      className={
                        styles.subjectTop
                      }
                    >

                      <div>

                        <span
                          className={
                            styles.subjectName
                          }
                        >
                          {subject.name}
                        </span>

                        <p
                          className={
                            styles.subjectCode
                          }
                        >
                          {subject.code ||
                            "Subject"}
                        </p>

                      </div>

                      <span
                        className={
                          percentage >= 75
                            ? styles.goodAttendance
                            : styles.lowAttendance
                        }
                      >
                        {percentage}%
                      </span>

                    </div>

                    <div
                      className={
                        styles.progressBar
                      }
                    >

                      <div
                        className={
                          styles.progressFill
                        }
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                    <div
                      className={
                        styles.attendanceMeta
                      }
                    >

                      <span>
                        Present:
                        {" "}
                        {present}
                      </span>

                      <span>
                        Total:
                        {" "}
                        {total}
                      </span>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </section>

        {/* ASSIGNMENTS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Recent Assignments
            </h3>

          </div>

          <div className={styles.recentList}>

            {assignments
              .slice(0, 5)
              .map((assignment) => {

                const submission =
                  assignment.submission ||
                  assignment.mySubmission ||
                  null;

                const isSubmitted =
                  !!submission;

                const isReviewed =
                  submission?.checked ||
                  submission?.status ===
                    "reviewed";

                return (

                  <div
                    key={assignment._id}
                    className={
                      styles.recentItem
                    }
                  >

                    <div
                      className={
                        styles.recentAvatar
                      }
                    >
                      {(assignment.title ||
                        "A")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div
                      className={
                        styles.recentInfo
                      }
                    >

                      <span
                        className={
                          styles.recentName
                        }
                      >
                        {
                          assignment.title
                        }
                      </span>

                      <span
                        className={
                          styles.recentClass
                        }
                      >
                        {assignment.subject
                          ?.name ||
                          "Subject"}
                      </span>

                      <span
                        className={
                          styles.assignmentDeadline
                        }
                      >
                        Deadline:
                        {" "}
                        {new Date(
                          assignment.deadline
                        ).toLocaleDateString()}
                      </span>

                      {/* STATUS */}

                      <div
                        className={
                          styles.assignmentStatus
                        }
                      >

                        {!isSubmitted && (

                          <span
                            className={
                              styles.pendingStatus
                            }
                          >
                            Pending
                          </span>

                        )}

                        {isSubmitted &&
                          !isReviewed && (

                          <span
                            className={
                              styles.submittedStatus
                            }
                          >
                            Submitted
                          </span>

                        )}

                        {isReviewed && (

                          <span
                            className={
                              styles.reviewedStatus
                            }
                          >
                            Reviewed
                          </span>

                        )}

                      </div>

                      {/* FEEDBACK */}

                      {submission && (

                        <div
                          className={
                            styles.feedbackBox
                          }
                        >

                          <span>
                            Marks:
                            {" "}
                            {submission?.marks ??
                              "-"}
                          </span>

                          <span>
                            Remarks:
                            {" "}
                            {submission?.remarks ||
                              "No remarks"}
                          </span>

                        </div>

                      )}

                    </div>

                  </div>

                );
              })}

            {assignments.length ===
              0 && (

              <p
                className={
                  styles.emptyState
                }
              >
                No assignments found
              </p>

            )}

          </div>

        </section>

      </div>

    </div>

  );
}

export default StudentDashboard