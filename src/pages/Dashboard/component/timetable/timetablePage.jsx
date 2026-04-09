// import { useState } from "react";
// import { useAuth } from "./../../context/AuthContext";
// import styles from "./timetable.module.css";

// const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// const timeSlots = [
//   "9:00-10:00",
//   "10:00-11:00",
//   "11:00-12:00",
//   "12:00-1:00",
//   "2:00-3:00",
//   "3:00-4:00"
// ];

// function TimetablePage() {
//   const { currentUser } = useAuth();
//   const role = currentUser?.role?.toLowerCase();

//   const [timetable, setTimetable] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   const [form, setForm] = useState({
//     className: "",
//     day: "Monday",
//     time: "9:00-10:00",
//     subject: "",
//     teacher: ""
//   });

//   // 🔥 ROLE FILTERING
//   let filtered = timetable;

//   if (role === "student") {
//     filtered = timetable.filter(
//       t => t.className === currentUser.class
//     );
//   }

//   if (role === "teacher") {
//     filtered = timetable.filter(
//       t => t.teacher === currentUser.name
//     );
//   }

//   // 🔥 HANDLE INPUT
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // 🔥 ADD ENTRY
//   const handleAdd = () => {
//     const exists = timetable.find(
//       t =>
//         t.className === form.className &&
//         t.day === form.day &&
//         t.time === form.time
//     );

//     if (exists) {
//       alert("Time slot already occupied!");
//       return;
//     }

//     setTimetable(prev => [...prev, form]);

//     setForm({
//       className: "",
//       day: "Monday",
//       time: "9:00-10:00",
//       subject: "",
//       teacher: ""
//     });

//     setShowForm(false);
//   };

//   // 🔥 GRID CELL
//   const getCell = (day, time) => {
//     return filtered.find(
//       t => t.day === day && t.time === time
//     );
//   };

//   return (
//     <div className={styles.container}>

//       {/* 🔥 CREATE BUTTON (TOP IF EMPTY) */}
//       {(role === "admin" || role === "hod") && timetable.length === 0 && (
//         <>
//           {!showForm ? (
//             <button
//               className={styles.createBtn}
//               onClick={() => setShowForm(true)}
//             >
//               + Create Timetable
//             </button>
//           ) : (
//             <div className={styles.createBox}>
//               <h3>Create Timetable</h3>

//               <input
//                 name="className"
//                 placeholder="Class (CSE-3)"
//                 value={form.className}
//                 onChange={handleChange}
//               />

//               <select name="day" value={form.day} onChange={handleChange}>
//                 {days.map(d => <option key={d}>{d}</option>)}
//               </select>

//               <select name="time" value={form.time} onChange={handleChange}>
//                 {timeSlots.map(t => <option key={t}>{t}</option>)}
//               </select>

//               <input
//                 name="subject"
//                 placeholder="Subject"
//                 value={form.subject}
//                 onChange={handleChange}
//               />

//               <input
//                 name="teacher"
//                 placeholder="Teacher"
//                 value={form.teacher}
//                 onChange={handleChange}
//               />

//               <button onClick={handleAdd}>Add</button>
//               <button onClick={() => setShowForm(false)}>Cancel</button>
//             </div>
//           )}
//         </>
//       )}

//       {/* 🔥 WEEKLY GRID */}
//       <div className={styles.grid}>
//         <div className={styles.header}></div>

//         {days.map(day => (
//           <div key={day} className={styles.header}>
//             {day}
//           </div>
//         ))}

//         {timeSlots.map(time => (
//           <div key={time} style={{ display: "contents" }}>
//             <div className={styles.time}>{time}</div>

//             {days.map(day => {
//               const cell = getCell(day, time);

//               return (
//                 <div key={day + time} className={styles.cell}>
//                   {cell ? (
//                     <>
//                       <strong>{cell.subject}</strong>
//                       <span>{cell.teacher}</span>
//                       <small>{cell.className}</small>
//                     </>
//                   ) : (
//                     <span className={styles.empty}>—</span>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>

//       {/* 🔥 ADD MORE (BOTTOM IF EXISTS) */}
//       {(role === "admin" || role === "hod") && timetable.length > 0 && (
//         <div className={styles.addMore}>
//           <button
//             className={styles.createBtn}
//             onClick={() => setShowForm(!showForm)}
//           >
//             {showForm ? "Close" : "+ Add More"}
//           </button>

//           {showForm && (
//             <div className={styles.createBox}>
//               <input
//                 name="className"
//                 value={form.className}
//                 onChange={handleChange}
//                 placeholder="Class"
//               />

//               <select name="day" value={form.day} onChange={handleChange}>
//                 {days.map(d => <option key={d}>{d}</option>)}
//               </select>

//               <select name="time" value={form.time} onChange={handleChange}>
//                 {timeSlots.map(t => <option key={t}>{t}</option>)}
//               </select>

//               <input
//                 name="subject"
//                 value={form.subject}
//                 onChange={handleChange}
//                 placeholder="Subject"
//               />

//               <input
//                 name="teacher"
//                 value={form.teacher}
//                 onChange={handleChange}
//                 placeholder="Teacher"
//               />

//               <button onClick={handleAdd}>Add</button>
//             </div>
//           )}
//         </div>
//       )}

//     </div>
//   );
// }

// export default TimetablePage;





import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./timetable.module.css";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const timeSlots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-1:00",
  "2:00-3:00",
  "3:00-4:00"
];

function TimetablePage() {
  const { currentUser } = useAuth();
  const role = currentUser?.role?.toLowerCase();

  const [allTables, setAllTables] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [meta, setMeta] = useState({
    department: "",
    year: "",
    semester: "",
    className: ""
  });

  // 🔥 GRID FORM STATE
  const [grid, setGrid] = useState({});

  // 🔥 HANDLE GRID CHANGE
  const handleCellChange = (day, time, value) => {
    setGrid(prev => ({
      ...prev,
      [`${day}_${time}`]: value
    }));
  };
  const departments = ["CSE", "ECE", "ME"];
const years = ["1", "2", "3", "4"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const classes = [
  "CSE-1", "CSE-2", "CSE-3",
  "ECE-1", "ECE-2"
];


  // 🔥 SAVE FULL TIMETABLE
const handleSave = () => {
  if (!meta.className) return alert("Select class");

  // ❌ Prevent duplicate class timetable
  const exists = allTables.find(
    t => t.meta.className === meta.className
  );

  if (exists) {
    alert("Timetable already exists for this class!");
    return;
  }

  setAllTables(prev => [...prev, { meta, grid }]);

  setMeta({
    department: "",
    year: "",
    semester: "",
    className: ""
  });

  setGrid({});
  setShowForm(false);
};
  // 🔥 FILTERING
  let visibleTables = allTables;

  if (role === "student") {
    visibleTables = allTables.filter(
      t => t.meta.className === currentUser.class
    );
  }

  if (role === "teacher") {
    visibleTables = allTables.filter(t =>
      Object.values(t.grid).some(val =>
        val?.toLowerCase().includes(currentUser.name.toLowerCase())
      )
    );
  }

  return (
    <div className={styles.container}>

      {/* 🔥 CREATE BUTTON */}
      {(role === "admin" || role === "hod") && (
        <button
          className={styles.createBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "+ Add Class Timetable"}
        </button>
      )}

      {/* 🔥 CREATE FORM */}
      {showForm && (
        <div className={styles.createBox}>
          <h3>Create Class Timetable</h3>

          {/* META INFO */}
          <div className={styles.meta}>

  <select
    value={meta.department}
    onChange={(e) =>
      setMeta({ ...meta, department: e.target.value })
    }
  >
    <option value="">Department</option>
    {departments.map(d => (
      <option key={d}>{d}</option>
    ))}
  </select>

  <select
    value={meta.year}
    onChange={(e) =>
      setMeta({ ...meta, year: e.target.value })
    }
  >
    <option value="">Year</option>
    {years.map(y => (
      <option key={y}>{y}</option>
    ))}
  </select>

  <select
    value={meta.semester}
    onChange={(e) =>
      setMeta({ ...meta, semester: e.target.value })
    }
  >
    <option value="">Semester</option>
    {semesters.map(s => (
      <option key={s}>{s}</option>
    ))}
  </select>

  <select
    value={meta.className}
    onChange={(e) =>
      setMeta({ ...meta, className: e.target.value })
    }
  >
    <option value="">Class</option>
    {classes.map(c => (
      <option key={c}>{c}</option>
    ))}
  </select>

</div>
          {/* GRID INPUT */}
          <div className={styles.grid}>
            <div></div>
            {days.map(day => <div key={day} className={styles.header}>{day}</div>)}

            {timeSlots.map(time => (
              <div key={time} style={{ display:"contents" }}>
                <div className={styles.time}>{time}</div>

                {days.map(day => (
                  <input
                    key={day+time}
                    className={styles.cellInput}
                    placeholder="Subject / Teacher"
                    value={grid[`${day}_${time}`] || ""}
                    onChange={(e)=>handleCellChange(day,time,e.target.value)}
                  />
                ))}
              </div>
            ))}
          </div>

          <button onClick={handleSave}>Save Timetable</button>
        </div>
      )}

      {/* 🔥 DISPLAY TABLES */}
      {visibleTables.map((table, idx) => (
        <div key={idx} className={styles.tableBox}>

          {/* 🔥 CAPTION */}
          <div className={styles.caption}>
            <h3>{table.meta.className}</h3>
            <span>{table.meta.department}</span>
            <span>Year {table.meta.year}</span>
            <span>Sem {table.meta.semester}</span>
          </div>

          {/* GRID */}
          <div className={styles.grid}>
            <div></div>
            {days.map(day => <div key={day} className={styles.header}>{day}</div>)}

            {timeSlots.map(time => (
              <div key={time} style={{ display:"contents" }}>
                <div className={styles.time}>{time}</div>

                {days.map(day => {
                  const val = table.grid[`${day}_${time}`];

                  return (
                    <div key={day+time} className={styles.cell}>
                      {val || "—"}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}

export default TimetablePage;