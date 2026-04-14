import { useState } from "react";
import { useData } from "../../context/dataContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./assignment.module.css";

export default function Assignment() {

  const {
    students,
    assignments,
    submissions,
    createAssignment,
    submitAssignment,
    gradeSubmission
  } = useData();

  const { currentUser } = useAuth();

  const isTeacher = ["teacher", "hod", "admin"].includes(currentUser?.role);

  const [form, setForm] = useState({
    department: "",
    year: "",
    semester: "",
    subject: "",
    class: "",
    title: "",
    description: "",
    label: "normal",
    deadline: "",
    announcement: "",
    instructions: "",
    file: null
  });

  const [file, setFile] = useState(null);
  const [openId, setOpenId] = useState(null);

  const semesterMap = {
    "1": ["1", "2"],
    "2": ["3", "4"],
    "3": ["5", "6"],
    "4": ["7", "8"]
  };

  const semesters = semesterMap[form.year] || [];

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "N/A";

  // ✅ CREATE ASSIGNMENT
  const handleCreate = () => {

    if (!form.title || !form.subject || !form.class) {
      return alert("Fill required fields");
    }

    createAssignment({
      ...form,
      _id: `assign_${Date.now()}`,
      teacherId: currentUser._id,
      createdAt: new Date().toISOString(),
      announcement: form.announcement || null,
      instructions: form.instructions || null
    });

    alert("Assignment Created");
  };

  // ✅ STUDENT SUBMIT
  const handleSubmit = (assignmentId) => {

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

    alert("Submitted");
    setFile(null);
  };

  // ✅ FILE PREVIEW
  const renderFile = (file) => {
    if (!file) return null;

    const url = URL.createObjectURL(file);

    if (file.type?.includes("pdf")) {
      return <iframe src={url} title="pdf" className={styles.preview} />;
    }

    return <img src={url} alt="preview" className={styles.preview} />;
  };

  return (
    <div className={styles.container}>

      {/* ================== CREATE (Teacher Only) ================== */}
      {isTeacher && (
        <>
          <h2>Create Assignment</h2>

          <div className={styles.filters}>
            <select onChange={e => setForm({...form, department: e.target.value})}>
              <option>Department</option>
              <option>CSE</option>
              <option>IT</option>
            </select>

            <select onChange={e => setForm({...form, year: e.target.value})}>
              <option>Year</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>

            <select onChange={e => setForm({...form, semester: e.target.value})}>
              <option>Semester</option>
              {semesters.map(s => <option key={s}>{s}</option>)}
            </select>

            <input placeholder="Subject" onChange={e => setForm({...form, subject: e.target.value})}/>
            <input placeholder="Class" onChange={e => setForm({...form, class: e.target.value})}/>
          </div>

          <div className={styles.form}>
            <input placeholder="Title" onChange={e => setForm({...form, title: e.target.value})}/>
            <textarea placeholder="Question" onChange={e => setForm({...form, description: e.target.value})}/>
            <input type="file" onChange={e => setForm({...form, file: e.target.files[0]})}/>

            <select onChange={e => setForm({...form, label: e.target.value})}>
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="must">Must</option>
            </select>

            <input type="date" onChange={e => setForm({...form, deadline: e.target.value})}/>

            <input placeholder="Announcement" onChange={e => setForm({...form, announcement: e.target.value})}/>
            <textarea placeholder="Instructions" onChange={e => setForm({...form, instructions: e.target.value})}/>

            <button onClick={handleCreate}>Create</button>
          </div>
        </>
      )}

      {/* ================== LIST ================== */}
      <h2>Assignments</h2>

      {assignments.map(a => {

        const subs = submissions.filter(s => s.assignmentId === a._id);

        const mySub = submissions.find(
          s => s.assignmentId === a._id && s.studentId === currentUser._id
        );

        return (
          <div key={a._id} className={styles.card}>

            <div className={styles.rowTop}>
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
            </div>

            {/* FILE */}
            {renderFile(a.file)}

            {/* STUDENT VIEW */}
            {!isTeacher && (
              <>
                {mySub ? (
                  <div className={styles.status}>
                    <span>{mySub.status}</span>
                    <span>Marks: {mySub.marks ?? "Pending"}</span>
                    <span>Reviewed: {mySub.reviewed ? "✅" : "❌"}</span>
                  </div>
                ) : (
                  <>
                    <input type="file" onChange={e => setFile(e.target.files[0])}/>
                    <button onClick={() => handleSubmit(a._id)}>Submit</button>
                  </>
                )}
              </>
            )}

            {/* TEACHER VIEW */}
            {isTeacher && (
              <>
                <div>Submitted: {subs.length}</div>

                <button onClick={() => setOpenId(openId === a._id ? null : a._id)}>
                  View
                </button>

                {openId === a._id && subs.map(s => {
                  const student = students.find(st => st._id === s.studentId);

                  return (
                    <div key={s._id} className={styles.subRow}>
                      <span>{student?.name}</span>
                      <span>{s.status}</span>

                      {renderFile(s.file)}

                      <input
                        type="number"
                        placeholder="Marks"
                        onChange={e => gradeSubmission(s._id, e.target.value, s.remarks)}
                      />

                      <input
                        placeholder="Remarks"
                        onChange={e => gradeSubmission(s._id, s.marks, e.target.value)}
                      />

                      <label>
                        <input
                          type="checkbox"
                          onChange={e => gradeSubmission(s._id, s.marks, s.remarks, e.target.checked)}
                        />
                        Reviewed
                      </label>
                    </div>
                  );
                })}
              </>
            )}

          </div>
        );
      })}
    </div>
  );
}