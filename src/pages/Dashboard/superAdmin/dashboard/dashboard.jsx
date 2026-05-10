import { useMemo } from "react";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/dataContext";

import DashboardLayout from "../../component/Dashboardlayout/Dashboardlayout";
import StatsCard from "../../component/stats/stats/statsCard";
import JoinRequests from "../../component/joinRequests/joinRequests";

import styles from "./dashboard.module.css";

function AdminDashboard() {

  const { currentUser, joinRequests } =
    useAuth();

  const {
    students,
    teachers,
    colleges,
  } = useData();

  /* COLLEGE DATA */

  const collegeData = useMemo(() => {

    const collegeId =
      currentUser?.collegeId;

    return {

      students:
        students.filter(
          (student) =>
            student.collegeId ===
            collegeId
        ),

      teachers:
        teachers.filter(
          (teacher) =>
            teacher.collegeId ===
            collegeId
        ),

      pendingRequests:
        joinRequests.filter(
          (request) =>
            request.status ===
            "pending"
        ),

      departments: [

        ...new Set(

          students
            .filter(
              (student) =>
                student.collegeId ===
                collegeId
            )
            .map(
              (student) =>
                student.branch
            )

        ),

      ],

    };

  }, [
    currentUser,
    students,
    teachers,
    joinRequests,
  ]);

  /* WEEKLY CHART */

  const weeklyData = [

    {
      day: "Fri",
      value:
        collegeData.students.length *
        0.12,
    },

    {
      day: "Sat",
      value:
        collegeData.students.length *
        0.18,
    },

    {
      day: "Sun",
      value:
        collegeData.students.length *
        0.22,
    },

    {
      day: "Mon",
      value:
        collegeData.students.length *
        0.35,
    },

    {
      day: "Tue",
      value:
        collegeData.students.length *
        0.48,
    },

    {
      day: "Wed",
      value:
        collegeData.students.length *
        0.62,
    },

    {
      day: "Thu",
      value:
        collegeData.students.length *
        0.8,
    },

  ];

  const maxValue = Math.max(
    ...weeklyData.map(
      (item) => item.value
    )
  );

  /* DEPARTMENT DATA */

  const departmentData =
    collegeData.departments.map(
      (department, index) => {

        const deptStudents =
          collegeData.students.filter(
            (student) =>
              student.branch ===
              department
          );

        const deptTeachers =
          collegeData.teachers.filter(
            (teacher) =>
              teacher.department ===
              department
          );

        return {

          rank: index + 1,

          name: department,

          avgGPA: (
            7 +
            Math.random() * 2
          ).toFixed(1),

          faculty:
            deptTeachers.length,

          students:
            deptStudents.length,

          status: "Active",

        };
      }
    );

  /* TOP TEACHERS */

  const topTeachers = [

    {
      name: "Alice Johnson",
      dept: "CSE",
      score: 89,
      change: "+8.8%",
    },

    {
      name: "David Lee",
      dept: "ME",
      score: 85,
      change: "+3.7%",
    },

    {
      name: "John Smith",
      dept: "IT",
      score: 84,
      change: "+2.1%",
    },

    {
      name: "Catherine Wang",
      dept: "CE",
      score: 83,
      change: "+8.0%",
    },

  ];

  return (

    <DashboardLayout>

      <div className={styles.dashboard}>

        {/* HEADER */}

        <div className={styles.header}>

          <div>

            <h1 className={styles.greeting}>
              Welcome, Admin
            </h1>

            <p className={styles.subtitle}>
              Here's your college
              analytics overview
            </p>

          </div>

        </div>

        {/* STATS */}

        <div className={styles.statsGrid}>

          <StatsCard
            title="Total Students"
            value={collegeData.students.length.toLocaleString()}
            change="6.4%"
            changeType="positive"
            color="blue"
          />

          <StatsCard
            title="Total Teachers"
            value={collegeData.teachers.length.toString()}
            change="2.5%"
            changeType="positive"
            color="purple"
          />

          <StatsCard
            title="Departments"
            value={collegeData.departments.length.toString()}
            color="green"
          />

          <StatsCard
            title="Join Requests"
            value={collegeData.pendingRequests.length.toString()}
            color="orange"
          />

        </div>

        {/* QUICK ANALYTICS */}

        <div className={styles.quickAnalytics}>

          <div className={styles.analyticsCard}>

            <span className={styles.analyticsTitle}>
              Active Departments
            </span>

            <h2 className={styles.analyticsValue}>
              {
                collegeData.departments
                  .length
              }
            </h2>

            <p className={styles.analyticsSub}>
              Running academic
              branches
            </p>

          </div>

          <div className={styles.analyticsCard}>

            <span className={styles.analyticsTitle}>
              Teacher Strength
            </span>

            <h2 className={styles.analyticsValue}>
              {
                collegeData.teachers
                  .length
              }
            </h2>

            <p className={styles.analyticsSub}>
              Faculty currently
              active
            </p>

          </div>

          <div className={styles.analyticsCard}>

            <span className={styles.analyticsTitle}>
              Student Ratio
            </span>

            <h2 className={styles.analyticsValue}>

              {collegeData.students
                .length > 0

                ? Math.round(
                    collegeData.students
                      .length /
                      Math.max(
                        collegeData
                          .teachers
                          .length,
                        1
                      )
                  )

                : 0}

              :1

            </h2>

            <p className={styles.analyticsSub}>
              Students per teacher
            </p>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className={styles.mainGrid}>

          {/* CHART */}

          <div className={styles.chartCard}>

            <div className={styles.cardHeader}>

              <h3>
                College Overview
              </h3>

              <select
                className={
                  styles.select
                }
              >
                <option>
                  Last 7 Days
                </option>

                <option>
                  Last 30 Days
                </option>

                <option>
                  Last 90 Days
                </option>

              </select>

            </div>

            <p className={styles.chartSubtitle}>
              Weekly Active Students
            </p>

            <div className={styles.chart}>

              {weeklyData.map(
                (item, index) => (

                  <div
                    key={index}
                    className={
                      styles.barContainer
                    }
                  >

                    <div
                      className={
                        styles.bar
                      }
                      style={{
                        height:
                          `${(item.value / maxValue) * 100}%`,
                      }}
                    >

                      <span
                        className={
                          styles.barValue
                        }
                      >

                        {item.value > 500

                          ? `${(item.value / 1000).toFixed(1)}k`

                          : Math.round(
                              item.value
                            )}

                      </span>

                    </div>

                    <span
                      className={
                        styles.barLabel
                      }
                    >
                      {item.day}
                    </span>

                  </div>

                )
              )}

            </div>

            <div className={styles.chartStats}>

              <div className={styles.statItem}>

                <span
                  className={
                    styles.statDot
                  }
                  style={{
                    background:
                      "#667eea",
                  }}
                />

                <span>
                  Active Students
                </span>

              </div>

              <div className={styles.statItem}>

                <span
                  className={
                    styles.statHighlight
                  }
                >

                  {
                    collegeData.students
                      .length
                  }

                  +

                </span>

              </div>

            </div>

          </div>

          {/* JOIN REQUESTS */}

          <JoinRequests
            requests={joinRequests}
          />

          {/* TOP TEACHERS */}

          <div className={styles.teacherCard}>

            <div className={styles.cardHeader}>

              <h3>
                Top Teachers
              </h3>

              <span className={styles.badge}>
                Top Rated
              </span>

            </div>

            <div className={styles.teacherList}>

              {topTeachers
                .slice(0, 3)
                .map(
                  (
                    teacher,
                    index
                  ) => (

                    <div
                      key={index}
                      className={
                        styles.teacherItem
                      }
                    >

                      <div
                        className={
                          styles.teacherAvatar
                        }
                      >
                        {teacher.name.charAt(
                          0
                        )}
                      </div>

                      <div
                        className={
                          styles.teacherInfo
                        }
                      >

                        <span
                          className={
                            styles.teacherName
                          }
                        >
                          {
                            teacher.name
                          }
                        </span>

                        <span
                          className={
                            styles.teacherDept
                          }
                        >
                          {
                            teacher.dept
                          }
                        </span>

                      </div>

                      <div
                        className={
                          styles.teacherScore
                        }
                      >
                        {
                          teacher.score
                        }
                        %
                      </div>

                    </div>

                  )
                )}

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className={styles.tableCard}>

          <div className={styles.cardHeader}>

            <h3>
              Department Performance
            </h3>

            <button
              className={
                styles.moreBtn
              }
            >
              •••
            </button>

          </div>

          <table className={styles.table}>

            <thead>

              <tr>

                <th>Rank</th>

                <th>Department</th>

                <th>Avg GPA</th>

                <th>Faculty</th>

                <th>Students</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {departmentData.map(
                (department) => (

                  <tr
                    key={
                      department.rank
                    }
                  >

                    <td>
                      {
                        department.rank
                      }
                    </td>

                    <td>
                      {
                        department.name
                      }
                    </td>

                    <td>
                      {
                        department.avgGPA
                      }
                    </td>

                    <td>
                      {
                        department.faculty
                      }
                    </td>

                    <td>
                      {
                        department.students
                      }
                    </td>

                    <td>

                      <span
                        className={
                          styles.statusActive
                        }
                      >
                        •{" "}
                        {
                          department.status
                        }
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          <button
            className={
              styles.viewFullBtn
            }
          >
            View Full List →
          </button>

        </div>

        {/* ACTIVITY */}

        <div className={styles.activityCard}>

          <div className={styles.cardHeader}>

            <h3>
              Recent Activities
            </h3>

          </div>

          <div className={styles.activityList}>

            <div className={styles.activityItem}>

              <div className={styles.activityDot} />

              <div className={styles.activityInfo}>

                <span
                  className={
                    styles.activityTitle
                  }
                >
                  New students joined
                  college
                </span>

                <span
                  className={
                    styles.activityTime
                  }
                >
                  Today
                </span>

              </div>

            </div>

            <div className={styles.activityItem}>

              <div className={styles.activityDot} />

              <div className={styles.activityInfo}>

                <span
                  className={
                    styles.activityTitle
                  }
                >
                  Faculty registrations
                  approved
                </span>

                <span
                  className={
                    styles.activityTime
                  }
                >
                  2 hours ago
                </span>

              </div>

            </div>

            <div className={styles.activityItem}>

              <div className={styles.activityDot} />

              <div className={styles.activityInfo}>

                <span
                  className={
                    styles.activityTitle
                  }
                >
                  Analytics synced
                </span>

                <span
                  className={
                    styles.activityTime
                  }
                >
                  Auto updated
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className={styles.bottomGrid}>

          {/* LEADERBOARD */}

          <div className={styles.leaderboardCard}>

            <div className={styles.cardHeader}>

              <h3>
                Teacher Leaderboard
              </h3>

            </div>

            <div className={styles.leaderList}>

              {topTeachers.map(
                (
                  teacher,
                  index
                ) => (

                  <div
                    key={index}
                    className={
                      styles.leaderItem
                    }
                  >

                    <div
                      className={
                        styles.leaderAvatar
                      }
                    >
                      {teacher.name.charAt(
                        0
                      )}
                    </div>

                    <div
                      className={
                        styles.leaderInfo
                      }
                    >

                      <span
                        className={
                          styles.leaderName
                        }
                      >
                        {
                          teacher.name
                        }
                      </span>

                      <span
                        className={
                          styles.leaderDept
                        }
                      >
                        {
                          teacher.dept
                        }
                      </span>

                    </div>

                    <div
                      className={
                        styles.leaderScore
                      }
                    >

                      <span
                        className={
                          styles.score
                        }
                      >
                        {
                          teacher.score
                        }
                      </span>

                      <span
                        className={
                          styles.change
                        }
                      >
                        {
                          teacher.change
                        }
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          {/* DISTRIBUTION */}

          <div className={styles.distributionCard}>

            <div className={styles.cardHeader}>

              <h3>
                Department
                Distribution
              </h3>

            </div>

            <div
              className={
                styles.distributionContent
              }
            >

              <div
                className={
                  styles.teacherProfile
                }
              >

                <div
                  className={
                    styles.profileAvatar
                  }
                >
                  AJ
                </div>

                <div
                  className={
                    styles.profileInfo
                  }
                >

                  <span
                    className={
                      styles.profileName
                    }
                  >
                    Alice Johnson
                  </span>

                  <span
                    className={
                      styles.profileDept
                    }
                  >
                    CSE
                  </span>

                </div>

              </div>

              <div
                className={
                  styles.deptList
                }
              >

                {collegeData.departments
                  .slice(0, 4)
                  .map(
                    (
                      department,
                      index
                    ) => (

                      <div
                        key={index}
                        className={
                          styles.deptItem
                        }
                      >

                        <span
                          className={
                            styles.deptDot
                          }
                          style={{
                            background:
                              [
                                "#667eea",
                                "#a855f7",
                                "#22c55e",
                                "#f59e0b",
                              ][index],
                          }}
                        />

                        <span>
                          {
                            department
                          }
                        </span>

                        <span>

                          {Math.floor(
                            20 +
                              Math.random() *
                                30
                          )}

                          %

                        </span>

                      </div>

                    )
                  )}

              </div>

              <div
                className={
                  styles.gpaCircle
                }
              >

                <span
                  className={
                    styles.gpaValue
                  }
                >
                  8.7
                </span>

                <span
                  className={
                    styles.gpaLabel
                  }
                >
                  +80%
                </span>

              </div>

            </div>

            <button
              className={
                styles.viewFullBtn
              }
            >
              View Full List →
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );
}

export default AdminDashboard;