import React from "react";
import style from "./Classes.module.css";

const ClassCard = ({ title, subtitle, students, teacher, time, highlight }) => (
  <div className={`${style.card} ${highlight ? style.highlight : ""}`}>
    
    {/* Header */}
    <div className={style.cardHeader}>
      <div className={style.icon}>📘</div>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>

    {/* Students */}
    <div className={style.students}>
      <h2>{students}</h2>
      <span>Students</span>
    </div>

    <hr />

    {/* Teacher */}
    <div className={style.teacher}>
      <div className={style.avatar}>👨‍🏫</div>
      <div>
        <h4>{teacher}</h4>
        <p>{time}</p>
      </div>
    </div>

    {/* Footer */}
    <div className={style.footer}>
      <span>View Class</span>
      <span>→</span>
    </div>

    {/* Notification badge */}
    {highlight && <div className={style.badge}>New</div>}
  </div>
);

function Classes() {
  return (
    <div className={style.container}>
      <div className={style.main}>

        {/* Header */}
        <div className={style.topBar}>
          <h1>Classes</h1>

          <div className={style.filters}>
            <select>
              <option>All Branches</option>
              <option>BCA</option>
              <option>B.Tech</option>
              <option>MCA</option>
            </select>

            <select>
              <option>Year</option>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        <div className={style.cardGrid}>
          <ClassCard
            title="CSE-1"
            subtitle="Computer Science"
            students={32}
            teacher="Dr. Mehta"
            time="2 minutes ago"
            highlight
          />

          <ClassCard
            title="DBMS"
            subtitle="Database Mgmt."
            students={45}
            teacher="Alex Johnson"
            time="1 hour ago"
          />

          <ClassCard
            title="ECE"
            subtitle="Operating Systems"
            students={28}
            teacher="Doug Patel"
            time="35 minutes ago"
          />

          <ClassCard
            title="MES-1"
            subtitle="Mechanical"
            students={24}
            teacher="Catherine Wang"
            time="2 days ago"
          />
        </div>

        {/* Bottom Section */}
        <div className={style.bottomSection}>
          
          {/* Attendance */}
          <div className={style.box}>
            <h3>Attendance Overview</h3>
            <div className={style.chart}>Chart Here</div>
            <p>84% School Average</p>
          </div>

          {/* Activity */}
          <div className={style.box}>
            <h3>Class Activity</h3>
            <ul>
              <li>📘 DSA Assignment Submitted <span>5 days ago</span></li>
              <li className={style.active}>📗 Midterm Preparation <span>Tomorrow</span></li>
              <li>📙 Exam Scheduled <span>2 weeks ago</span></li>
              <li className={style.active}>📕 Project Due Tomorrow</li>
            </ul>
          </div>

          {/* Leaderboard */}
          <div className={style.box}>
            <h3>Student Leaderboard</h3>
            <ul>
              <li><span>Alex Johnson</span><span>CSE-1</span></li>
              <li><span>Sarah Miller</span><span>ECE</span></li>
              <li><span>Jane Smith</span><span>ECE</span></li>
              <li><span>Rahul Sharma</span><span>MES-1</span></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Classes;