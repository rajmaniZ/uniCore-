import { useState } from "react";
import styles from "./AboutInstitute.module.css";

const departmentOptions = [
  "CSE", "IT", "ECE", "ME", "EE", "CE",
  "Science", "Arts", "Physical Education"
];

const courseMap = {
  IT:["B.tech","M.tech"],
  CSE:["B.tech","M.tech"],
  ECE:["B.tech","M.tech"],
  EE:["B.tech","M.tech"],
  ME:["B.tech","M.tech"],
  CE:["B.tech","M.tech"],
  Science: ["BSc", "MSc"],
  Arts: ["BA", "MA"],
  "Physical Education": ["BPED", "MPED"]
};

const subjectOptions = [
  { name: "Maths", code: "M101" },
  { name: "Physics", code: "P101" },
  { name: "DSA", code: "CS201" },
  { name: "History", code: "H101" }
];

const currentUser = {
  collegeCode: "ABC123"
};

function AboutCollege() {
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [duration, setDuration] = useState(4);
  const [system, setSystem] = useState("semester");
  const [semester, setSemester] = useState("");

  const [hod, setHod] = useState({
    name: "",
    email: "",
    empId: ""
  });

  const [config, setConfig] = useState({});

  // 🔹 ADD DEPARTMENT
  const addDepartment = () => {
    if (!department) return;

    setConfig((prev) => ({
      ...prev,
      [department]: {
        hod: {
          ...hod,
          collegeCode: currentUser.collegeCode
        },
        courses: {}
      }
    }));
  };

  // 🔹 ADD COURSE
  const addCourse = () => {
    if (!department || !course) return;

    const totalSem = system === "semester" ? duration * 2 : duration;

    let structure = {};
    for (let i = 1; i <= totalSem; i++) {
      structure[i] = { subjects: [] };
    }

    setConfig((prev) => ({
      ...prev,
      [department]: {
        ...prev[department],
        courses: {
          ...prev[department]?.courses,
          [course]: {
            duration,
            system,
            structure
          }
        }
      }
    }));
  };

  // 🔹 TOGGLE SUBJECT
  const toggleSubject = (sub) => {
    setConfig((prev) => {
      const dept = prev[department];
      const crs = dept?.courses?.[course];
      const current = crs?.structure?.[semester]?.subjects || [];

      const exists = current.some((s) => s.code === sub.code);

      return {
        ...prev,
        [department]: {
          ...dept,
          courses: {
            ...dept.courses,
            [course]: {
              ...crs,
              structure: {
                ...crs.structure,
                [semester]: {
                  subjects: exists
                    ? current.filter((s) => s.code !== sub.code)
                    : [...current, sub]
                }
              }
            }
          }
        }
      };
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>College ERP Setup</h2>

      {/* 🔹 DEPARTMENT */}
      <div className={styles.card}>
        <h3>Department Setup</h3>

        <select
          className={styles.input}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option>Select Department</option>
          {departmentOptions.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <h4>Add HOD</h4>
        <div className={styles.row}>
          <input
            className={styles.input}
            placeholder="Name"
            onChange={(e) => setHod({ ...hod, name: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Email"
            onChange={(e) => setHod({ ...hod, email: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Employee ID"
            onChange={(e) => setHod({ ...hod, empId: e.target.value })}
          />
        </div>

        <button className={styles.primaryBtn} onClick={addDepartment}>
          Add Department
        </button>
      </div>

      {/* 🔹 COURSE */}
      <div className={styles.card}>
        <h3>Course Setup</h3>

        <div className={styles.row}>
          <select
            className={styles.input}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option>Select Course</option>
            {(courseMap[department] || []).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            className={styles.input}
            type="number"
            placeholder="Years"
            onChange={(e) => setDuration(Number(e.target.value))}
          />

          <select
            className={styles.input}
            onChange={(e) => setSystem(e.target.value)}
          >
            <option value="semester">Semester</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        <button className={styles.primaryBtn} onClick={addCourse}>
          Add Course
        </button>
      </div>

      {/* 🔹 SEM/YEAR */}
      <div className={styles.card}>
        <h3>Select {system === "semester" ? "Semester" : "Year"}</h3>

        <select
          className={styles.input}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option>Select</option>
          {[...Array(system === "semester" ? duration * 2 : duration)].map(
            (_, i) => (
              <option key={i + 1}>{i + 1}</option>
            )
          )}
        </select>
      </div>

      {/* 🔹 SUBJECTS */}
      <div className={styles.card}>
        <h3>Subjects</h3>

        <div className={styles.subjectGrid}>
          {subjectOptions.map((sub) => {
            const list =
              config?.[department]?.courses?.[course]?.structure?.[
                semester
              ]?.subjects || [];

            const checked = list.some((s) => s.code === sub.code);

            return (
              <label key={sub.code} className={styles.subjectItem}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSubject(sub)}
                />
                {sub.name} ({sub.code})
              </label>
            );
          })}
        </div>
      </div>

      {/* 🔥 OUTPUT */}
      <div className={styles.card}>
        <h3>Generated Structure</h3>
        <pre className={styles.output}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default AboutCollege;