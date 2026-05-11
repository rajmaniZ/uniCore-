import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../../context/authContext";

import styles from "./dashboard.module.css";

import Loader from "../../../../component/loader/loader";

import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";
import { getUsers } from "../../../../api/userAPI";
import { getRequests } from "../../../../api/requestApi";

import {
  getRoleConfigSummary,
} from "../../utils/configRuntime";

function AdminDashboard() {

  const { user, token } =
    useAuth();

  const [data, setData] =
    useState({
      institute: null,
      config: null,
      students: [],
      teachers: [],
      requests: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!token || !user)
      return;

    const loadDashboard =
      async () => {

        setLoading(true);
        setError("");

        try {

          const [
            institute,
            config,
            students,
            teachers,
            requests,
          ] = await Promise.all([

            getMyInstitute()
              .catch(() => null),

            getInstituteConfig()
              .catch(() => null),

            getUsers({
              role: "student",
            }).catch(() => []),

            getUsers({
              role: "teacher",
            }).catch(() => []),

            getRequests()
              .catch(() => []),

          ]);

          setData({

            institute,

            config,

            students:
              Array.isArray(
                students
              )
                ? students
                : [],

            teachers:
              Array.isArray(
                teachers
              )
                ? teachers
                : [],

            requests:
              Array.isArray(
                requests
              )
                ? requests
                : [],

          });

        } catch (err) {

          console.error(
            "Dashboard error:",
            err
          );

          setError(
            "Failed to load dashboard"
          );

        } finally {

          setLoading(false);

        }
      };

    loadDashboard();

  }, [token, user]);

  /* PENDING ONLY */

  const pendingRequests =
    useMemo(() => {

      return data.requests.filter(
        (item) =>
          item.status === "pending"
      );

    }, [data.requests]);

  /* STATS */

  const stats =
    useMemo(() => {

      return {

        students:
          data.students.length,

        teachers:
          data.teachers.length,

        requests:
          pendingRequests.length,

        ...getRoleConfigSummary(
          data.config,
          user
        ),

      };

    }, [
      data,
      user,
      pendingRequests,
    ]);

  if (loading) {
    return <Loader />;
  }

  return (

    <div className={styles.dashboard}>

      {/* HEADER */}

      <div className={styles.header}>

        <div>

          <h1 className={styles.greeting}>

            Welcome,
            {" "}
            {user?.name?.split(
              " "
            )[0] || "Admin"}

          </h1>

          <p className={styles.subtitle}>

            {data.institute?.name ||
              "Institute"} overview

          </p>

        </div>

      </div>

      {/* ERROR */}

      {error && (

        <section className={styles.card}>
          <p>{error}</p>
        </section>

      )}

      {/* STATS */}

      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <span>Total Students</span>
          <h2>{stats.students}</h2>
        </div>

        <div className={styles.statCard}>
          <span>Total Teachers</span>
          <h2>{stats.teachers}</h2>
        </div>

        <div className={styles.statCard}>
          <span>Pending Requests</span>
          <h2>{stats.requests}</h2>
        </div>

        <div className={styles.statCard}>

          <span>

            {data.institute?.type ===
            "school"

              ? "Classes"

              : "Courses"}

          </span>

          <h2>

            {data.institute?.type ===
            "school"

              ? stats.classes

              : stats.courses}

          </h2>

        </div>

        <div className={styles.statCard}>
          <span>Subjects</span>
          <h2>{stats.subjects}</h2>
        </div>

      </div>

      {/* MAIN GRID */}

      <div className={styles.mainGrid}>

        {/* PENDING REQUESTS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Pending Requests
            </h3>

            <span>
              {pendingRequests.length}
            </span>

          </div>

          <div className={styles.recentList}>

            {pendingRequests
              .slice(0, 5)
              .map((request) => (

                <div
                  key={request._id}
                  className={
                    styles.recentItem
                  }
                >

                  <div
                    className={
                      styles.recentAvatar
                    }
                  >

                    {(request.name || "R")
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
                      {request.name}
                    </span>

                    <span
                      className={
                        styles.recentClass
                      }
                    >
                      {request.role}
                    </span>

                  </div>

                </div>

              ))}

            {pendingRequests.length ===
              0 && (

              <p
                className={
                  styles.emptyState
                }
              >
                No pending requests
              </p>

            )}

          </div>

        </section>

        {/* SUBJECT OVERVIEW */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Subject Overview
            </h3>

            <span>
              {stats.subjects}
            </span>

          </div>

          <div className={styles.studentList}>

            {data.config?.subjects
              ?.slice(0, 6)
              ?.map((subject) => (

                <div
                  key={subject._id}
                  className={
                    styles.studentItem
                  }
                >

                  <div
                    className={
                      styles.studentAvatar
                    }
                  >

                    {(subject.name || "S")
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div
                    className={
                      styles.studentInfo
                    }
                  >

                    <span
                      className={
                        styles.studentName
                      }
                    >
                      {subject.name}
                    </span>

                    <span
                      className={
                        styles.studentMeta
                      }
                    >

                      {subject.department
                        ?.name ||
                        "Department"}

                      {" • "}

                      {subject.course
                        ?.name ||
                        "Course"}

                      {" • "}

                      {subject.semester

                        ? `Semester ${subject.semester}`

                        : "Annual"}

                    </span>

                  </div>

                  <div
                    className={
                      styles.studentScore
                    }
                  >

                    <span>

                      {subject.teacher
                        ?.name ||
                        "No Teacher"}

                    </span>

                  </div>

                </div>

              ))}

            {!data.config?.subjects
              ?.length && (

              <p
                className={
                  styles.emptyState
                }
              >
                No subjects found
              </p>

            )}

          </div>

        </section>

        {/* STUDENTS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Recent Students
            </h3>

            <span>
              {data.students.length}
            </span>

          </div>

          <div className={styles.recentList}>

            {data.students
              .slice(0, 5)
              .map((student) => (

                <div
                  key={student._id}
                  className={
                    styles.recentItem
                  }
                >

                  <div
                    className={
                      styles.recentAvatar
                    }
                  >

                    {(student.name || "S")
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
                      {student.name}
                    </span>

                    <span
                      className={
                        styles.recentClass
                      }
                    >
                      {student.rollNumber ||
                        student.email}
                    </span>

                  </div>

                </div>

              ))}

            {data.students.length ===
              0 && (

              <p
                className={
                  styles.emptyState
                }
              >
                No students found
              </p>

            )}

          </div>

        </section>

      </div>

    </div>

  );
}

export default AdminDashboard;