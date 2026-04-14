import { useData } from "../../context/dataContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./grades.module.css";

export default function Grades() {
  const { getStudentGrades } = useData(); // ✅ correct
  const { currentUser } = useAuth();

  // ✅ directly get grades
  const studentGrades = getStudentGrades(currentUser?.id) || [];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Grades</h2>

      {studentGrades.length === 0 ? (
        <p className={styles.noData}>No grades available</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Assignment</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Feedback</th>
            </tr>
          </thead>

          <tbody>
            {studentGrades.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.subject}</td>
                <td>{grade.title}</td>
                <td>{grade.marks}</td>
                <td className={getGradeClass(grade.grade)}>
                  {grade.grade}
                </td>
                <td>{grade.feedback || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// helper for coloring grade
function getGradeClass(grade) {
  switch (grade) {
    case "A":
      return styles.a;
    case "B":
      return styles.b;
    case "C":
      return styles.c;
    case "D":
      return styles.d;
    default:
      return styles.f;
  }
}