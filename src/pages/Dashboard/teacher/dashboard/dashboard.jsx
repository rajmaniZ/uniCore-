import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";

import StatsCard from "../../component/stats/stats/statsCard";

import styles from "./dashboard.module.css";

import {
  getAssignments,
  getSubmissions,
} from "../../../../api/assignmentApi";

import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";

import {
  getRoleSubjects,
} from "../../utils/configRuntime";

function TeacherDashboard() {

  const { user, token } = useAuth();

  const [assignments, setAssignments] =
    useState([]);

  const [submissionStats, setSubmissionStats] =
    useState({});

  const [institute, setInstitute] =
    useState(null);

  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!token || !user?._id) return;

    const load = async () => {

      setLoading(true);
      setError("");

      try {

        const [
          assignmentData,
          instituteData,
          config,
        ] = await Promise.all([
          getAssignments(),
          getMyInstitute(),
          getInstituteConfig(),
        ]);

        setAssignments(
          Array.isArray(assignmentData)
            ? assignmentData
            : []
        );

        setInstitute(instituteData);

        setSubjects(
          getRoleSubjects(config, user)
        );

        /* SUBMISSION STATS */

        const stats = {};

        await Promise.all(

          assignmentData.map(
            async (assignment) => {

              try {

                const submissions =
                  await getSubmissions(
                    assignment._id
                  );

                stats[assignment._id] = {

                  submitted:
                    submissions.length,

                  reviewed:
                    submissions.filter(
                      (sub) => sub.checked
                    ).length,

                };

              } catch (err) {

                stats[assignment._id] = {
                  submitted: 0,
                  reviewed: 0,
                };

              }
            }
          )
        );

        setSubmissionStats(stats);

      } catch (err) {

        console.error(
          "Teacher dashboard error:",
          err.response?.data || err
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

  /* STATS */

  const upcomingAssignments =
    useMemo(
      () =>
        assignments.filter(
          (assignment) =>
            new Date(
              assignment.deadline
            ) >= new Date()
        ),
      [assignments]
    );

  const overdueAssignments =
    useMemo(
      () =>
        assignments.filter(
          (assignment) =>
            new Date(
              assignment.deadline
            ) < new Date()
        ),
      [assignments]
    );

  const compulsoryAssignments =
    useMemo(
      () =>
        assignments.filter(
          (assignment) =>
            assignment.label ===
            "compulsory"
        ),
      [assignments]
    );

  const importantAssignments =
    useMemo(
      () =>
        assignments.filter(
          (assignment) =>
            assignment.label ===
            "important"
        ),
      [assignments]
    );

  const runningClasses =
    useMemo(() => {

      const map = new Map();

      subjects.forEach((subject) => {

        const key =
          `${subject.name}-${subject.semester}`;

        map.set(key, true);

      });

      return map.size;

    }, [subjects]);

  /* RECENT */

  const recentAssignments =
    [...assignments]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 6);

  /* LOADING */

  if (loading) {

    return (
      <div className={styles.dashboard}>
        Loading dashboard...
      </div>
    );
  }

  return (

    <div className={styles.dashboard}>

      {/* HEADER */}

      <div className={styles.header}>

        <h1 className={styles.greeting}>
          Welcome,{" "}
          {user?.name || "Teacher"}
        </h1>

        <p className={styles.subtitle}>
          {institute?.name ||
            "Institute"}{" "}
          teacher dashboard overview
        </p>

      </div>

      {/* ERROR */}

      {error ? (
        <section className={styles.card}>
          <p>{error}</p>
        </section>
      ) : null}

      {/* STATS */}

      <div className={styles.statsGrid}>

        <StatsCard
          title="Subjects"
          value={subjects.length}
          color="purple"
        />

        <StatsCard
          title="Assignments"
          value={assignments.length}
          color="green"
        />

        <StatsCard
          title="Upcoming"
          value={
            upcomingAssignments.length
          }
          color="orange"
        />

        <StatsCard
          title="Running Classes"
          value={runningClasses}
          color="blue"
        />

        <StatsCard
          title="Compulsory"
          value={
            compulsoryAssignments.length
          }
          color="red"
        />

        <StatsCard
          title="Important"
          value={
            importantAssignments.length
          }
          color="yellow"
        />

        <StatsCard
          title="Overdue"
          value={
            overdueAssignments.length
          }
          color="pink"
        />

        <StatsCard
          title="Institute"
          value={
            institute?.type ||
            "School"
          }
          color="cyan"
        />

      </div>

      {/* MAIN GRID */}

      <div className={styles.mainGrid}>

        {/* SUBJECTS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Assigned Subjects
            </h3>

            <span className={styles.totalBadge}>
              {subjects.length}
            </span>

          </div>

          <div className={styles.recentList}>

            {subjects
              .slice(0, 8)
              .map((subject) => (

                <div
                  key={subject._id}
                  className={
                    styles.recentItem
                  }
                >

                  <div
                    className={
                      styles.recentAvatar
                    }
                  >
                    {(subject.name ||
                      "S")
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
                      {subject.name}
                    </span>

                    <span
                      className={
                        styles.recentClass
                      }
                    >
                      {subject.code ||
                        `Semester ${subject.semester || "-"}`}
                    </span>

                  </div>

                </div>

              ))}

            {subjects.length === 0 && (
              <p>
                No subjects assigned
              </p>
            )}

          </div>

        </section>

        {/* RECENT ASSIGNMENTS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Recent Assignments
            </h3>

            <span className={styles.totalBadge}>
              {assignments.length}
            </span>

          </div>

          <div className={styles.recentList}>

            {recentAssignments.map(
              (assignment) => {

                const isOverdue =
                  new Date(
                    assignment.deadline
                  ) < new Date();

                return (

                  <div
                    key={assignment._id}
                    className={
                      styles.assignmentItem
                    }
                  >

                    <div
                      className={
                        styles.assignmentTop
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
                          {assignment
                            .subject
                            ?.name ||
                            "Subject"}
                        </span>

                      </div>

                    </div>

                    <div
                      className={
                        styles.assignmentMeta
                      }
                    >

                      <span>
                        Created:
                        {" "}
                        {new Date(
                          assignment.createdAt
                        ).toLocaleDateString()}
                      </span>

                      <span
                        className={
                          isOverdue
                            ? styles.deadlineRed
                            : styles.deadlineGreen
                        }
                      >
                        Deadline:
                        {" "}
                        {new Date(
                          assignment.deadline
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    <div
                      className={
                        styles.assignmentFooter
                      }
                    >

                      <span
                        className={`${styles.labelBadge} ${styles[assignment.label]}`}
                      >
                        {
                          assignment.label
                        }
                      </span>

                      <div
                        className={
                          styles.assignmentStats
                        }
                      >

                        <span
                          className={
                            styles.submissionCount
                          }
                        >
                          Submitted:
                          {" "}
                          {submissionStats[
                            assignment._id
                          ]?.submitted || 0}
                        </span>

                        <span
                          className={
                            styles.reviewCount
                          }
                        >
                          Reviewed:
                          {" "}
                          {submissionStats[
                            assignment._id
                          ]?.reviewed || 0}
                        </span>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

            {assignments.length ===
              0 && (
              <p>
                No assignments yet
              </p>
            )}

          </div>

        </section>

        {/* QUICK INSIGHTS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Quick Insights
            </h3>

          </div>

          <div className={styles.insightsList}>

            <div
              className={
                styles.insightItem
              }
            >

              <div
                className={
                  styles.insightDot
                }
              />

              <span
                className={
                  styles.insightSubject
                }
              >
                Total Subjects
              </span>

              <span
                className={
                  styles.insightPending
                }
              >
                {subjects.length}
              </span>

            </div>

            <div
              className={
                styles.insightItem
              }
            >

              <div
                className={
                  styles.insightDot
                }
              />

              <span
                className={
                  styles.insightSubject
                }
              >
                Upcoming Tasks
              </span>

              <span
                className={
                  styles.insightPending
                }
              >
                {
                  upcomingAssignments.length
                }
              </span>

            </div>

            <div
              className={
                styles.insightItem
              }
            >

              <div
                className={
                  styles.insightDot
                }
              />

              <span
                className={
                  styles.insightSubject
                }
              >
                Overdue Tasks
              </span>

              <span
                className={
                  styles.insightPending
                }
              >
                {
                  overdueAssignments.length
                }
              </span>

            </div>

            <div
              className={
                styles.insightItem
              }
            >

              <div
                className={
                  styles.insightDot
                }
              />

              <span
                className={
                  styles.insightSubject
                }
              >
                Running Classes
              </span>

              <span
                className={
                  styles.insightPending
                }
              >
                {runningClasses}
              </span>

            </div>

          </div>

          <p className={styles.insightNote}>
            Dashboard auto updates
            based on assignment &
            institute configuration.
          </p>

        </section>

      </div>

    </div>

  );
}

export default TeacherDashboard;