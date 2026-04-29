import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import StatsCard from "../../component/stats/stats/statsCard";
import styles from "./dashboard.module.css";

import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";
import { getUsers } from "../../../../api/userAPI";
import { getRequests } from "../../../../api/requestApi";
import { getRoleConfigSummary } from "../../utils/configRuntime";

function AdminDashboard() {
  const { user, token } = useAuth();

  const [data, setData] = useState({
    institute: null,
    config: null,
    students: [],
    teachers: [],
    requests: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [institute, config, students, teachers, requests] =
          await Promise.all([
            getMyInstitute(),
            getInstituteConfig(),
            getUsers({ role: "student" }),
            getUsers({ role: "teacher" }),
            getRequests(),
          ]);

        setData({
          institute,
          config,
          students: Array.isArray(students) ? students : [],
          teachers: Array.isArray(teachers) ? teachers : [],
          requests: Array.isArray(requests) ? requests : [],
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data || err);
        setError(err.response?.data?.msg || err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user]);

  const stats = useMemo(
    () => ({
      students: data.students.length,
      teachers: data.teachers.length,
      ...getRoleConfigSummary(data.config, user),
    }),
    [data, user]
  );

  if (loading) {
    return <div className={styles.loader}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            Welcome, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className={styles.subtitle}>
            {data.institute?.name || "Institute"} overview
          </p>
        </div>
      </div>

      {error ? (
        <section className={styles.card}>
          <p>{error}</p>
        </section>
      ) : null}

      <div className={styles.statsGrid}>
        <StatsCard title="Students" value={stats.students} color="blue" />
        <StatsCard title="Teachers" value={stats.teachers} color="green" />
        <StatsCard
          title={data.institute?.type === "school" ? "Classes" : "Courses"}
          value={data.institute?.type === "school" ? stats.classes : stats.courses}
          color="purple"
        />
        <StatsCard title="Subjects" value={stats.subjects} color="orange" />
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.card}>
          <h3>Pending Requests</h3>
          <div className={styles.recentList}>
            {data.requests.slice(0, 5).map((request) => (
              <div key={request._id} className={styles.recentItem}>
                <div className={styles.recentAvatar}>
                  {(request.name || "R").charAt(0).toUpperCase()}
                </div>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>{request.name}</span>
                  <span className={styles.recentClass}>{request.role}</span>
                </div>
              </div>
            ))}
            {data.requests.length === 0 && <p>No pending requests</p>}
          </div>
        </section>

        <section className={styles.card}>
          <h3>Recent Students</h3>
          <div className={styles.recentList}>
            {data.students.slice(0, 5).map((student) => (
              <div key={student._id} className={styles.recentItem}>
                <div className={styles.recentAvatar}>
                  {(student.name || "S").charAt(0).toUpperCase()}
                </div>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>{student.name}</span>
                  <span className={styles.recentClass}>
                    {student.rollNumber || student.email}
                  </span>
                </div>
              </div>
            ))}
            {data.students.length === 0 && <p>No students found</p>}
          </div>
        </section>

        <section className={styles.card}>
          <h3>Recent Teachers</h3>
          <div className={styles.recentList}>
            {data.teachers.slice(0, 5).map((teacher) => (
              <div key={teacher._id} className={styles.recentItem}>
                <div className={styles.recentAvatar}>
                  {(teacher.name || "T").charAt(0).toUpperCase()}
                </div>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>{teacher.name}</span>
                  <span className={styles.recentClass}>
                    {teacher.employeeId || teacher.email}
                  </span>
                </div>
              </div>
            ))}
            {data.teachers.length === 0 && <p>No teachers found</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
