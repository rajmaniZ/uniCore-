import { useState } from "react";

import styles from "./AboutInstitute.module.css";
// 🔹 BASE SUBJECTS (PRIMARY / LOWER)
const baseSubjects = [
  { name: "Maths", code: "M101" },
  { name: "English", code: "E101" },
  { name: "Science", code: "S101" }
];

// 🔹 STREAM SUBJECTS
const streamSubjectsMap = {
  PCM: [
    { name: "Physics", code: "P201" },
    { name: "Chemistry", code: "C201" },
    { name: "Maths", code: "M201" },
  ],
  PCB: [
    { name: "Physics", code: "P201" },
    { name: "Chemistry", code: "C201" },

    { name: "Biology", code: "B201" }
  ],
  Commerce: [
    { name: "Accounts", code: "A301" },
    { name: "Business", code: "B301" },
    { name: "Economics", code: "E301" }
  ],
  Arts: [
    { name: "History", code: "H401" },
    { name: "Civics", code: "C401" },
    { name: "Geography", code: "G401" }
  ]
};

const streamOptions = ["PCM", "PCB", "Commerce", "Arts"];
const sectionOptions = ["A", "B", "C"];

function SchoolSetup() {
  const [courseType, setCourseType] = useState("Primary");

  const [classInput, setClassInput] = useState("");
  const [classes, setClasses] = useState([]);
  const [classConfig, setClassConfig] = useState({});

  // 🔹 RANGE LIMIT
  const getLimit = () => {
    if (courseType === "Primary") return [0, 5];
    if (courseType === "Secondary") return [0, 10];
    if (courseType === "Senior Secondary") return [11, 12];
  };

  // 🔹 GENERATE CLASSES
  const generateClasses = () => {
    let newClasses = [];
    const [min, max] = getLimit();

    if (classInput.includes("-")) {
      let [start, end] = classInput.split("-").map(Number);

      if (start < min || end > max) {
        alert(`Allowed range: ${min}-${max}`);
        return;
      }

      for (let i = start; i <= end; i++) {
        newClasses.push(i.toString());
      }
    } else {
      let num = parseInt(classInput);

      if (num > max) {
        alert(`Max allowed: ${max}`);
        return;
      }

      for (let i = min; i <= num; i++) {
        newClasses.push(i.toString());
      }
    }

    setClasses(newClasses);
  };

  // 🔹 SAFE UPDATE
  const updateClassConfig = (cls, updater) => {
    setClassConfig((prev) => {
      const prevCls = {
        sections: [],
        streams: [],
        subjects: {},
        ...prev[cls]
      };

      return {
        ...prev,
        [cls]: updater(prevCls)
      };
    });
  };

  // 🔹 TOGGLE
  const toggle = (val, list = []) =>
    list.includes(val)
      ? list.filter((i) => i !== val)
      : [...list, val];
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>School Setup (Stream Based)</h2>

      {/* TYPE + INPUT */}
      <div className={styles.card}>
        <div className={styles.row}>
          <select
            className={styles.input}
            onChange={(e) => setCourseType(e.target.value)}
          >
            <option>Primary</option>
            <option>Secondary</option>
            <option>Senior Secondary</option>
          </select>

          <input
            className={styles.input}
            placeholder="10 or 6-10"
            value={classInput}
            onChange={(e) => setClassInput(e.target.value)}
          />

          <button
            className={styles.primaryBtn}
            onClick={generateClasses}
          >
            Generate
          </button>
        </div>
      </div>

      {/* CLASSES */}
      {classes.map((cls) => {
        const cfg = {
          sections: [],
          streams: [],
          subjects: {},
          ...classConfig[cls]
        };

        const isSenior = parseInt(cls) >= 9;

        return (
          <div key={cls} className={styles.classBox}>
            <h4>Class {cls}</h4>

            {/* SECTIONS */}
            <div className={styles.subjectGrid}>
              {sectionOptions.map((sec) => (
                <label key={sec} className={styles.subjectItem}>
                  <input
                    type="checkbox"
                    checked={cfg.sections.includes(sec)}
                    onChange={() =>
                      updateClassConfig(cls, (prev) => ({
                        ...prev,
                        sections: toggle(sec, prev.sections)
                      }))
                    }
                  />
                  {sec}
                </label>
              ))}
            </div>

            {/* STREAM */}
            {isSenior && (
              <div>
                <b>Streams</b>
                <div className={styles.subjectGrid}>
                  {streamOptions.map((s) => (
                    <label key={s} className={styles.subjectItem}>
                      <input
                        type="checkbox"
                        checked={cfg.streams.includes(s)}
                        onChange={() =>
                          updateClassConfig(cls, (prev) => ({
                            ...prev,
                            streams: toggle(s, prev.streams),
                            subjects: { ...prev.subjects, [s]: [] }
                          }))
                        }
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* SUBJECTS */}
            <div>
              <b>Subjects</b>

              {/* NORMAL */}
              {!isSenior && (
                <div className={styles.subjectGrid}>
                  {baseSubjects.map((sub) => (
                    <label key={sub.code} className={styles.subjectItem}>
                      <input
                        type="checkbox"
                        checked={(cfg.subjects?.common || []).some(
                          (s) => s.code === sub.code
                        )}
                        onChange={() =>
                          updateClassConfig(cls, (prev) => {
                            const list = prev.subjects?.common || [];
                            const exists = list.some((s) => s.code === sub.code);

                            return {
                              ...prev,
                              subjects: {
                                ...prev.subjects,
                                common: exists
                                  ? list.filter((s) => s.code !== sub.code)
                                  : [...list, sub]
                              }
                            };
                          })
                        }
                      />
                      {sub.name} ({sub.code})
                    </label>
                  ))}
                </div>
              )}

              {/* STREAM BASED */}
              {isSenior &&
                cfg.streams.map((stream) => (
                  <div key={stream}>
                    <b>{stream}</b>

                    <div className={styles.subjectGrid}>
                      {streamSubjectsMap[stream].map((sub) => (
                        <label key={sub.code} className={styles.subjectItem}>
                          <input
                            type="checkbox"
                            checked={(cfg.subjects?.[stream] || []).some(
                              (s) => s.code === sub.code
                            )}
                            onChange={() =>
                              updateClassConfig(cls, (prev) => {
                                const list = prev.subjects?.[stream] || [];
                                const exists = list.some(
                                  (s) => s.code === sub.code
                                );

                                return {
                                  ...prev,
                                  subjects: {
                                    ...prev.subjects,
                                    [stream]: exists
                                      ? list.filter((s) => s.code !== sub.code)
                                      : [...list, sub]
                                  }
                                };
                              })
                            }
                          />
                          {sub.name} ({sub.code})
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}

      {/* OUTPUT */}
      <div className={styles.card}>
        <h3>Generated Structure</h3>
        <pre className={styles.output}>
          {JSON.stringify(classConfig, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default SchoolSetup;