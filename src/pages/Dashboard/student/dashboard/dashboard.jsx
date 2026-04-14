import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/dataContext';
import styles from './dashboard.module.css';

// SVG icon replacements for emojis
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const AssignmentIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
  </svg>
);

function StudentDashboard() {
  const { currentUser } = useAuth();
  const { assignments, submissions, getStudentAttendance, announcements } = useData();

  const studentData = useMemo(() => {
    const studentId = currentUser?._id;
    const studentClass = currentUser?.class;

    const myAssignments = assignments.filter(a => a.class === studentClass);
    const mySubmissions = submissions.filter(s => s.studentId === studentId);
    const myAttendance = getStudentAttendance(studentId);
    const myAnnouncements = announcements.filter(
      a => a.target === 'all' || a.targetClass === studentClass
    );
    const pendingAssignments = myAssignments.filter(
      a => !mySubmissions.some(s => s.assignmentId === a._id)
    );

    return {
      assignments: myAssignments,
      submissions: mySubmissions,
      attendance: myAttendance,
      announcements: myAnnouncements,
      pendingCount: pendingAssignments.length,
    };
  }, [currentUser, assignments, submissions, getStudentAttendance, announcements]);

  const weeklyPerformance = [
    { day: 'Fri', value: 75 },
    { day: 'Sat', value: 82 },
    { day: 'Sun', value: 78 },
    { day: 'Mon', value: 85 },
    { day: 'Tue', value: 90 },
    { day: 'Wed', value: 88 },
    { day: 'Thu', value: 95 },
  ];

  const gpaTrend = [
    { day: 'Fri', value: 8.2 },
    { day: 'Sat', value: 8.3 },
    { day: 'Sun', value: 8.4 },
    { day: 'Mon', value: 8.5 },
    { day: 'Tue', value: 8.6 },
    { day: 'Wed', value: 8.7 },
    { day: 'Thu', value: 8.75 },
  ];

  const recentActivity = [
    { title: 'DSA - Final Assignment', time: '1 hour ago' },
    { title: 'DBMS - Midterm Exam', time: '3 days ago' },
    { title: 'Operating Systems', time: '5 days ago' },
    { title: 'VLSI - Project Report', time: '2 weeks ago' },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            {currentUser?.name?.charAt(0) || 'S'}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{currentUser?.name || 'John Doe'}</h1>
            <p className={styles.details}>
              Student - {currentUser?.branch || 'CSE'} Year {currentUser?.year || '2'}
            </p>
            <p className={styles.meta}>
              Roll No: {currentUser?.rollNo || 'CSE2024001'} · {currentUser?.email}
            </p>
            <div className={styles.badges}>
              <span className={styles.activeBadge}>Active</span>
              <span className={styles.memberBadge}>Gold Member</span>
            </div>
          </div>
        </div>
        <button className={styles.editBtn}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Edit Profile
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainGrid}>
        {/* Personal Information + Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Personal Information</h3>
            <select className={styles.select}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoIconWrap}><PhoneIcon /></span>
              <span>{currentUser?.phone || '+91 98765 43210'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIconWrap}><LocationIcon /></span>
              <span>Branch: {currentUser?.branch || 'CSE'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIconWrap}><MailIcon /></span>
              <span>{currentUser?.email || 'student@abc.edu'}</span>
            </div>
          </div>
          <div className={styles.chartSection}>
            <div className={styles.chartChange}>+6.4%</div>
            <div className={styles.chart}>
              {weeklyPerformance.map((item, index) => (
                <div key={index} className={styles.barContainer}>
                  <div className={styles.bar} style={{ height: `${item.value}%` }} />
                  <span className={styles.barLabel}>{item.day}</span>
                </div>
              ))}
            </div>
            <div className={styles.chartLegend}>
              <span>7.1k</span>
              <span className={styles.legendDot}>2,500</span>
            </div>
          </div>
        </div>

        {/* GPA Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Academic Standing</h3>
            <div className={styles.tabs}>
              <span className={styles.tabActive}>GPA</span>
              <span>Rank</span>
            </div>
          </div>
          <div className={styles.gpaSection}>
            <div className={styles.gpaMain}>
              <span className={styles.gpaLabel}>GPA</span>
              <span className={styles.gpaValue}>{currentUser?.gpa || '8.75'}</span>
              <span className={styles.gpaGrade}>A+</span>
              <span className={styles.gpaChange}>+0.2%</span>
            </div>
            <p className={styles.gpaSubtext}>From Semester</p>
            <div className={styles.miniChart}>
              {gpaTrend.map((item, index) => (
                <div
                  key={index}
                  className={styles.miniBar}
                  style={{ height: `${(item.value / 10) * 100}%` }}
                />
              ))}
            </div>
            <div className={styles.miniLabels}>
              {gpaTrend.map((item, index) => (
                <span key={index}>{item.day}</span>
              ))}
            </div>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statIconWrap}><AssignmentIcon /></span>
              <span className={styles.statLabel}>Pending</span>
              <span className={styles.statSub}>{studentData.pendingCount} left</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{studentData.assignments.length}</span>
              <span className={styles.statLabel}>Assignments</span>
              <span className={styles.statSub}>{studentData.pendingCount} pending</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statIconWrap}><BookIcon /></span>
              <span className={styles.statValue}>{studentData.submissions.length}</span>
              <span className={styles.statSub}>Submitted</span>
            </div>
          </div>
          <button className={styles.viewReportsBtn}>View Full Reports →</button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomGrid}>
        {/* Announcements */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Announcements</h3>
          <div className={styles.announcementList}>
            {studentData.announcements.length === 0 ? (
              <p className={styles.emptyState}>No announcements</p>
            ) : (
              studentData.announcements.map((ann, index) => (
                <div key={index} className={styles.announcementItem}>
                  <div className={`${styles.priorityDot} ${styles[ann.priority]}`} />
                  <div className={styles.annInfo}>
                    <span className={styles.annTitle}>{ann.title}</span>
                    <span className={styles.annMessage}>{ann.message}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* GPA Trend */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>GPA Trend</h3>
          <div className={styles.trendChart}>
            <svg viewBox="0 0 300 100" className={styles.trendSvg}>
              <polyline
                fill="none"
                stroke="#667eea"
                strokeWidth="2"
                points={gpaTrend.map((item, index) =>
                  `${(index / (gpaTrend.length - 1)) * 280 + 10},${100 - (item.value - 7.5) * 80}`
                ).join(' ')}
              />
              {gpaTrend.map((item, index) => (
                <circle
                  key={index}
                  cx={(index / (gpaTrend.length - 1)) * 280 + 10}
                  cy={100 - (item.value - 7.5) * 80}
                  r="4"
                  fill="#667eea"
                />
              ))}
            </svg>
            <div className={styles.trendLabels}>
              {gpaTrend.map((item, index) => (
                <span key={index}>{item.day}</span>
              ))}
            </div>
          </div>
          <div className={styles.trendLegend}>
            <span className={styles.trendLegendItem}>
              <span className={styles.trendDot} style={{ background: '#667eea' }} />
              GPA {currentUser?.gpa || '8.75'}
            </span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIconBox}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                  </svg>
                </div>
                <div className={styles.activityInfo}>
                  <span className={styles.activityTitle}>{activity.title}</span>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;