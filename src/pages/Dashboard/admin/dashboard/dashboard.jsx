import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/dataContext';
import StatsCard from '../../component/stats/stats/statsCard';
import JoinRequests from '../../component/joinRequests/joinRequests';
import styles from './dashboard.module.css';

function AdminDashboard() {
  const { currentUser, joinRequests } = useAuth();
  const { students, assignments, submissions, attendance } = useData();

  const adminData = useMemo(() => {
    const collegeId = currentUser?.collegeId;
    const collegeStudents = students.filter(s => s.collegeId === collegeId);
    const classAssignments = assignments.filter(a =>
      collegeStudents.some(s => s.class === a.class)
    );
    const pendingSubmissions = classAssignments.reduce((acc, assignment) => {
      const submitted = submissions.filter(s => s.assignmentId === assignment._id);
      const pending = collegeStudents.filter(s => s.class === assignment.class).length - submitted.length;
      return acc + Math.max(0, pending);
    }, 0);
    return {
      students: collegeStudents,
      assignments: classAssignments,
      pendingSubmissions,
    };
  }, [currentUser, students, assignments, submissions]);

  const weeklyData = [
    { day: 'Sat', value: 55 },
    { day: 'Sun', value: 60 },
    { day: 'Mon', value: 72 },
    { day: 'Tue', value: 85 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 95 },
    { day: 'Fri', value: 100 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  const topStudents = [
    { name: 'Alice Johnson', gpa: 89, change: '+8.2' },
    { name: 'David Lee', gpa: 85, change: '+8.3' },
  ];

  const assignmentInsights = [
    { subject: 'DSA', pending: 3 },
    { subject: 'OS', pending: 2, note: 'Pending in next 3 days' },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            Welcome, {currentUser?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className={styles.subtitle}>Here is your college administration overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatsCard
          title="Total Students"
          value={adminData.students.length.toString()}
          change="6.4%"
          changeType="positive"
          color="blue"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          }
        />
        <StatsCard
          title="Assignments"
          value={adminData.assignments.length.toString()}
          color="purple"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
            </svg>
          }
        />
        <StatsCard
          title="Pending Submissions"
          value={adminData.pendingSubmissions.toString()}
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
          title="Join Requests"
          value={joinRequests.filter(r => r.status === 'pending').length.toString()}
          color="green"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Class Overview Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Class Overview</h3>
            <select className={styles.select}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <p className={styles.chartSubtitle}>Branch-wise Student Distribution</p>
          <div className={styles.chartChange}>+8.5%</div>
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
            <span className={styles.semesterBadge}>+2.5% Semester</span>
          </div>
        </div>

        {/* Top Students */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Student Performance</h3>
            <div className={styles.tabs}>
              <span className={styles.tabActive}>Top Students</span>
              <span>Recent</span>
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
                <div className={styles.studentAvatar}>{student.name.charAt(0)}</div>
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

        {/* Recent Activity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Recent Activity</h3>
            <span className={styles.moreBtn}>•••</span>
          </div>
          <div className={styles.recentList}>
            {[
              { name: 'John Doe', detail: 'CSE-1', time: '15m ago', action: 'Accept' },
              { name: 'Jane Smith', detail: 'DSA', time: '30m ago', action: 'Accept' },
              { name: 'Robert Brown', detail: 'GPA: 89', time: '45d ago', action: 'Reject' },
            ].map((item, index) => (
              <div key={index} className={styles.recentItem}>
                <div className={styles.recentAvatar}>{item.name.charAt(0)}</div>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>{item.name}</span>
                  <span className={styles.recentClass}>{item.detail} · {item.time}</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${item.action === 'Reject' ? styles.rejectBtn : styles.acceptBtn}`}
                >
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
            <span className={styles.dots}>····</span>
          </div>
          <p className={styles.insightsSubtitle}>Last 7 days</p>
          <div className={styles.insightsStats}>
            <span className={styles.pendingBadge}>7 Pending</span>
            <span className={styles.completedBadge}>+18 Completed</span>
            <span className={styles.percentBadge}>4%</span>
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
          <div className={styles.totalBadge}>Total: 300</div>
          <button className={styles.viewFullBtn}>View Full List →</button>
        </div>

        {/* Join Requests */}
        <JoinRequests requests={joinRequests} />
      </div>
    </div>
  );
}

export default AdminDashboard;