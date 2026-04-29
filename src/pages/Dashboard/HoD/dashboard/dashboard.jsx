import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import StatsCard from "../../component/stats/stats/statsCard";
import styles from "../../admin/dashboard/dashboard.module.css";
import { getAssignments } from "../../../../api/assignmentApi";
import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";
import { getUsers } from "../../../../api/userAPI";
import { getRoleSubjects } from "../../utils/configRuntime";

function HodDashboard() {
  const { user, token } = useAuth();
  const [state, setState] = useState({
    institute: null,
    students: [],
    teachers: [],
    subjects: [],
    assignments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user?.departmentId) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const departmentId = user.departmentId?._id || user.departmentId;
        const [institute, config, students, teachers, assignments] =
          await Promise.all([
            getMyInstitute(),
            getInstituteConfig(),
            getUsers({ role: "student", departmentId }),
            getUsers({ role: "teacher", departmentId }),
            getAssignments(),
          ]);

        setState({
          institute,
          students: Array.isArray(students) ? students : [],
          teachers: Array.isArray(teachers) ? teachers : [],
          subjects: getRoleSubjects(config, user),
          assignments: Array.isArray(assignments) ? assignments : [],
        });
      } catch (err) {
        console.error("HOD dashboard error:", err.response?.data || err);
        setError(err.response?.data?.msg || err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user]);

  if (loading) {
    return <div className={styles.loader}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Welcome, {user?.name || "HOD"}</h1>
          <p className={styles.subtitle}>Department overview</p>
        </div>
      </div>

      {error ? (
        <section className={styles.card}>
          <p>{error}</p>
        </section>
      ) : null}

      <div className={styles.statsGrid}>
        <StatsCard title="Students" value={state.students.length} color="blue" />
        <StatsCard title="Teachers" value={state.teachers.length} color="green" />
        <StatsCard title="Subjects" value={state.subjects.length} color="purple" />
        <StatsCard title="Assignments" value={state.assignments.length} color="orange" />
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.card}>
          <h3>{state.institute?.name || "Institute"} Subjects</h3>
          <div className={styles.recentList}>
            {state.subjects.slice(0, 5).map((subject) => (
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
            {state.subjects.length === 0 && <p>No department subjects found</p>}
          </div>
        </section>

        <section className={styles.card}>
          <h3>Teachers</h3>
          <div className={styles.recentList}>
            {state.teachers.slice(0, 5).map((teacher) => (
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
            {state.teachers.length === 0 && <p>No teachers found</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HodDashboard;
