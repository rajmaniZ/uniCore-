import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import StatsCard from "../../component/stats/stats/statsCard";
import styles from "../../admin/dashboard/dashboard.module.css";
import { getAssignments } from "../../../../api/assignmentApi";
import { getAttendance } from "../../../../api/attandenceApi";
import { getInstituteConfig } from "../../../../api/configApi";
import { getRoleSubjects } from "../../utils/configRuntime";

function StudentDashboard() {
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user?._id) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [assignmentData, attendanceData, config] = await Promise.all([
          getAssignments(),
          getAttendance(),
          getInstituteConfig(),
        ]);

        setAssignments(Array.isArray(assignmentData) ? assignmentData : []);
        setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
        setSubjects(getRoleSubjects(config, user));
      } catch (err) {
        console.error("Student dashboard error:", err.response?.data || err);
        setError(err.response?.data?.msg || err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user]);

  const attendanceStats = useMemo(() => {
    let present = 0;
    let total = 0;

    attendance.forEach((record) => {
      record.students?.forEach((entry) => {
        const studentId = entry.student?._id || entry.student;
        if (studentId === user?._id) {
          total += 1;
          if (entry.status === "present") present += 1;
        }
      });
    });

    return { present, total };
  }, [attendance, user?._id]);

  const pendingAssignments = useMemo(
    () => assignments.filter((assignment) => new Date(assignment.deadline) >= new Date()),
    [assignments]
  );

  if (loading) {
    return <div className={styles.loader}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Welcome, {user?.name || "Student"}</h1>
          <p className={styles.subtitle}>{user?.email}</p>
        </div>
      </div>

      {error ? (
        <section className={styles.card}>
          <p>{error}</p>
        </section>
      ) : null}

      <div className={styles.statsGrid}>
        <StatsCard title="Subjects" value={subjects.length} color="blue" />
        <StatsCard title="Pending" value={pendingAssignments.length} color="orange" />
        <StatsCard
          title="Attendance"
          value={
            attendanceStats.total
              ? `${Math.round((attendanceStats.present / attendanceStats.total) * 100)}%`
              : "0%"
          }
          color="green"
        />
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.card}>
          <h3>Enrolled Subjects</h3>
          <div className={styles.recentList}>
            {subjects.slice(0, 5).map((subject) => (
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
            {subjects.length === 0 && <p>No enrolled subjects found</p>}
          </div>
        </section>

        <section className={styles.card}>
          <h3>Assignments</h3>
          <div className={styles.recentList}>
            {assignments.slice(0, 5).map((assignment) => (
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
            {assignments.length === 0 && <p>No assignments found</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;
