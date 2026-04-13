import styles from "./subjects.module.css";

const months = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
];

// ✅ DEMO MARKS
const demoActive = ["2026-04-03", "2026-04-10", "2026-05-06"];
const demoHoliday = ["2026-04-14", "2026-05-01"];

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

  const subjects = ["CS301", "CS302"];
  const year = 2026;

  const getStatus = (dateStr) => {
    if (demoHoliday.includes(dateStr)) {
      return { type: "holiday" };
    }
    if (demoActive.includes(dateStr)) {
      return { type: "active" };
    }
    return { type: "empty" };
  };

  return (
    <div className={styles.container}>

      {subjects.map(subject => (
        <div key={subject} className={styles.card}>

          <div className={styles.header}>
            <h3>{subject}</h3>
            <span>Prof. John Smith</span>
          </div>

          <div className={styles.wrapper}>

            {/* DAYS */}
            <div className={styles.days}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* MONTHS */}
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
                              const status = getStatus(dateStr);

                              return (
                                <div
                                  key={rIdx}
                                  className={`${styles.box}
                                    ${status.type === "active" ? styles.green : ""}
                                    ${status.type === "holiday" ? styles.red : ""}
                                  `}
                                  style={{
                                    marginTop:
                                      cIdx === 0 && rIdx === start
                                        ? `${start * 24}px`
                                        : "0px"
                                  }}
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