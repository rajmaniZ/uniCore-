import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";
import { getRoleSubjects } from "../../utils/configRuntime";
import styles from "./subjects.module.css";

function Subjects() {
  const { user, token } = useAuth();
  const [institute, setInstitute] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [activeSubjectId, setActiveSubjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user?._id) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [instituteData, config] = await Promise.all([
          getMyInstitute(),
          getInstituteConfig(),
        ]);

        const roleSubjects = getRoleSubjects(config, user);
        setInstitute(instituteData);
        setSubjects(roleSubjects);
        setActiveSubjectId(roleSubjects[0]?._id || "");
      } catch (err) {
        console.error("Subject load error:", err.response?.data || err);
        setError(err.response?.data?.msg || err.message || "Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user]);

  const activeSubject = useMemo(
    () => subjects.find((subject) => subject._id === activeSubjectId) || subjects[0],
    [activeSubjectId, subjects]
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Subjects</h2>

      {error ? <p>{error}</p> : null}

      <div className={styles.tabs}>
        {subjects.map((subject) => (
          <button
            key={subject._id}
            type="button"
            className={activeSubject?._id === subject._id ? styles.activeTab : styles.tab}
            onClick={() => setActiveSubjectId(subject._id)}
          >
            {subject.name}
          </button>
        ))}
      </div>

      {!activeSubject && <p>No subjects found</p>}

      {activeSubject && (
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.card}>
              <h3>{activeSubject.name}</h3>
              <p>{activeSubject.syllabus || "No syllabus added"}</p>
              <div className={styles.stats}>
                <span>{activeSubject.code || "No code"}</span>
                <span>
                  {activeSubject.classId
                    ? institute?.type === "school"
                      ? "Class Subject"
                      : activeSubject.type || "Subject"
                    : activeSubject.semester
                      ? `Semester ${activeSubject.semester}`
                      : activeSubject.type || "Subject"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.card}>
              <h4>Resources</h4>
              {activeSubject.resources?.length ? (
                activeSubject.resources.map((resource) => (
                  <a key={resource._id || resource.url} href={resource.url} target="_blank" rel="noreferrer">
                    {resource.title || resource.url}
                  </a>
                ))
              ) : (
                <p>No resources added</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;
