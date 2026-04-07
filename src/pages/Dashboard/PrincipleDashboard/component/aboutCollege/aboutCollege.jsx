import { useState } from "react";

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

const streamOptions = ["PCM","PCB", "Commerce", "Arts"];
const sectionOptions = ["A", "B", "C"];

function AboutCollege() {
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
    <div style={{ padding: "20px" }}>
      <h2>School Setup (Stream Based)</h2>

      {/* TYPE */}
      <select onChange={(e) => setCourseType(e.target.value)}>
        <option>Primary</option>
        <option>Secondary</option>
        <option>Senior Secondary</option>
      </select>

      {/* INPUT */}
      <input
        placeholder="10 or 6-10"
        value={classInput}
        onChange={(e) => setClassInput(e.target.value)}
      />
      <button onClick={generateClasses}>Generate</button>

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
          <div key={cls} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
            <h4>Class {cls}</h4>

            {/* SECTIONS */}
            {sectionOptions.map((sec) => (
              <label key={sec}>
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

            {/* STREAM */}
            {isSenior && (
              <div>
                <b>Streams</b><br />
                {streamOptions.map((s) => (
                  <label key={s}>
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
            )}

            {/* SUBJECTS */}
            <div>
              <b>Subjects</b><br />

              {/* NORMAL CLASS */}
              {!isSenior &&
                baseSubjects.map((sub) => (
                  <label key={sub.code}>
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

              {/* STREAM BASED */}
              {isSenior &&
                cfg.streams.map((stream) => (
                  <div key={stream}>
                    <b>{stream}</b><br />

                    {streamSubjectsMap[stream].map((sub) => (
                      <label key={sub.code}>
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
                ))}
            </div>
          </div>
        );
      })}

      {/* OUTPUT */}
      <pre>{JSON.stringify(classConfig, null, 2)}</pre>
    </div>
  );
}

export default AboutCollege;

// import { useState } from "react";

// const departmentOptions = [
//   "CSE",
//   "IT",
//   "ECE",
//   "ME",
//   "EE",
//   "CE",
//   "Science",
//   "Arts",
//   "Physical Education"
// ];

// const courseMap = {
//   IT:["B.tech","M.tech"],
//   CSE:["B.tech","M.tech"],
//   ECE:["B.tech","M.tech"],
//   EE:["B.tech","M.tech"],
//   ME:["B.tech","M.tech"],
//   CE:["B.tech","M.tech"],
//   Science: ["BSc", "MSc"],
//   Arts: ["BA", "MA"],
//   "Physical Education": ["BPED", "MPED"]
// };

// const subjectOptions = [
//   { name: "Maths", code: "M101" },
//   { name: "Physics", code: "P101" },
//   { name: "DSA", code: "CS201" },
//   { name: "History", code: "H101" }
// ];

// const currentUser = {
//   collegeCode: "ABC123"
// };

// function AboutCollegeForm() {
//   const [department, setDepartment] = useState("");
//   const [course, setCourse] = useState("");
//   const [duration, setDuration] = useState(4);
//   const [system, setSystem] = useState("semester");
//   const [semester, setSemester] = useState("");

//   const [hod, setHod] = useState({
//     name: "",
//     email: "",
//     empId: ""
//   });

//   const [config, setConfig] = useState({});

//   // 🔹 ADD DEPARTMENT + HOD
//   const addDepartment = () => {
//     if (!department) return;

//     setConfig((prev) => ({
//       ...prev,
//       [department]: {
//         hod: {
//           ...hod,
//           collegeCode: currentUser.collegeCode
//         },
//         courses: {}
//       }
//     }));
//   };

//   // 🔹 ADD COURSE
//   const addCourse = () => {
//     if (!department || !course) return;

//     const totalSem = system === "semester" ? duration * 2 : duration;

//     let structure = {};

//     for (let i = 1; i <= totalSem; i++) {
//       structure[i] = { subjects: [] };
//     }

//     setConfig((prev) => ({
//       ...prev,
//       [department]: {
//         ...prev[department],
//         courses: {
//           ...prev[department]?.courses,
//           [course]: {
//             duration,
//             system,
//             structure
//           }
//         }
//       }
//     }));
//   };

//   // 🔹 ADD SUBJECT
//   const toggleSubject = (sub) => {
//     setConfig((prev) => {
//       const dept = prev[department];
//       const crs = dept?.courses?.[course];
//       const current = crs?.structure?.[semester]?.subjects || [];

//       const exists = current.some((s) => s.code === sub.code);

//       return {
//         ...prev,
//         [department]: {
//           ...dept,
//           courses: {
//             ...dept.courses,
//             [course]: {
//               ...crs,
//               structure: {
//                 ...crs.structure,
//                 [semester]: {
//                   subjects: exists
//                     ? current.filter((s) => s.code !== sub.code)
//                     : [...current, sub]
//                 }
//               }
//             }
//           }
//         }
//       };
//     });
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>College ERP Setup</h2>

//       {/* 🔹 DEPARTMENT */}
//       <select onChange={(e) => setDepartment(e.target.value)}>
//         <option>Select Department</option>
//         {departmentOptions.map((d) => (
//           <option key={d}>{d}</option>
//         ))}
//       </select>

//       {/* 🔹 HOD */}
//       <h4>Add HOD</h4>
//       <input placeholder="Name" onChange={(e) => setHod({ ...hod, name: e.target.value })} />
//       <input placeholder="Email" onChange={(e) => setHod({ ...hod, email: e.target.value })} />
//       <input placeholder="Employee ID" onChange={(e) => setHod({ ...hod, empId: e.target.value })} />

//       <button onClick={addDepartment}>Add Department</button>

//       {/* 🔹 COURSE */}
//       <select onChange={(e) => setCourse(e.target.value)}>
//         <option>Select Course</option>
//         {(courseMap[department] || []).map((c) => (
//           <option key={c}>{c}</option>
//         ))}
//       </select>

//       {/* 🔹 DURATION */}
//       <input
//         type="number"
//         placeholder="Years"
//         onChange={(e) => setDuration(Number(e.target.value))}
//       />

//       {/* 🔹 SYSTEM */}
//       <select onChange={(e) => setSystem(e.target.value)}>
//         <option value="semester">Semester</option>
//         <option value="annual">Annual</option>
//       </select>

//       <button onClick={addCourse}>Add Course</button>

//       {/* 🔹 SELECT SEM/YEAR */}
//       <select onChange={(e) => setSemester(e.target.value)}>
//         <option>Select {system === "semester" ? "Semester" : "Year"}</option>
//         {[...Array(system === "semester" ? duration * 2 : duration)].map(
//           (_, i) => (
//             <option key={i + 1}>{i + 1}</option>
//           )
//         )}
//       </select>

//       {/* 🔹 SUBJECTS */}
//       <div>
//         {subjectOptions.map((sub) => {
//           const list =
//             config?.[department]?.courses?.[course]?.structure?.[
//               semester
//             ]?.subjects || [];

//           const checked = list.some((s) => s.code === sub.code);

//           return (
//             <label key={sub.code}>
//               <input
//                 type="checkbox"
//                 checked={checked}
//                 onChange={() => toggleSubject(sub)}
//               />
//               {sub.name} ({sub.code})
//             </label>
//           );
//         })}
//       </div>

//       {/* 🔥 OUTPUT */}
//       <pre>{JSON.stringify(config, null, 2)}</pre>
//     </div>
//   );
// }

// export default AboutCollegeForm;

