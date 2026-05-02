import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import StatsCard from "../../component/stats/stats/statsCard";
import styles from "./dashboard.module.css";

import Loader from "../../../../component/loader/loader";

import { roleConfig } from "../../config/roleConfig";

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

const Icons = {
  dashboard: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" /></svg>,
  users: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z" /></svg>,
  building: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12ZM6 19H4v-2h2v2Zm0-4H4v-2h2v2Zm0-4H4V9h2v2Zm0-4H4V5h2v2Zm4 12H8v-2h2v2Zm0-4H8v-2h2v2Zm0-4H8V9h2v2Zm0-4H8V5h2v2Zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10Z" /></svg>,
  book: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2ZM6 4h5v8l-2.5-1.5L6 12V4Z" /></svg>,
  clipboard: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Zm2 14H7v-2h7v2Zm3-4H7v-2h10v2Zm0-4H7V7h10v2Z" /></svg>,
  checkSquare: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z" /></svg>,
  calendar: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H5V8h14v11Z" /></svg>,
  settings: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.28 7.28 0 0 0-1.69-.98L14.5 2.42A.49.49 0 0 0 14 2h-4c-.25 0-.46.18-.5.42L9.13 5.07c-.61.25-1.18.59-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.08.65-.08.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.13.22.39.31.61.22l2.49-1c.51.4 1.08.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.61-.25 1.18-.58 1.69-.98l2.49 1c.23.08.48 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" /></svg>,
  userPlus: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4ZM6 10V7H4v3H1v2h3v3h2v-3h3v-2H6Zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" /></svg>,
  chalkboard: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3ZM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" /></svg>,
  user: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" /></svg>,
  logout: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 7 15.59 8.41 18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5-5-5ZM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5Z" /></svg>,
};

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
    return <Loader/>;
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
        <StatsCard 
        title="Students" value={stats.students}/>
        <StatsCard title="Teachers" value={stats.teachers} />
        <StatsCard
          title={data.institute?.type === "school" ? "Classes" : "Courses"}
          value={data.institute?.type === "school" ? stats.classes : stats.courses}
          color="purple"
        />
        <StatsCard title="Subjects" value={stats.subjects}/>
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
