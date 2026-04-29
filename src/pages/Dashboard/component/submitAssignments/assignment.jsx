import { useEffect, useState } from "react";
import { getAssignments, submitAssignment } from "../../../../api/assignmentApi";
import { uploadSubmissionFile } from "../../../../api/uploadApi";
import { useAuth } from "../../../../context/authContext";
import styles from "./assignment.module.css";

export default function AssignmentStudent() {
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [fileMap, setFileMap] = useState({});
  const [textMap, setTextMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!token || !user?._id) return;

    const load = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data || []);
      } catch (err) {
        console.error("Assignment load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user?._id]);

  const handleSubmit = async (assignmentId) => {
    try {
      const file = fileMap[assignmentId];
      const text = textMap[assignmentId] || "";
      let fileData = {};

      if (!file && !text.trim()) {
        return alert("Add text or upload a file");
      }

      if (file) {
        fileData = await uploadSubmissionFile(file, setProgress);
      }

      await submitAssignment({
        assignmentId,
        text,
        ...fileData,
      });

      alert("Assignment submitted");
      setFileMap((prev) => ({ ...prev, [assignmentId]: null }));
      setTextMap((prev) => ({ ...prev, [assignmentId]: "" }));
      setProgress(0);
    } catch (err) {
      alert(err.response?.data?.msg || "Submission failed");
    }
  };

  if (loading) return <div className={styles.empty}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Assignments</h2>

      {assignments.length === 0 && <div className={styles.empty}>No assignments</div>}

      {assignments.map((assignment) => {
        const overdue = new Date() > new Date(assignment.deadline);

        return (
          <div key={assignment._id} className={styles.card}>
            <div className={styles.header}>
              <h3>{assignment.title}</h3>
              <span className={`${styles.badge} ${styles[assignment.label]}`}>
                {assignment.label}
              </span>
            </div>

            <p>{assignment.description}</p>

            <div className={styles.meta}>
              <span>{assignment.subject?.name || "Subject"}</span>
              <span>Deadline: {new Date(assignment.deadline).toLocaleDateString()}</span>
              {overdue && <span className={styles.deadline}>Overdue</span>}
            </div>

            {assignment.fileUrl && (
              <a href={assignment.fileUrl} target="_blank" rel="noreferrer">
                View attachment
              </a>
            )}

            {!overdue && (
              <div className={styles.submitBox}>
                <textarea
                  placeholder="Submission note"
                  value={textMap[assignment._id] || ""}
                  onChange={(e) =>
                    setTextMap((prev) => ({ ...prev, [assignment._id]: e.target.value }))
                  }
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setFileMap((prev) => ({ ...prev, [assignment._id]: e.target.files[0] }))
                  }
                />
                {progress > 0 && <span>{progress}%</span>}
                <button onClick={() => handleSubmit(assignment._id)}>Submit</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
