
import { useEffect, useState } from "react";
import styles from "./attandence.module.css";
import { getAttendance } from "../../../../api/attandenceApi";
import { useAuth } from "../../../../context/authContext";
import Loader from './../../../../component/loader/loader';

const months = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
];

const holidays = ["2026-04-14", "2026-05-01"];

const getMonthDays = (year, monthIndex) => {
  const days = [];
  const date = new Date(year, monthIndex, 1);

  while (date.getMonth() === monthIndex) {
    if (date.getDay() !== 0) {
      days.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }

  return days;
};

function Subject() {
  const { user } = useAuth();

  const [attendanceMap, setAttendanceMap] = useState({});
  const [subjects, setSubjects] = useState([]);

  const year = new Date().getFullYear();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAttendance();

        const map = {};
        const subjectSet = new Set();

        data.forEach((entry) => {
          const date = new Date(entry.date).toISOString().split("T")[0];
          const subjectName = entry.subject?.name || "Unknown";

          subjectSet.add(subjectName);

          if (user.role === "student") {
            const record = entry.students.find(
              (s) => s.student._id === user._id
            );

            if (record) {
              map[`${subjectName}_${date}`] = record.status;
            }
          }

          if (user.role === "teacher") {
            map[`${subjectName}_${date}`] = "present";
          }
        });

        setAttendanceMap(map);
        setSubjects([...subjectSet]);

      } catch (err) {
        console.error("Attendance fetch error:", err);
      }
    };

    load();
  }, [user]);

  const getStatus = (subject, dateStr) => {
    if (holidays.includes(dateStr)) {
      return { type: "holiday" };
    }

    const key = `${subject}_${dateStr}`;
    const status = attendanceMap[key];

    if (status === "present") {
      return { type: "active" };
    }

    if (status === "absent") {
      return { type: "absent" };
    }

    return { type: "empty" };
  };

  return (
    <div className={styles.container}>

      {subjects.map(subject => (
        <div key={subject} className={styles.card}>

          <div className={styles.header}>
            <h3>{subject}</h3>
            <span>{user.role === "teacher" ? "Your Class" : "Attendance"}</span>
          </div>

          <div className={styles.wrapper}>

            {}
            <div className={styles.days}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {}
            <div className={styles.monthRow}>
              {months.map((m, idx) => {

                const monthIndex = new Date(`${m} 1, ${year}`).getMonth();
                const days = getMonthDays(year, monthIndex);

                return (
                  <div key={idx} className={styles.monthBlock}>

                    <div className={styles.grid}>
                      {(() => {

                        const columns = [];
                        const firstDay = new Date(year, monthIndex, 1);

                        let start = firstDay.getDay();
                        start = start === 0 ? 5 : start - 1;

                        let col = Array(6).fill(null);
                        let row = start;

                        days.forEach((d) => {
                          col[row] = d;
                          row++;

                          if (row === 6) {
                            columns.push(col);
                            col = Array(6).fill(null);
                            row = 0;
                          }
                        });

                        if (col.some(v => v !== null)) {
                          columns.push(col);
                        }

                        return columns.map((column, cIdx) => (
                          <div key={cIdx} className={styles.column}>
                            {column.map((d, rIdx) => {
                              if (!d) return null;

                              const dateStr = d.toISOString().split("T")[0];
                              const status = getStatus(subject, dateStr);

                              return (
                                <div
                                  key={rIdx}
                                  className={`${styles.box}
                                    ${status.type === "active" ? styles.green : ""}
                                    ${status.type === "holiday" ? styles.red : ""}
                                    ${status.type === "absent" ? styles.gray : ""}
                                  `}
                                >
                                  {d.getDate()}
                                </div>
                              );
                            })}
                          </div>
                        ));

                      })()}
                    </div>

                    <div className={styles.monthLabel}>{m}</div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default Subject;