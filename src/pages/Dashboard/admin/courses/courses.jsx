import { useState } from 'react';
import { useData } from '../../config/context/dataContext';
import { useAuth } from '../../config/context/AuthContext';
import { subjectsMap } from '../../mockData/mockData';
import styles from './Courses.module.css';

function Courses() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('CSE');

  const branches = Object.keys(subjectsMap);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Courses</h1>
          <p className={styles.subtitle}>Manage curriculum and subject offerings</p>
        </div>
        <button className={styles.addBtn}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Course
        </button>
      </div>

      {/* Branch Tabs */}
      <div className={styles.tabs}>
        {branches.map(branch => (
          <button
            key={branch}
            className={`${styles.tab} ${activeTab === branch ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(branch)}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{branches.length}</span>
          <span className={styles.statLabel}>Departments</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>
            {Object.values(subjectsMap).reduce((acc, s) => acc + s.length, 0)}
          </span>
          <span className={styles.statLabel}>Total Subjects</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{subjectsMap[activeTab]?.length || 0}</span>
          <span className={styles.statLabel}>{activeTab} Subjects</span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className={styles.coursesGrid}>
        {(subjectsMap[activeTab] || []).map((subject, index) => (
          <div key={index} className={styles.courseCard}>
            <div className={styles.courseHeader}>
              <div className={styles.courseIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                </svg>
              </div>
              <span className={styles.courseCode}>{subject.code}</span>
            </div>
            <h3 className={styles.courseName}>{subject.name}</h3>
            <div className={styles.courseMeta}>
              <span className={styles.branchTag}>{activeTab}</span>
              <span className={styles.creditTag}>4 Credits</span>
            </div>
            <div className={styles.courseFooter}>
              <div className={styles.enrolledInfo}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span>45 enrolled</span>
              </div>
              <button className={styles.manageBtn}>Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;