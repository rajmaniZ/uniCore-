import { useData } from '../../context/dataContext';
import { useAuth } from '../../context/AuthContext';
import styles from './studentList.module.css';

function StudentsList() {
  const { students } = useData();
  const { currentUser } = useAuth();

  const collegeStudents = students.filter(s => s.collegeId === currentUser?.collegeId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Students</h1>
          <p className={styles.subtitle}>Manage all enrolled students</p>
        </div>
        <button className={styles.addBtn}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Student
        </button>
      </div>

      <div className={styles.filters}>
        <input type="text" placeholder="Search students..." className={styles.searchInput} />
        <select className={styles.filterSelect}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">All Years</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No</th>
              <th>Branch</th>
              <th>Year</th>
              <th>GPA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collegeStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.emptyRow}>No students found</td>
              </tr>
            ) : (
              collegeStudents.slice(0, 20).map((student) => (
                <tr key={student._id}>
                  <td>
                    <div className={styles.studentCell}>
                      <div className={styles.avatar}>{student.name.charAt(0)}</div>
                      <div>
                        <span className={styles.studentName}>{student.name}</span>
                        <span className={styles.studentEmail}>{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.mono}>{student.rollNo}</td>
                  <td>
                    <span className={styles.branchBadge}>{student.branch}</span>
                  </td>
                  <td className={styles.center}>Year {student.year}</td>
                  <td>
                    <span className={`${styles.gpaBadge} ${parseFloat(student.gpa) >= 8.5 ? styles.gpaHigh : parseFloat(student.gpa) >= 7.5 ? styles.gpaMid : styles.gpaLow}`}>
                      {student.gpa}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${student.status === 'active' ? styles.active : styles.inactive}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.viewBtn}>View</button>
                      <button className={styles.editBtn}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.paginationInfo}>
          Showing 1-{Math.min(20, collegeStudents.length)} of {collegeStudents.length} students
        </span>
        <div className={styles.paginationBtns}>
          <button className={styles.pageBtn} disabled>Previous</button>
          <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default StudentsList;