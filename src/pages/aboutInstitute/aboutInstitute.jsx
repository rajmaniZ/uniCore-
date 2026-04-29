

// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import styles from "./aboutInstitute.module.css";

// // import API from "./../../api/axios";
// // import { getDepartments } from "./../../api/departmentApi";
// // import { getCourses } from "./../../api/courseApi";
// // import { getSubjects } from "./../../api/subjectApi";

// // function PublicAbout() {
// //   const { id } = useParams();

// //   const [institute, setInstitute] = useState(null);
// //   const [departments, setDepartments] = useState([]);
// //   const [coursesMap, setCoursesMap] = useState({});
// //   const [subjectsMap, setSubjectsMap] = useState({});


// // useEffect(() => {
// //   const fetchAll = async () => {
// //     try {
// //       const res = await API.get(`/institute/${id}`);
// //       const inst = res.data;

// //       setInstitute(inst);

// //       if (inst?.type === "college") {

// //         const depts = await getDepartments({
// //           instituteId: inst._id
// //         });

// //         setDepartments(depts);

// //         const coursesTemp = {};
// //         const subjectsTemp = {};

// //         for (let dept of depts) {

// //           const courses = await getCourses({
// //             instituteId: inst._id,
// //             departmentId: dept._id
// //           });

// //           const subjects = await getSubjects({
// //             instituteId: inst._id,
// //             departmentId: dept._id
// //           });

// //           coursesTemp[dept._id] = courses;
// //           subjectsTemp[dept._id] = subjects;
// //         }

// //         setCoursesMap(coursesTemp);
// //         setSubjectsMap(subjectsTemp);
// //       }

// //     } catch (err) {
// //       console.error("PUBLIC PAGE ERROR:", err);
// //     }
// //   };

// //   if (id) fetchAll();
// // }, [id]);

// //   if (!institute) return <p>Loading...</p>;

// //   const { name, address, logo, buildingImage, type } = institute;

// //   return (
// //     <div className={styles.container}>

// //       {}
// //       <div
// //         className={styles.hero}
// //         style={{ backgroundImage: `url(${buildingImage})` }}
// //       >
// //         <div className={styles.overlay}>
// //           <img src={logo} alt="logo" className={styles.logo} />
// //           <h1>{name}</h1>
// //           <p>{address}</p>
// //         </div>
// //       </div>

// //       <div className={styles.content}>
// //         <h2 className={styles.heading}>Academic Structure</h2>

// //         {}
// //         {type === "college" &&
// //           departments.map((dept) => (
// //             <div key={dept._id} className={styles.card}>
// //               <div className={styles.cardHeader}>
// //                 <div>
// //                   <h3>{dept.name}</h3>
// //                   <p className={styles.desc}>
// //                     {dept.about || "No description"}
// //                   </p>
// //                 </div>

// //                 <span className={styles.hod}>
// //                   HOD: {dept.hod?.name || "N/A"}
// //                 </span>
// //               </div>

// //               {(coursesMap[dept._id] || []).map((course) => (
// //                 <div key={course._id} className={styles.course}>
// //                   <h4>{course.name}</h4>

// //                   <div className={styles.semGrid}>
// //                     {(subjectsMap[dept._id] || []).map((sub) => (
// //                       <div key={sub._id} className={styles.semCard}>
// //                         <h5>{sub.name}</h5>
// //                         <p>Code: {sub.code || "N/A"}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ))}

// //         {}
// //         {type === "school" && (
// //           <div className={styles.card}>
// //             <h3>School Structure</h3>
// //             <p>Classes and subjects managed via config.</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default PublicAbout;
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import styles from "./aboutInstitute.module.css";

// import API from "./../../api/axios";
// import { getDepartments } from "./../../api/departmentApi";
// import { getCourses } from "./../../api/courseApi";
// import { getSubjects } from "./../../api/subjectApi";

// function PublicAbout() {
//   const { id } = useParams();

//   const [institute, setInstitute] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [coursesMap, setCoursesMap] = useState({});
//   const [subjectsMap, setSubjectsMap] = useState({});

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const res = await API.get(`/institute/${id}`);
//         const inst = res.data;

//         setInstitute(inst);

//         if (inst?.type === "college") {

//           // ✅ FIX: pass string not object
//           const depts = await getDepartments(inst._id);
//           setDepartments(depts || []);

//           const coursesTemp = {};
//           const subjectsTemp = {};

//           for (let dept of depts || []) {
//             try {
//               const courses = await getCourses({
//                 instituteId: inst._id,
//                 departmentId: dept._id,
//               });

//               coursesTemp[dept._id] = courses || [];
//             } catch {
//               coursesTemp[dept._id] = [];
//             }

//             try {
//               const subjects = await getSubjects({
//                 instituteId: inst._id,
//                 departmentId: dept._id,
//               });

//               subjectsTemp[dept._id] = subjects || [];
//             } catch {
//               subjectsTemp[dept._id] = [];
//             }
//           }

//           setCoursesMap(coursesTemp);
//           setSubjectsMap(subjectsTemp);
//         }

//       } catch (err) {
//         console.error("PUBLIC PAGE ERROR:", err.message);
//       }
//     };

//     if (id) fetchAll();
//   }, [id]);

//   if (!institute) return <p>Loading...</p>;

//   const { name, address, logo, buildingImage, type } = institute;

//   return (
//     <div className={styles.container}>
//       <div
//         className={styles.hero}
//         style={{ backgroundImage: `url(${buildingImage})` }}
//       >
//         <div className={styles.overlay}>
//           <img src={logo} alt="logo" className={styles.logo} />
//           <h1>{name}</h1>
//           <p>{address}</p>
//         </div>
//       </div>

//       <div className={styles.content}>
//         <h2 className={styles.heading}>Academic Structure</h2>

//         {type === "college" &&
//           departments.map((dept) => (
//             <div key={dept._id} className={styles.card}>
//               <div className={styles.cardHeader}>
//                 <div>
//                   <h3>{dept.name}</h3>
//                   <p className={styles.desc}>
//                     {dept.about || "No description"}
//                   </p>
//                 </div>

//                 <span className={styles.hod}>
//                   HOD: {dept.hod?.name || "N/A"}
//                 </span>
//               </div>

//               {(coursesMap[dept._id] || []).map((course) => (
//                 <div key={course._id} className={styles.course}>
//                   <h4>{course.name}</h4>

//                   <div className={styles.semGrid}>
//                     {(subjectsMap[dept._id] || []).map((sub) => (
//                       <div key={sub._id} className={styles.semCard}>
//                         <h5>{sub.name}</h5>
//                         <p>Code: {sub.code || "N/A"}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}

//         {type === "school" && (
//           <div className={styles.card}>
//             <h3>School Structure</h3>
//             <p>Classes and subjects managed via config.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PublicAbout;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./aboutInstitute.module.css";

import API from "./../../api/axios";
import { getDepartments } from "./../../api/departmentApi";
import { getCourses } from "./../../api/courseApi";
import { getSubjects } from "./../../api/subjectApi";
import { getClasses } from "./../../api/classApi";

function PublicAbout() {
  const { id } = useParams();

  const [institute, setInstitute] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [subjectsMap, setSubjectsMap] = useState({});
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/institute/${id}`);
        const inst = res.data;

        if (!inst) return;

        setInstitute(inst);

        // ================= COLLEGE =================
        if (inst.type === "college") {
          const depts = await getDepartments(inst._id);
          setDepartments(depts || []);

          const coursesTemp = {};
          const subjectsTemp = {};

          for (let dept of depts || []) {
            try {
              const courses = await getCourses({
                instituteId: inst._id,
                departmentId: dept._id,
              });
              coursesTemp[dept._id] = courses || [];
            } catch {
              coursesTemp[dept._id] = [];
            }

            try {
              const subjects = await getSubjects({
                instituteId: inst._id,
                departmentId: dept._id,
              });
              subjectsTemp[dept._id] = subjects || [];
            } catch {
              subjectsTemp[dept._id] = [];
            }
          }

          setCoursesMap(coursesTemp);
          setSubjectsMap(subjectsTemp);
        }

        // ================= SCHOOL =================
        else if (inst.type === "school") {
          const cls = await getClasses(inst._id);
          setClasses(cls || []);
        }

      } catch (err) {
        console.error("PUBLIC PAGE ERROR:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!institute) return <p>No institute found</p>;

  const { name, address, logo, buildingImage, type } = institute;

  return (
    <div className={styles.container}>
      {/* HERO */}
      <div
        className={styles.hero}
        style={{
          backgroundImage: buildingImage ? `url(${buildingImage})` : "none",
        }}
      >
        <div className={styles.overlay}>
          {logo && <img src={logo} alt="logo" className={styles.logo} />}
          <h1>{name}</h1>
          <p>{address}</p>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.heading}>Academic Structure</h2>

        {/* ================= COLLEGE ================= */}
        {type === "college" &&
          departments.map((dept) => (
            <div key={dept._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{dept.name}</h3>
                  <p className={styles.desc}>
                    {dept.about || "No description"}
                  </p>
                </div>

                <span className={styles.hod}>
                  HOD: {dept.hod?.name || "N/A"}
                </span>
              </div>

              {(coursesMap[dept._id] || []).map((course) => (
                <div key={course._id} className={styles.course}>
                  <h4>{course.name}</h4>

                  <div className={styles.semGrid}>
                    {(subjectsMap[dept._id] || []).map((sub) => (
                      <div key={sub._id} className={styles.semCard}>
                        <h5>{sub.name}</h5>
                        <p>Code: {sub.code || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* ================= SCHOOL ================= */}
        {type === "school" && (
          <div className={styles.card}>
            <h3>School Structure</h3>

            {classes.length === 0 ? (
              <p>No classes found</p>
            ) : (
              classes.map((cls) => (
                <div key={cls._id} className={styles.course}>
                  <h4>{cls.name}</h4>

                  {(cls.subjects || []).length > 0 ? (
                    <div className={styles.semGrid}>
                      {cls.subjects.map((sub) => (
                        <div key={sub._id} className={styles.semCard}>
                          <h5>{sub.name}</h5>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No subjects</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicAbout;