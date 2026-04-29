

















































































































































































































































































// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import styles from "./requestForAccount.module.css";

// import { sendRequestOtp, requestAccount, verifyOtp } from "../../../api/userAPI";
// import { getInstitutes } from "../../../api/instituteApi";
// import { getDepartments } from "../../../api/departmentApi";
// import { getCourses } from "../../../api/courseApi";
// import { getSubjects } from "../../../api/subjectApi";
// import { getClasses } from "../../../api/classApi";

// function Register() {
//   const [role, setRole] = useState("");
//   const [digit, setDigit] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [institutes, setInstitutes] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     instituteId: "",
//     departmentId: "",
//     courseId: "",
//     subjectIds: [],
//     semester: "",
//     rollNumber: "",
//     employeeId: "",
//     classId: "",
//     section: "",
//     stream: "",
//     otp: "",
//   });

  
//   useEffect(() => {
//     getInstitutes()
//       .then(setInstitutes)
//       .catch(console.error);
//   }, []);

//   const selectedInstitute = institutes.find(
//     (institute) => institute._id === formData.instituteId
//   );
//   const instituteType = selectedInstitute?.type;

  
//   useEffect(() => {
//     if (!formData.instituteId) {
//       setDepartments([]);
//       setClasses([]);
//       return;
//     }

//     if (instituteType === "college") {
//       getDepartments(formData.instituteId)
//         .then(setDepartments)
//         .catch(console.error);
//       setClasses([]);
//     }

//     if (instituteType === "school") {
//       getClasses(formData.instituteId)
//         .then(setClasses)
//         .catch(console.error);
//       setDepartments([]);
//     }

//   }, [formData.instituteId, instituteType]);

  
//   useEffect(() => {
//     if (!formData.departmentId) {
//       setCourses([]);
//       return;
//     }

//     getCourses({
//       instituteId: formData.instituteId,
//       departmentId: formData.departmentId,
//     })
//       .then(setCourses)
//       .catch(console.error);

//   }, [formData.departmentId, formData.instituteId]);

  
//   useEffect(() => {
//     if (instituteType === "college" && !formData.departmentId) {
//       setSubjects([]);
//       return;
//     }

//     if (instituteType === "school" && !formData.classId) {
//       setSubjects([]);
//       return;
//     }

//     const params =
//       instituteType === "school"
//         ? {
//             instituteId: formData.instituteId,
//             type: "school",
//             classId: formData.classId,
//           }
//         : {
//             instituteId: formData.instituteId,
//             type: "college",
//             departmentId: formData.departmentId,
//             courseId: formData.courseId || undefined,
//             semester: formData.semester || undefined,
//           };

//     getSubjects(params)
//       .then(setSubjects)
//       .catch(console.error);

//   }, [
//     formData.instituteId,
//     formData.departmentId,
//     formData.courseId,
//     formData.semester,
//     formData.classId,
//     instituteType,
//   ]);

  
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     let updated = { ...formData, [name]: value };

    
//     if (name === "instituteId") {
//       updated.departmentId = "";
//       updated.courseId = "";
//       updated.classId = "";
//       updated.section = "";
//       updated.semester = "";
//       updated.subjectIds = [];

//       setDepartments([]);
//       setCourses([]);
//       setSubjects([]);
//     }

//     if (name === "classId") {
//       updated.subjectIds = [];
//       setSubjects([]);
//     }

//     if (name === "departmentId") {
//       updated.courseId = "";
//       updated.subjectIds = [];

//       setCourses([]);
//       setSubjects([]);
//     }

//     setFormData(updated);
//   };

  
//   const isValid =
//     formData.name &&
//     formData.email &&
//     role &&
//     formData.instituteId &&
//     (role === "student" ? formData.rollNumber : formData.employeeId) &&
//     (instituteType === "school"
//       ? formData.classId && formData.section
//       : formData.departmentId &&
//         (role === "teacher" || (formData.courseId && formData.semester)));

  
//   const handleSendOtp = async () => {
//     try {
//       setLoading(true);
//       await sendRequestOtp(formData.email);
//       alert("OTP sent");
//       setDigit(true);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Error sending OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       await verifyOtp({
//         email: formData.email,
//         otp: formData.otp,
//         type: "request",
//       });

//       await requestAccount({
//         ...formData,
//         role,
//       });

//       alert("Request submitted successfully");
//       window.location.href = "/login";

//     } catch (err) {
//       alert(err.response?.data?.msg || "Error submitting request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.page}>
//       <h2>Request Account</h2>

//       <form className={styles.loginForm}>
//         <div className={styles.inputSection}>

//           {}
//           <fieldset>
//             <legend>Personal</legend>

//             <input name="name" placeholder="Name" onChange={handleChange} />
//             <input name="email" placeholder="Email" onChange={handleChange} />

//             <select onChange={(e) => setRole(e.target.value)}>
//               <option value="">Role</option>
//               <option value="student">Student</option>
//               <option value="teacher">Teacher</option>
//             </select>
//           </fieldset>

//           {}
//           <fieldset>
//             <legend>Institute</legend>

//             <select name="instituteId" onChange={handleChange}>
//               <option value="">Select Institute</option>
//               {institutes.map((i) => (
//                 <option key={i._id} value={i._id}>
//                   {i.name}
//                 </option>
//               ))}
//             </select>
//           </fieldset>

//           {}
//           {formData.instituteId && (
//             <fieldset>
//               <legend>Academic</legend>

//               {instituteType === "school" && (
//                 <>
//                   <select name="classId" onChange={handleChange}>
//                     <option value="">Class</option>
//                     {classes.map((cls) => (
//                       <option key={cls._id} value={cls._id}>
//                         {cls.name}
//                       </option>
//                     ))}
//                   </select>

//                   <input
//                     name="section"
//                     placeholder="Section"
//                     onChange={handleChange}
//                   />
//                 </>
//               )}

//               {instituteType === "college" && (
//                 <select name="departmentId" onChange={handleChange}>
//                   <option value="">Department</option>
//                   {departments.map((d) => (
//                     <option key={d._id} value={d._id}>
//                       {d.name}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               {}
//               {role === "student" && (
//                 <>
//                   {instituteType === "college" && (
//                     <>
//                       <select name="courseId" onChange={handleChange}>
//                         <option value="">Course</option>
//                         {courses.map((c) => (
//                           <option key={c._id} value={c._id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>

//                       <input
//                         name="semester"
//                         placeholder="Semester / Year"
//                         onChange={handleChange}
//                       />
//                     </>
//                   )}

//                   <input
//                     name="rollNumber"
//                     placeholder="Roll Number"
//                     onChange={handleChange}
//                   />
//                 </>
//               )}

//               {}
//               {role === "teacher" && (
//                 <>
//                   <select
//                     multiple
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         subjectIds: Array.from(
//                           e.target.selectedOptions,
//                           (o) => o.value
//                         ),
//                       })
//                     }
//                   >
//                     {subjects.map((s) => (
//                       <option key={s._id} value={s._id}>
//                         {s.name}
//                       </option>
//                     ))}
//                   </select>

//                   <input
//                     name="employeeId"
//                     placeholder="Employee ID"
//                     onChange={handleChange}
//                   />
//                 </>
//               )}
//             </fieldset>
//           )}

//           {}
//           <button
//             type="button"
//             disabled={!isValid || loading}
//             onClick={handleSendOtp}
//           >
//             {loading ? "Sending..." : "Send OTP"}
//           </button>

//           {digit && (
//             <>
//               <input
//                 name="otp"
//                 placeholder="OTP"
//                 onChange={handleChange}
//               />

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//               >
//                 {loading ? "Submitting..." : "Submit Request"}
//               </button>
//             </>
//           )}

//         </div>
//       </form>
//     </div>
//   );
// }

// export default Register;

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./requestForAccount.module.css";

import { sendRequestOtp, requestAccount, verifyOtp } from "../../../api/userAPI";
import { getInstitutes } from "../../../api/instituteApi";
import { getDepartments } from "../../../api/departmentApi";
import { getCourses } from "../../../api/courseApi";
import { getSubjects } from "../../../api/subjectApi";
import { getClasses } from "../../../api/classApi";

function Register() {
  const [role, setRole] = useState("");
  const [digit, setDigit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [institutes, setInstitutes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  // 🔥 Employee ID Generator (FIXED)
  const generateEmployeeId = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `EMP-${Date.now().toString().slice(-4)}-${rand}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instituteId: "",
    departmentId: "",
    courseId: "",
    subjectIds: [],
    semester: "",
    rollNumber: "",
    employeeId: "", // user can type OR auto-generate
    classId: "",
    section: "",
    stream: "",
    otp: "",
  });

  // ✅ Fetch Institutes
  useEffect(() => {
    getInstitutes()
      .then(setInstitutes)
      .catch(console.error);
  }, []);

  const selectedInstitute = institutes.find(
    (i) => i._id === formData.instituteId
  );
  const instituteType = selectedInstitute?.type;

  // ✅ Fetch Department / Classes
  useEffect(() => {
    if (!formData.instituteId) {
      setDepartments([]);
      setClasses([]);
      return;
    }

    if (instituteType === "college") {
      getDepartments(formData.instituteId)
        .then(setDepartments)
        .catch(console.error);
      setClasses([]);
    }

    if (instituteType === "school") {
      getClasses(formData.instituteId)
        .then(setClasses)
        .catch(console.error);
      setDepartments([]);
    }
  }, [formData.instituteId, instituteType]);

  // ✅ Fetch Courses
  useEffect(() => {
    if (!formData.departmentId) {
      setCourses([]);
      return;
    }

    getCourses({
      instituteId: formData.instituteId,
      departmentId: formData.departmentId,
    })
      .then(setCourses)
      .catch(console.error);
  }, [formData.departmentId, formData.instituteId]);

  // ✅ Fetch Subjects
  useEffect(() => {
    if (instituteType === "college" && !formData.departmentId) {
      setSubjects([]);
      return;
    }

    if (instituteType === "school" && !formData.classId) {
      setSubjects([]);
      return;
    }

    const params =
      instituteType === "school"
        ? {
            instituteId: formData.instituteId,
            type: "school",
            classId: formData.classId,
          }
        : {
            instituteId: formData.instituteId,
            type: "college",
            departmentId: formData.departmentId,
            courseId: formData.courseId || undefined,
            semester: formData.semester || undefined,
          };

    getSubjects(params)
      .then(setSubjects)
      .catch(console.error);
  }, [
    formData.instituteId,
    formData.departmentId,
    formData.courseId,
    formData.semester,
    formData.classId,
    instituteType,
  ]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...formData, [name]: value.trim() };

    if (name === "instituteId") {
      updated.departmentId = "";
      updated.courseId = "";
      updated.classId = "";
      updated.section = "";
      updated.semester = "";
      updated.subjectIds = [];

      setDepartments([]);
      setCourses([]);
      setSubjects([]);
    }

    if (name === "classId") {
      updated.subjectIds = [];
      setSubjects([]);
    }

    if (name === "departmentId") {
      updated.courseId = "";
      updated.subjectIds = [];

      setCourses([]);
      setSubjects([]);
    }

    setFormData(updated);
  };

  // ✅ Validation (FIXED EMPLOYEE ID)
  const isValid =
    formData.name &&
    formData.email &&
    role &&
    formData.instituteId &&
    (role === "student"
      ? formData.rollNumber
      : formData.employeeId || true) && // allow auto generation
    (instituteType === "school"
      ? formData.classId && formData.section
      : formData.departmentId &&
        (role === "teacher" || (formData.courseId && formData.semester)));

  // ✅ Send OTP
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await sendRequestOtp(formData.email);
      alert("OTP sent");
      setDigit(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit (FINAL FIX)
  const handleSubmit = async () => {
    try {
      setLoading(true);

      await verifyOtp({
        email: formData.email,
        otp: formData.otp,
        type: "request",
      });

      // 🔥 AUTO FIX EMPLOYEE ID
      const finalEmployeeId =
        role === "teacher"
          ? formData.employeeId || generateEmployeeId()
          : undefined;

      await requestAccount({
        ...formData,
        role,
        employeeId: finalEmployeeId,
      });

      alert("Request submitted successfully");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.msg || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2>Request Account</h2>

      <form className={styles.loginForm}>
        <div className={styles.inputSection}>

          <fieldset>
            <legend>Personal</legend>

            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />

            <select onChange={(e) => setRole(e.target.value)}>
              <option value="">Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Institute</legend>

            <select name="instituteId" onChange={handleChange}>
              <option value="">Select Institute</option>
              {institutes.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
          </fieldset>

          {formData.instituteId && (
            <fieldset>
              <legend>Academic</legend>

              {instituteType === "school" && (
                <>
                  <select name="classId" onChange={handleChange}>
                    <option value="">Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>

                  <input name="section" placeholder="Section" onChange={handleChange} />
                </>
              )}

              {instituteType === "college" && (
                <select name="departmentId" onChange={handleChange}>
                  <option value="">Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}

              {role === "student" && (
                <>
                  {instituteType === "college" && (
                    <>
                      <select name="courseId" onChange={handleChange}>
                        <option value="">Course</option>
                        {courses.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      <input name="semester" placeholder="Semester" onChange={handleChange} />
                    </>
                  )}

                  <input name="rollNumber" placeholder="Roll Number" onChange={handleChange} />
                </>
              )}

              {role === "teacher" && (
                <>
                  <select
                    multiple
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subjectIds: Array.from(
                          e.target.selectedOptions,
                          (o) => o.value
                        ),
                      })
                    }
                  >
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <input
                    name="employeeId"
                    placeholder="Employee ID (optional)"
                    onChange={handleChange}
                  />
                </>
              )}
            </fieldset>
          )}

          <button type="button" disabled={!isValid || loading} onClick={handleSendOtp}>
            {loading ? "Sending..." : "Send OTP"}
          </button>

          {digit && (
            <>
              <input name="otp" placeholder="OTP" onChange={handleChange} />

              <button type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </>
          )}

        </div>
      </form>
    </div>
  );
}

export default Register;