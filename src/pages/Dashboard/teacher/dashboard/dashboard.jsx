import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import StatsCard from "../../component/stats/stats/statsCard";
import styles from "./dashboard.module.css";
import { getAssignments } from "../../../../api/assignmentApi";
import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";
import { getRoleSubjects } from "../../utils/configRuntime";

function TeacherDashboard() {
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [institute, setInstitute] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user?._id) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [assignmentData, instituteData, config] = await Promise.all([
          getAssignments(),
          getMyInstitute(),
          getInstituteConfig(),
        ]);

        setAssignments(Array.isArray(assignmentData) ? assignmentData : []);
        setInstitute(instituteData);
        setSubjects(getRoleSubjects(config, user));
      } catch (err) {
        console.error("Teacher dashboard error:", err.response?.data || err);
        setError(err.response?.data?.msg || err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user]);

  const upcoming = useMemo(
    () => assignments.filter((assignment) => new Date(assignment.deadline) >= new Date()),
    [assignments]
  );

  if (loading) {
    return <div className={styles.dashboard}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Welcome, {user?.name || "Teacher"}</h1>
        <p>{institute?.name || "Institute"} teaching overview</p>
      </div>

      {error ? (
        <section className={styles.card}>
          <p>{error}</p>
        </section>
      ) : null}

      <div className={styles.statsGrid}>
        <StatsCard title="Subjects" value={subjects.length} color="purple" />
        <StatsCard title="Assignments" value={assignments.length} color="green" />
        <StatsCard title="Upcoming" value={upcoming.length} color="orange" />
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.card}>
          <h3>Assigned Subjects</h3>
          <div className={styles.recentList}>
            {subjects.slice(0, 6).map((subject) => (
              <div key={subject._id} className={styles.recentItem}>
                <div className={styles.recentAvatar}>
                  {(subject.name || "S").charAt(0).toUpperCase()}
                </div>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>{subject.name}</span>
                  <span className={styles.recentClass}>
                    {subject.code || `Semester ${subject.semester || "-"}`}
                  </span>
                </div>
              </div>
            ))}
            {subjects.length === 0 && <p>No subjects assigned in config</p>}
          </div>
        </section>

        <section className={styles.card}>
          <h3>Recent Assignments</h3>
          <div className={styles.recentList}>
            {assignments.slice(0, 6).map((assignment) => (
              <div key={assignment._id} className={styles.recentItem}>
                <div className={styles.recentAvatar}>
                  {(assignment.title || "A").charAt(0).toUpperCase()}
                </div>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>{assignment.title}</span>
                  <span className={styles.recentClass}>
                    {assignment.subject?.name || "Subject"}
                  </span>
                </div>
              </div>
            ))}
            {assignments.length === 0 && <p>No assignments yet</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TeacherDashboard;
