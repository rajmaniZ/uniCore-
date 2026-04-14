import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/dataContext';
// import DashboardLayout from '../../component/Dashboardlayout/Dashboardlayout';
import StatsCard from '../../component/stats/stats/statsCard';
import JoinRequests from '../../component/joinRequests/joinRequests';
import styles from './dashboard.module.css';

function TeacherDashboard() {
  const { currentUser, joinRequests } = useAuth();
  const { students, assignments, submissions, attendance } = useData();
  const [activeClass, setActiveClass] = useState(currentUser?.classes?.[0] || 'CSE-1');

  // Filter data by teacher's classes
  const teacherData = useMemo(() => {
    const teacherClasses = currentUser?.classes || [];
    const teacherSubjects = currentUser?.subjects || [];

    const classStudents = students.filter(s => teacherClasses.includes(s.class));
    const classAssignments = assignments.filter(a => teacherClasses.includes(a.class));
    const classAttendance = attendance.filter(a => teacherClasses.includes(a.class));

    const pendingSubmissions = classAssignments.reduce((acc, assignment) => {
      const submitted = submissions.filter(s => s.assignmentId === assignment._id);
      const pending = classStudents.length - submitted.length;
      return acc + pending;
    }, 0);

    return {
      students: classStudents,
      assignments: classAssignments,
      attendance: classAttendance,
      subjects: teacherSubjects,
      pendingSubmissions,
    };
  }, [currentUser, students, assignments, submissions, attendance]);

  // Weekly chart data
  const weeklyData = [
    { day: 'Sat', value: 55 },
    { day: 'Sat', value: 60 },
    { day: 'Sun', value: 65 },
    { day: 'Mon', value: 72 },
    { day: 'Tue', value: 85 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 100 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  // Top students
  const topStudents = [
    { name: 'Alice Johnson', gpa: 89, change: '+8.2' },
    { name: 'David Lee', gpa: 85, change: '+8.3' },
  ];

  // Assignment insights
  const assignmentInsights = [
    { subject: 'DSA', pending: 3 },
    { subject: 'OS', pending: 2, note: 'Pending in next 3 days' },
  ];

  return (
    < >
      <div className={styles.dashboard}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.greeting}>Welcome, Professor {currentUser?.name?.split(' ')[0] || 'Teacher'}</h1>
            <p className={styles.subtitle}>Here's your department overview</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <StatsCard
            title="Total Students"
            value={teacherData.students.length.toString()}
            change="6"
            changeType="positive"
            color="blue"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            }
          />
          <StatsCard
            title="Total Teachers"
            value={currentUser?.subjects?.join(', ') || 'DSA, OS, DBMS, AI'}
            color="purple"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
            }
          />
          <StatsCard
            title="Pending Requests"
            value={teacherData.pendingSubmissions.toString()}
            change="2%"
            changeType="positive"
            color="orange"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/>
              </svg>
            }
          />
          <StatsCard
            title="Assignments"
            value={teacherData.assignments.length.toString()}
            color="green"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Class Overview */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Class Overview</h3>
              <select className={styles.select}>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <p className={styles.chartSubtitle}>Branch-wise Student Distribution</p>
            
            <div className={styles.chartChange}>↑ 8.5%</div>
            
            <div className={styles.chart}>
              {weeklyData.map((item, index) => (
                <div key={index} className={styles.barContainer}>
                  <div 
                    className={styles.bar}
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  />
                  <span className={styles.barLabel}>{item.day}</span>
                </div>
              ))}
            </div>

            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#667eea' }} />
                DSA 82
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#a855f7' }} />
                OS 58
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#22c55e' }} />
                AI 47
              </span>
              <span className={styles.semesterBadge}>↑ 2.5% Semester</span>
            </div>
          </div>

          {/* Teacher Performance */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Teacher Performance</h3>
              <div className={styles.tabs}>
                <span className={styles.tabActive}>Top Teachers</span>
                <span>Recent Activity</span>
              </div>
            </div>

            <div className={styles.performanceHeader}>
              <span className={styles.studentsLabel}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/>
                </svg>
                Students This Week
              </span>
              <span className={styles.changePositive}>8.5% +</span>
            </div>

            <div className={styles.studentList}>
              {topStudents.map((student, index) => (
                <div key={index} className={styles.studentItem}>
                  <div className={styles.studentAvatar}>
                    {student.name.charAt(0)}
                  </div>
                  <div className={styles.studentInfo}>
                    <span className={styles.studentName}>{student.name}</span>
                    <span className={styles.studentMeta}>GPA: {student.gpa}</span>
                  </div>
                  <div className={styles.studentScore}>
                    <span>{student.gpa}</span>
                    <span className={styles.scoreChange}>{student.change}</span>
                  </div>
                  <span className={styles.chevron}>›</span>
                </div>
              ))}
            </div>

            <button className={styles.viewFullBtn}>View Full List →</button>
          </div>

          {/* Recent Requests */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Recent Activity</h3>
              <span className={styles.moreBtn}>•••</span>
            </div>
            
            <div className={styles.recentList}>
              {[
                { name: 'John Doe', class: 'CSE-1', time: '15m ago', action: 'Accept' },
                { name: 'Jane Smith', class: 'DSA', time: '30m ago', action: 'Accept' },
                { name: 'Robert Brown', class: 'GPA: 89', time: '45 days ago', action: 'Reject' },
              ].map((item, index) => (
                <div key={index} className={styles.recentItem}>
                  <div className={styles.recentAvatar}>
                    {item.name.charAt(0)}
                  </div>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentName}>{item.name}</span>
                    <span className={styles.recentClass}>{item.class} • {item.time}</span>
                  </div>
                  <button className={`${styles.actionBtn} ${item.action === 'Reject' ? styles.rejectBtn : styles.acceptBtn}`}>
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomGrid}>
          {/* Assignment Insights */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Assignment Insights</h3>
              <span className={styles.dots}>••••</span>
            </div>
            <p className={styles.insightsSubtitle}>Last 7 days</p>

            <div className={styles.insightsStats}>
              <span className={styles.pendingBadge}>7 Pending</span>
              <span className={styles.completedBadge}>+18 Completed</span>
              <span className={styles.percentBadge}>• 4%</span>
            </div>

            <div className={styles.insightsChart}>
              {weeklyData.map((item, index) => (
                <div key={index} className={styles.insightBar}>
                  <div 
                    className={styles.insightBarFill}
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              ))}
            </div>

            <div className={styles.insightsList}>
              {assignmentInsights.map((insight, index) => (
                <div key={index} className={styles.insightItem}>
                  <span className={styles.insightDot} />
                  <span className={styles.insightSubject}>{insight.subject}</span>
                  <span className={styles.insightPending}>{insight.pending} Pending</span>
                  {insight.note && <span className={styles.insightNote}>{insight.note}</span>}
                </div>
              ))}
            </div>

            <div className={styles.totalBadge}>● 300</div>
            <button className={styles.viewFullBtn}>View Full List →</button>
          </div>

          {/* Join Requests */}
          <JoinRequests requests={joinRequests} />
        </div>
      </div>
    </ >
  );
}

export default TeacherDashboard;
