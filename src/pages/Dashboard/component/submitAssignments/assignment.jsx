// import { useState } from "react";
// import { useData } from "../../context/dataContext";
// import { useAuth } from "../../context/AuthContext";
// import styles from "./assignment.module.css";

// export default function AssignmentStudent() {

//   const { assignments, submissions, submitAssignment } = useData();
//   const { currentUser, isLoading } = useAuth();

//   const [fileMap, setFileMap] = useState({});

//   // ✅ LOADING + SAFETY
//   if (isLoading) return <div className={styles.empty}>Loading...</div>;
//   if (!currentUser) return <div className={styles.empty}>Login required</div>;

//   const formatDate = (d) =>
//     d ? new Date(d).toLocaleDateString() : "N/A";

//   // 🔥 IMPORTANT FIX: FILTER ASSIGNMENTS
//   const filteredAssignments = assignments.filter(a =>
//     a.class === currentUser.class &&
//     currentUser.subjects?.includes(a.subject)
//   );

//   // ✅ handle file selection
//   const handleFileChange = (id, file) => {
//     setFileMap(prev => ({ ...prev, [id]: file }));
//   };

//   // ✅ submit assignment
//   const handleSubmit = (assignmentId) => {

//     const file = fileMap[assignmentId];
//     if (!file) return alert("Upload file");

//     const assignment = assignments.find(a => a._id === assignmentId);

//     const isLate = new Date() > new Date(assignment.deadline);

//     submitAssignment({
//       _id: `sub_${Date.now()}`,
//       assignmentId,
//       studentId: currentUser._id,
//       file,
//       submittedAt: new Date().toISOString(),
//       status: isLate ? "late" : "on-time",
//       marks: null,
//       remarks: "",
//       reviewed: false
//     });

//     alert("Submitted");

//     // reset file after submit
//     setFileMap(prev => ({ ...prev, [assignmentId]: null }));
//   };

//   // ✅ preview file
//   const renderFile = (file) => {
//     if (!file) return null;

//     const url = URL.createObjectURL(file);

//     if (file.type?.includes("pdf")) {
//       return <iframe src={url} title="pdf" className={styles.preview} />;
//     }

//     return <img src={url} alt="preview" className={styles.preview} />;
//   };

//   return (
//     <div className={styles.container}>

//       <h2 className={styles.heading}>My Assignments</h2>

//       {filteredAssignments.length === 0 && (
//         <div className={styles.empty}>No assignments available</div>
//       )}

//       {filteredAssignments.map(a => {

//         const mySubmission = submissions.find(
//           s =>
//             s.assignmentId === a._id &&
//             s.studentId === currentUser._id
//         );

//         return (
//           <div key={a._id} className={styles.card}>

//             {/* HEADER */}
//             <div className={styles.header}>
//               <h3>{a.title}</h3>
//               <span className={`${styles.badge} ${styles[a.label]}`}>
//                 {a.label}
//               </span>
//             </div>

//             {/* DESCRIPTION */}
//             <p className={styles.desc}>{a.description}</p>

//             {/* META */}
//             <div className={styles.meta}>
//               <span>{a.subject}</span>
//               <span>{a.class}</span>
//               <span>Deadline: {formatDate(a.deadline)}</span>
//             </div>

//             {/* FILE PREVIEW */}
//             {renderFile(a.file)}

//             {/* STUDENT ACTION */}
//             {mySubmission ? (
//               <div className={styles.status}>

//                 <span>
//                   Status:
//                   <b className={
//                     mySubmission.status === "late"
//                       ? styles.late
//                       : styles.ontime
//                   }>
//                     {mySubmission.status}
//                   </b>
//                 </span>

//                 <span>Marks: {mySubmission.marks ?? "Pending"}</span>

//                 <span>Remarks: {mySubmission.remarks || "—"}</span>

//                 <span>
//                   Reviewed:
//                   {mySubmission.reviewed ? " ✅" : " ❌"}
//                 </span>

//               </div>
//             ) : (
//               <div className={styles.submitBox}>

//                 <input
//                   type="file"
//                   onChange={(e) =>
//                     handleFileChange(a._id, e.target.files[0])
//                   }
//                 />

//                 <button onClick={() => handleSubmit(a._id)}>
//                   Submit Assignment
//                 </button>

//               </div>
//             )}

//           </div>
//         );
//       })}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useData } from "../../context/dataContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./assignment.module.css";

export default function AssignmentStudent() {

  const { assignments, submissions, submitAssignment } = useData();
  const { currentUser, isLoading } = useAuth();

  const [fileMap, setFileMap] = useState({});
  const [notifications, setNotifications] = useState([]);

  if (isLoading) return <div className={styles.empty}>Loading...</div>;
  if (!currentUser) return <div className={styles.empty}>Login required</div>;

  // ✅ FILTER
  const filteredAssignments = assignments.filter(a =>
    a.class === currentUser.class &&
    currentUser.subjects?.includes(a.subject)
  );

  // 🔔 NEW ASSIGNMENT NOTIFICATION
  useEffect(() => {
    if (filteredAssignments.length > 0) {
      setNotifications(prev => [
        "New assignments available",
        ...prev
      ]);
    }
  }, [assignments]);

  // 📅 DATE FORMAT
  const formatDate = d =>
    d ? new Date(d).toLocaleDateString() : "N/A";

  // ⏳ COUNTDOWN
  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const due = new Date(deadline);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "Overdue";
    if (diff === 0) return "Due today";
    return `${diff} days left`;
  };

  // 📁 FILE CHANGE
  const handleFileChange = (id, file) => {
    setFileMap(prev => ({ ...prev, [id]: file }));
  };

  // 📤 SUBMIT / REUPLOAD
  const handleSubmit = (assignmentId) => {

    const file = fileMap[assignmentId];
    if (!file) return alert("Upload file");

    const assignment = assignments.find(a => a._id === assignmentId);
    const isLate = new Date() > new Date(assignment.deadline);

    submitAssignment({
      _id: `sub_${Date.now()}`,
      assignmentId,
      studentId: currentUser._id,
      file,
      submittedAt: new Date().toISOString(),
      status: isLate ? "late" : "on-time",
      marks: null,
      remarks: "",
      reviewed: false
    });

    setNotifications(prev => ["Assignment submitted", ...prev]);
  };

  // 📄 FILE PREVIEW
  const renderFile = (file) => {
    if (!file) return null;

    const url = URL.createObjectURL(file);

    if (file.type?.includes("pdf")) {
      return <iframe src={url} className={styles.preview} />;
    }

    return <img src={url} className={styles.preview} />;
  };

  return (
    <div className={styles.container}>

      <h2 className={styles.heading}>My Assignments</h2>

      {/* 🔔 NOTIFICATIONS */}
      <div className={styles.notifications}>
        {notifications.map((n, i) => (
          <div key={i} className={styles.notice}>{n}</div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className={styles.empty}>No assignments</div>
      )}

      {filteredAssignments.map(a => {

        const mySubmission = submissions.find(
          s =>
            s.assignmentId === a._id &&
            s.studentId === currentUser._id
        );

        const deadlineStatus = getDeadlineStatus(a.deadline);
        const isOver = deadlineStatus === "Overdue";

        return (
          <div key={a._id} className={styles.card}>

            <div className={styles.header}>
              <h3>{a.title}</h3>
              <span className={`${styles.badge} ${styles[a.label]}`}>
                {a.label}
              </span>
            </div>

            <p>{a.description}</p>

            <div className={styles.meta}>
              <span>{a.subject}</span>
              <span>{a.class}</span>
              <span>Deadline: {formatDate(a.deadline)}</span>
              <span className={styles.deadline}>{deadlineStatus}</span>
            </div>

            {renderFile(a.file)}

            {mySubmission ? (
              <div className={styles.status}>
                <span>{mySubmission.status}</span>
                <span>Marks: {mySubmission.marks ?? "Pending"}</span>
                <span>Reviewed: {mySubmission.reviewed ? "✅" : "❌"}</span>

                {/* 🔁 REUPLOAD */}
                {!isOver && (
                  <div className={styles.reupload}>
                    <input
                      type="file"
                      onChange={e =>
                        handleFileChange(a._id, e.target.files[0])
                      }
                    />
                    <button onClick={() => handleSubmit(a._id)}>
                      Re-upload
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.submitBox}>
                <input
                  type="file"
                  onChange={e =>
                    handleFileChange(a._id, e.target.files[0])
                  }
                />
                <button onClick={() => handleSubmit(a._id)}>
                  Submit
                </button>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}