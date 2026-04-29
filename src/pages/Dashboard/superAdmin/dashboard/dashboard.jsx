import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/dataContext';
import DashboardLayout from '../../component/Dashboardlayout/Dashboardlayout';
import StatsCard from './../../component/stats/stats/statsCard';
import JoinRequests from '../../component/joinRequests/joinRequests';
import styles from './dashboard.module.css';

function AdminDashboard() {
  const { currentUser, joinRequests } = useAuth();
  const { students, teachers, colleges } = useData();

  
  const collegeData = useMemo(() => {
    const collegeId = currentUser?.collegeId;
    return {
      students: students.filter(s => s.collegeId === collegeId),
      teachers: teachers.filter(t => t.collegeId === collegeId),
      pendingRequests: joinRequests.filter(r => r.status === 'pending'),
      departments: [...new Set(students.filter(s => s.collegeId === collegeId).map(s => s.branch))],
    };
  }, [currentUser, students, teachers, joinRequests]);

  
  const weeklyData = [
    { day: 'Fri', value: 150 },
    { day: 'Sat', value: 280 },
    { day: 'Sat', value: 350 },
    { day: 'Sun', value: 420 },
    { day: 'Mon', value: 550 },
    { day: 'Tue', value: 720 },
    { day: 'Wed', value: 890 },
    { day: 'Thu', value: 1200 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  
  const departmentData = [
    { rank: 1, name: 'Computer Science', avgGPA: 8.8, faculty: 35, students: 1250, status: 'Active' },
    { rank: 2, name: 'Electronics', avgGPA: 8.3, faculty: 28, students: 990, status: 'Active' },
    { rank: 3, name: 'Mechanical', avgGPA: 8.1, faculty: 20, students: 810, status: 'Active' },
    { rank: 4, name: 'Civil', avgGPA: 7.9, faculty: 18, students: 600, status: 'Active' },
  ];

  
  const topTeachers = [
    { name: 'Alice Johnson', dept: 'CSE-1', score: 89, change: '+8.8%' },
    { name: 'David Lee', dept: 'ME-1', score: 85, change: '+3.7%' },
    { name: 'John Smith', dept: 'IT-6', score: 85, change: '+3.7%' },
    { name: 'Catherine Wang', dept: 'CE', score: 83, change: '+8.0%' },
  ];

  return (
    <>
      <div className={styles.dashboard}>
        {}
        <div className={styles.header}>
          <div>
            <h1 className={styles.greeting}>Welcome, Admin</h1>
            <p className={styles.subtitle}>Here's your college analytics overview</p>
          </div>
        </div>

        {}
        <div className={styles.statsGrid}>
          <StatsCard
            title="Total Students"
            value={collegeData.students.length.toLocaleString()}
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
            title="Total Teachers"
            value={collegeData.teachers.length.toString()}
            change="2.5%"
            changeType="positive"
            color="purple"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
            }
          />
          <StatsCard
            title="Departments"
            value={collegeData.departments.length.toString()}
            color="green"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
              </svg>
            }
          />
          <StatsCard
            title="Join Requests"
            value={collegeData.pendingRequests.length.toString()}
            color="orange"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            }
          />
        </div>

        {}
        <div className={styles.mainGrid}>
          {}
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3>College Overview</h3>
              <select className={styles.select}>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <p className={styles.chartSubtitle}>Weekly Active Students</p>
            
            <div className={styles.chart}>
              {weeklyData.map((item, index) => (
                <div key={index} className={styles.barContainer}>
                  <div 
                    className={styles.bar}
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  >
                    <span className={styles.barValue}>{item.value > 500 ? `${(item.value/1000).toFixed(1)}k` : item.value}</span>
                  </div>
                  <span className={styles.barLabel}>{item.day}</span>
                </div>
              ))}
              <div className={styles.trendLine} />
            </div>

            <div className={styles.chartStats}>
              <div className={styles.statItem}>
                <span className={styles.statDot} style={{ background: '#667eea' }} />
                <span>1.2k This Week</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>35% CSE</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statHighlight}>7.1K Students ↑2,500</span>
              </div>
            </div>
          </div>

          {}
          <JoinRequests requests={joinRequests} />

          {}
          <div className={styles.teacherCard}>
            <div className={styles.cardHeader}>
              <h3>Top Teachers</h3>
              <span className={styles.badge}>↑ 350</span>
            </div>
            <div className={styles.teacherList}>
              {topTeachers.slice(0, 3).map((teacher, index) => (
                <div key={index} className={styles.teacherItem}>
                  <div className={styles.teacherAvatar}>
                    {teacher.name.charAt(0)}
                  </div>
                  <div className={styles.teacherInfo}>
                    <span className={styles.teacherName}>{teacher.name}</span>
                    <span className={styles.teacherDept}>{teacher.dept}</span>
                  </div>
                  <button className={styles.acceptBtn}>Accept</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Department Performance</h3>
            <button className={styles.moreBtn}>•••</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Department</th>
                <th>Avg GPA</th>
                <th>Faculty</th>
                <th>Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept) => (
                <tr key={dept.rank}>
                  <td>{dept.rank}</td>
                  <td>{dept.name}</td>
                  <td>{dept.avgGPA}</td>
                  <td>{dept.faculty}</td>
                  <td>{dept.students}</td>
                  <td>
                    <span className={styles.statusActive}>• {dept.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.viewFullBtn}>View Full List →</button>
        </div>

        {}
        <div className={styles.bottomGrid}>
          {}
          <div className={styles.leaderboardCard}>
            <div className={styles.cardHeader}>
              <h3>Teacher Leaderboard</h3>
            </div>
            <div className={styles.leaderList}>
              {topTeachers.map((teacher, index) => (
                <div key={index} className={styles.leaderItem}>
                  <div className={styles.leaderAvatar}>
                    {teacher.name.charAt(0)}
                  </div>
                  <div className={styles.leaderInfo}>
                    <span className={styles.leaderName}>{teacher.name}</span>
                    <span className={styles.leaderDept}>{teacher.dept}</span>
                  </div>
                  <div className={styles.leaderScore}>
                    <span className={styles.score}>{teacher.score}</span>
                    <span className={styles.change}>{teacher.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className={styles.distributionCard}>
            <div className={styles.cardHeader}>
              <h3>Teacher Leaderboard</h3>
            </div>
            <div className={styles.distributionContent}>
              <div className={styles.teacherProfile}>
                <div className={styles.profileAvatar}>AJ</div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>Alice Johnson</span>
                  <span className={styles.profileDept}>CSE</span>
                </div>
              </div>
              <div className={styles.deptList}>
                <div className={styles.deptItem}>
                  <span className={styles.deptDot} style={{ background: '#667eea' }} />
                  <span>CSE-1</span>
                  <span>38%</span>
                </div>
                <div className={styles.deptItem}>
                  <span className={styles.deptDot} style={{ background: '#a855f7' }} />
                  <span>ECE</span>
                  <span>28%</span>
                </div>
                <div className={styles.deptItem}>
                  <span className={styles.deptDot} style={{ background: '#22c55e' }} />
                  <span>Civil</span>
                  <span>17%</span>
                </div>
                <div className={styles.deptItem}>
                  <span className={styles.deptDot} style={{ background: '#f59e0b' }} />
                  <span>EE</span>
                  <span>10%</span>
                </div>
              </div>
              <div className={styles.gpaCircle}>
                <span className={styles.gpaValue}>8.7</span>
                <span className={styles.gpaLabel}>+80%</span>
              </div>
            </div>
            <button className={styles.viewFullBtn}>View Full List →</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
