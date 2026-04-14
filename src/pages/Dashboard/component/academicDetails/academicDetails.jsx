import styles from './academicDetails.module.css';

function AcademicDetails({ student }) {
  if (!student) return <p className={styles.empty}>No Data</p>;

  return (
    <div className={styles.card}>
      <h3>Academic Details</h3>

      <div className={styles.row}>
        <span>Branch:</span>
        <span>{student.branch}</span>
      </div>

      <div className={styles.row}>
        <span>Year:</span>
        <span>{student.year}</span>
      </div>

      <div className={styles.row}>
        <span>GPA:</span>
        <span>{student.gpa}</span>
      </div>
    </div>
  );
}

export default AcademicDetails;