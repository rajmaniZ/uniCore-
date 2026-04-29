












import { useState, useEffect } from "react";
import styles from "./schoolSetup.module.css";


const SUBJECTS = [
  { _id: "1", name: "Mathematics", code: "MTH101" },
  { _id: "2", name: "Physics", code: "PHY101" },
  { _id: "3", name: "Chemistry", code: "CHM101" },
  { _id: "4", name: "Computer Science", code: "CSE101" },
];


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
};

const streamOptions = ["PCM", "PCB"];
const sectionOptions = ["A", "B", "C"];

function Blog({ config = {}, setConfig }) {

  const [classes, setClasses] = useState([]);
  const [classInput, setClassInput] = useState("");
  const [classConfig, setClassConfig] = useState({});
  const [schoolType, setSchoolType] = useState("");

  
  const [teachers, setTeachers] = useState([]);
  const [teacherInput, setTeacherInput] = useState({
    name: "",
    email: ""
  });

  
  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
      setClassConfig(config);
      setClasses(Object.keys(config));
    }
  }, [config]);

  useEffect(() => {
  if (typeof setConfig === "function") {
    setConfig(classConfig);
  }
}, [classConfig]);

  
  const generateClasses = () => {
    let max = 0;

    if (schoolType === "primary") max = 5;
    else if (schoolType === "secondary") max = 10;
    else if (schoolType === "senior") max = 12;

    if (!max) return;

    const arr = [];
    for (let i = 0; i <= max; i++) arr.push(i.toString());

    setClasses(arr);
  };

  
  const updateClass = (cls, updater) => {
    setClassConfig(prev => {
      const base = {
        sections: prev[cls]?.sections || [],
        streams: prev[cls]?.streams || [],
        subjects: prev[cls]?.subjects || {},
      };

      return {
        ...prev,
        [cls]: updater(base)
      };
    });
  };

  const toggle = (val, list = []) =>
    list.includes(val)
      ? list.filter(i => i !== val)
      : [...list, val];

  return (
    <div className={styles.container}>
      <h2>School Setup</h2>

      {}
      <div className={styles.card}>
        <h3>Add Teacher</h3>

        <input
          placeholder="Name"
          value={teacherInput.name}
          onChange={e => setTeacherInput({ ...teacherInput, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={teacherInput.email}
          onChange={e => setTeacherInput({ ...teacherInput, email: e.target.value })}
        />

        <button onClick={() => {
          if (!teacherInput.name) return;

          const newTeacher = {
            ...teacherInput,
            id: Date.now().toString()
          };

          setTeachers(prev => [...prev, newTeacher]);
          setTeacherInput({ name: "", email: "" });
        }}>
          Add Teacher
        </button>
      </div>

      {}
      <div className={styles.card}>

        <select value={schoolType} onChange={e => setSchoolType(e.target.value)}>
          <option value="">Select School Type</option>
          <option value="primary">Primary (0–5)</option>
          <option value="secondary">Secondary (0–10)</option>
          <option value="senior">Senior Secondary (0–12)</option>
        </select>

        <button onClick={generateClasses}>Generate Classes</button>
      </div>

      {}
      {classes.map(cls => {

        const cfg = {
          sections: classConfig[cls]?.sections || [],
          streams: classConfig[cls]?.streams || [],
          subjects: classConfig[cls]?.subjects || {},
        };

        const num = parseInt(cls);
        const is9_10 = num === 9 || num === 10;
        const is11_12 = num === 11 || num === 12;

        return (
          <div key={cls} className={styles.card}>
            <h3>Class {cls}</h3>

            {}
            <div className={styles.row}>
              {sectionOptions.map(sec => (
                <label key={sec}>
                  <input
                    type="checkbox"
                    checked={cfg.sections.includes(sec)}
                    onChange={() =>
                      updateClass(cls, prev => ({
                        ...prev,
                        sections: toggle(sec, prev.sections)
                      }))
                    }
                  />
                  {sec}
                </label>
              ))}
            </div>

            {}
            {(is9_10 || is11_12) && (
              <div className={styles.row}>
                {(is9_10
                  ? ["Science", "Arts"]
                  : ["PCM", "PCB", "Arts"]
                ).map(s => (
                  <label key={s}>
                    <input
                      type="checkbox"
                      checked={cfg.streams.includes(s)}
                      onChange={() =>
                        updateClass(cls, prev => ({
                          ...prev,
                          streams: toggle(s, prev.streams),
                          subjects: {
                            ...prev.subjects,
                            [s]: prev.subjects?.[s] || []
                          }
                        }))
                      }
                    />
                    {s}
                  </label>
                ))}
              </div>
            )}

            {}

            {!is9_10 && !is11_12 && (
              <SubjectUI
                title="Common Subjects"
                base={SUBJECTS}
                stored={cfg.subjects.common || []}
                teachers={teachers}
                onAdd={(sub) => {
                  updateClass(cls, prev => ({
                    ...prev,
                    subjects: {
                      ...prev.subjects,
                      common: [...(prev.subjects.common || []), sub]
                    }
                  }));
                }}
              />
            )}

            {(is9_10 || is11_12) && cfg.streams.map(stream => (
              <SubjectUI
                key={stream}
                title={stream}
                base={SUBJECTS}
                stored={cfg.subjects[stream] || []}
                teachers={teachers}
                onAdd={(sub) => {
                  updateClass(cls, prev => ({
                    ...prev,
                    subjects: {
                      ...prev.subjects,
                      [stream]: [...(prev.subjects[stream] || []), sub]
                    }
                  }));
                }}
              />
            ))}

          </div>
        );
      })}
    </div>
  );
}


function SubjectUI({ title, base, stored, teachers, onAdd }) {

  const [subId, setSubId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const available = base.filter(
    s => !stored.some(x => x.name === s.name)
  );

  return (
    <div className={styles.subCard}>
      <h4>{title}</h4>

      <div className={styles.row}>
        <select value={subId} onChange={e => setSubId(e.target.value)}>
          <option value="">Select Subject</option>
          {available.map(s => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select value={teacherId} onChange={e => setTeacherId(e.target.value)}>
          <option value="">Select Teacher</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <button onClick={() => {
          if (!subId || !teacherId) return;

          const sub = base.find(s => s._id === subId);
          const teacher = teachers.find(t => t.id === teacherId);

          onAdd({
            name: sub.name,
            code: sub.code,
            teacherId: teacher.id,
            teacherName: teacher.name
          });

          setSubId("");
          setTeacherId("");
        }}>
          Add
        </button>
      </div>

      <ul>
        {stored.map((s, i) => (
          <li key={i}>
            {s.name} - {s.teacherName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Blog;