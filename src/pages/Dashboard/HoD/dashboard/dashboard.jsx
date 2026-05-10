// import { useEffect, useState } from "react";
// import { useAuth } from "../../../../context/authContext";
// import StatsCard from "../../component/stats/stats/statsCard";
// import styles from "../../admin/dashboard/dashboard.module.css";
// import { getAssignments } from "../../../../api/assignmentApi";
// import { getInstituteConfig } from "../../../../api/configApi";
// import { getMyInstitute } from "../../../../api/instituteApi";
// import { getUsers } from "../../../../api/userAPI";
// import { getRoleSubjects } from "../../utils/configRuntime";

// function HodDashboard() {
//   const { user, token } = useAuth();
//   const [state, setState] = useState({
//     institute: null,
//     students: [],
//     teachers: [],
//     subjects: [],
//     assignments: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!token || !user?.departmentId) return;

//     const load = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const departmentId = user.departmentId?._id || user.departmentId;
//         const [institute, config, students, teachers, assignments] =
//           await Promise.all([
//             getMyInstitute(),
//             getInstituteConfig(),
//             getUsers({ role: "student", departmentId }),
//             getUsers({ role: "teacher", departmentId }),
//             getAssignments(),
//           ]);

//         setState({
//           institute,
//           students: Array.isArray(students) ? students : [],
//           teachers: Array.isArray(teachers) ? teachers : [],
//           subjects: getRoleSubjects(config, user),
//           assignments: Array.isArray(assignments) ? assignments : [],
//         });
//       } catch (err) {
//         console.error("HOD dashboard error:", err.response?.data || err);
//         setError(err.response?.data?.msg || err.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [token, user]);

//   if (loading) {
//     return <div className={styles.loader}>Loading dashboard...</div>;
//   }

//   return (
//     <div className={styles.dashboard}>
//       <div className={styles.header}>
//         <div>
//           <h1 className={styles.greeting}>Welcome, {user?.name || "HOD"}</h1>
//           <p className={styles.subtitle}>Department overview</p>
//         </div>
//       </div>

//       {error ? (
//         <section className={styles.card}>
//           <p>{error}</p>
//         </section>
//       ) : null}

//       <div className={styles.statsGrid}>
//         <StatsCard title="Students" value={state.students.length} color="blue" />
//         <StatsCard title="Teachers" value={state.teachers.length} color="green" />
//         <StatsCard title="Subjects" value={state.subjects.length} color="purple" />
//         <StatsCard title="Assignments" value={state.assignments.length} color="orange" />
//       </div>

//       <div className={styles.mainGrid}>
//         <section className={styles.card}>
//           <h3>{state.institute?.name || "Institute"} Subjects</h3>
//           <div className={styles.recentList}>
//             {state.subjects.slice(0, 5).map((subject) => (
//               <div key={subject._id} className={styles.recentItem}>
//                 <div className={styles.recentAvatar}>
//                   {(subject.name || "S").charAt(0).toUpperCase()}
//                 </div>
//                 <div className={styles.recentInfo}>
//                   <span className={styles.recentName}>{subject.name}</span>
//                   <span className={styles.recentClass}>
//                     {subject.code || `Semester ${subject.semester || "-"}`}
//                   </span>
//                 </div>
//               </div>
//             ))}
//             {state.subjects.length === 0 && <p>No department subjects found</p>}
//           </div>
//         </section>

//         <section className={styles.card}>
//           <h3>Teachers</h3>
//           <div className={styles.recentList}>
//             {state.teachers.slice(0, 5).map((teacher) => (
//               <div key={teacher._id} className={styles.recentItem}>
//                 <div className={styles.recentAvatar}>
//                   {(teacher.name || "T").charAt(0).toUpperCase()}
//                 </div>
//                 <div className={styles.recentInfo}>
//                   <span className={styles.recentName}>{teacher.name}</span>
//                   <span className={styles.recentClass}>
//                     {teacher.employeeId || teacher.email}
//                   </span>
//                 </div>
//               </div>
//             ))}
//             {state.teachers.length === 0 && <p>No teachers found</p>}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default HodDashboard;
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../../context/authContext";

import StatsCard from "../../component/stats/stats/statsCard";

import styles from "../../admin/dashboard/dashboard.module.css";

import {
  getAssignments,
  getSubmissions,
} from "../../../../api/assignmentApi";

import { getInstituteConfig } from "../../../../api/configApi";

import { getMyInstitute } from "../../../../api/instituteApi";

import { getUsers } from "../../../../api/userAPI";

import {
  getRoleSubjects,
} from "../../utils/configRuntime";

function HodDashboard() {

  const { user, token } = useAuth();

  const [state, setState] = useState({
    institute: null,
    students: [],
    teachers: [],
    subjects: [],
    assignments: [],
  });

  const [submissionStats, setSubmissionStats] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!token || !user?.departmentId)
      return;

    const load = async () => {

      setLoading(true);
      setError("");

      try {

        const departmentId =
          user.departmentId?._id ||
          user.departmentId;

        const [
          institute,
          config,
          students,
          teachers,
          assignments,
        ] = await Promise.all([

          getMyInstitute(),

          getInstituteConfig(),

          getUsers({
            role: "student",
            departmentId,
          }),

          getUsers({
            role: "teacher",
            departmentId,
          }),

          getAssignments(),

        ]);

        /* FILTER DEPARTMENT SUBJECTS */

        const subjects =
          getRoleSubjects(
            config,
            user
          );

        /* FILTER ASSIGNMENTS */

        const departmentAssignments =
          Array.isArray(assignments)
            ? assignments.filter(
                (assignment) =>
                  subjects.some(
                    (subject) =>
                      subject._id ===
                      assignment.subject
                        ?._id
                  )
              )
            : [];

        /* SUBMISSION STATS */

        const stats = {};

        await Promise.all(

          departmentAssignments.map(
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
                      (sub) =>
                        sub.checked
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

        setState({

          institute,

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

          subjects,

          assignments:
            departmentAssignments,

        });

      } catch (err) {

        console.error(
          "HOD dashboard error:",
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

  /* UPCOMING */

  const upcomingAssignments =
    useMemo(
      () =>
        state.assignments.filter(
          (assignment) =>
            new Date(
              assignment.deadline
            ) >= new Date()
        ),
      [state.assignments]
    );

  /* OVERDUE */

  const overdueAssignments =
    useMemo(
      () =>
        state.assignments.filter(
          (assignment) =>
            new Date(
              assignment.deadline
            ) < new Date()
        ),
      [state.assignments]
    );

  /* TOTAL SUBMISSIONS */

  const totalSubmitted =
    Object.values(
      submissionStats
    ).reduce(
      (acc, item) =>
        acc + item.submitted,
      0
    );

  /* TOTAL REVIEWED */

  const totalReviewed =
    Object.values(
      submissionStats
    ).reduce(
      (acc, item) =>
        acc + item.reviewed,
      0
    );

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

        <div>

          <h1 className={styles.greeting}>
            Welcome,
            {" "}
            {user?.name || "HOD"}
          </h1>

          <p className={styles.subtitle}>
            Department overview &
            academic analytics
          </p>

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

        <StatsCard
          title="Students"
          value={
            state.students.length
          }
          color="blue"
        />

        <StatsCard
          title="Teachers"
          value={
            state.teachers.length
          }
          color="green"
        />

        <StatsCard
          title="Subjects"
          value={
            state.subjects.length
          }
          color="purple"
        />

        <StatsCard
          title="Assignments"
          value={
            state.assignments.length
          }
          color="orange"
        />

        <StatsCard
          title="Upcoming"
          value={
            upcomingAssignments.length
          }
          color="yellow"
        />

        <StatsCard
          title="Overdue"
          value={
            overdueAssignments.length
          }
          color="red"
        />

        <StatsCard
          title="Submitted"
          value={totalSubmitted}
          color="cyan"
        />

        <StatsCard
          title="Reviewed"
          value={totalReviewed}
          color="pink"
        />

      </div>

      {/* MAIN GRID */}

      <div className={styles.mainGrid}>

        {/* SUBJECTS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Department Subjects
            </h3>

            <span className={styles.totalBadge}>
              {
                state.subjects.length
              }
            </span>

          </div>

          <div className={styles.recentList}>

            {state.subjects
              .slice(0, 6)
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

            {state.subjects.length ===
              0 && (
              <p>
                No department
                subjects found
              </p>
            )}

          </div>

        </section>

        {/* TEACHERS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Teachers
            </h3>

            <span className={styles.totalBadge}>
              {
                state.teachers.length
              }
            </span>

          </div>

          <div className={styles.recentList}>

            {state.teachers
              .slice(0, 6)
              .map((teacher) => (

                <div
                  key={teacher._id}
                  className={
                    styles.recentItem
                  }
                >

                  <div
                    className={
                      styles.recentAvatar
                    }
                  >
                    {(teacher.name ||
                      "T")
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
                      {teacher.name}
                    </span>

                    <span
                      className={
                        styles.recentClass
                      }
                    >
                      {teacher.employeeId ||
                        teacher.email}
                    </span>

                  </div>

                </div>

              ))}

            {state.teachers.length ===
              0 && (
              <p>
                No teachers found
              </p>
            )}

          </div>

        </section>

        {/* ASSIGNMENTS */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <h3>
              Assignment Activity
            </h3>

            <span className={styles.totalBadge}>
              {
                state.assignments.length
              }
            </span>

          </div>

          <div className={styles.recentList}>

            {state.assignments
              .slice(0, 6)
              .map((assignment) => {

                const overdue =
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
                          overdue
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
                          ]
                            ?.submitted ||
                            0}
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
                          ]
                            ?.reviewed ||
                            0}
                        </span>

                      </div>

                    </div>

                  </div>

                );
              })}

            {state.assignments
              .length === 0 && (
              <p>
                No assignments found
              </p>
            )}

          </div>

        </section>

      </div>

    </div>

  );
}

export default HodDashboard;