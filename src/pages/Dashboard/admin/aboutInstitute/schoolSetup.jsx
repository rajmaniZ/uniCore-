import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./schoolSetup.module.css";
import { createClass, deleteClass, getClasses } from "../../../../api/classApi";
import { createStudent, createTeacher, getUsers, updateUser } from "../../../../api/userAPI";
import { createSubject, getSubjects } from "../../../../api/subjectApi";
import { getMyInstitute } from "../../../../api/instituteApi";

const CLASS_RANGES = {
  primary: { start: 0, end: 5 },
  secondary: { start: 0, end: 10 },
  senior_secondary: { start: 0, end: 12 },
};

const SECTION_OPTIONS = ["A", "B", "C", "D"];

const parseError = (err) =>
  err?.response?.data?.msg ||
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong";

const toApiType = (value) => {
  if (value === "optional") return "fun";
  if (value === "compulsory") return "complusory";
  return "elective";
};

function SchoolSetup() {
  const [instituteId, setInstituteId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [toasts, setToasts] = useState([]);

  const [stage, setStage] = useState("secondary");
  const [teacherInput, setTeacherInput] = useState({ name: "", email: "", employeeId: "" });
  const [studentInput, setStudentInput] = useState({
    name: "",
    email: "",
    rollNumber: "",
    classId: "",
    section: "A",
  });
  const [subjectInput, setSubjectInput] = useState({
    classId: "",
    name: "",
    code: "",
    type: "compulsory",
    teacherId: "",
  });

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((entry) => entry.id !== id));
    }, 3500);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const institute = await getMyInstitute();
      if (!institute?._id) throw new Error("Institute not found");
      setInstituteId(String(institute._id));

      const [classData, teacherData, studentData, subjectData] = await Promise.all([
        getClasses(String(institute._id)),
        getUsers({ role: "teacher" }),
        getUsers({ role: "student" }),
        getSubjects({ instituteId: String(institute._id) }),
      ]);

      setClasses(Array.isArray(classData) ? classData : []);
      setTeachers(Array.isArray(teacherData) ? teacherData : []);
      setStudents(Array.isArray(studentData) ? studentData : []);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
    } catch (err) {
      toast(parseError(err), "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const subjectsByClass = useMemo(() => {
    const map = {};
    for (const subject of subjects) {
      const cls = subject?.class?._id || subject?.class;
      if (!cls) continue;
      const key = String(cls);
      if (!map[key]) map[key] = [];
      map[key].push(subject);
    }
    return map;
  }, [subjects]);

  const teacherMap = useMemo(
    () => Object.fromEntries(teachers.map((entry) => [String(entry._id), entry])),
    [teachers]
  );

  const handleGenerateClasses = async () => {
    if (!instituteId) return;
    setBusy(true);
    try {
      const range = CLASS_RANGES[stage];
      const existingNames = new Set(classes.map((entry) => String(entry.name || "").trim().toLowerCase()));
      for (let value = range.start; value <= range.end; value += 1) {
        const name = `Class ${value}`;
        if (existingNames.has(name.toLowerCase())) continue;
        await createClass({
          name,
          code: `C${value}`,
          type: stage === "senior_secondary" ? "senior" : stage,
          instituteId,
        });
      }
      toast("Classes generated", "success");
      await loadAll();
    } catch (err) {
      toast(parseError(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const handleCreateTeacher = async () => {
    if (!teacherInput.name || !teacherInput.email || !teacherInput.employeeId) return;
    setBusy(true);
    try {
      await createTeacher({
        name: teacherInput.name.trim(),
        email: teacherInput.email.trim(),
        employeeId: teacherInput.employeeId.trim(),
      });
      setTeacherInput({ name: "", email: "", employeeId: "" });
      toast("Teacher created", "success");
      await loadAll();
    } catch (err) {
      toast(parseError(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const handleCreateStudent = async () => {
    if (!studentInput.name || !studentInput.email || !studentInput.rollNumber || !studentInput.classId) return;
    setBusy(true);
    try {
      await createStudent({
        name: studentInput.name.trim(),
        email: studentInput.email.trim(),
        rollNumber: studentInput.rollNumber.trim(),
        classId: studentInput.classId,
        section: studentInput.section,
      });
      setStudentInput({ name: "", email: "", rollNumber: "", classId: "", section: "A" });
      toast("Student created", "success");
      await loadAll();
    } catch (err) {
      toast(parseError(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const handleCreateSubjectMapping = async () => {
    if (!subjectInput.classId || !subjectInput.name || !subjectInput.teacherId) return;
    setBusy(true);
    try {
      const subject = await createSubject({
        classId: subjectInput.classId,
        name: subjectInput.name.trim(),
        code: subjectInput.code.trim().toUpperCase(),
        type: toApiType(subjectInput.type),
      });

      const teacher = teacherMap[subjectInput.teacherId];
      const current = Array.isArray(teacher?.subjects) ? teacher.subjects.map((entry) => String(entry?._id || entry)) : [];
      const merged = Array.from(new Set([...current, String(subject?._id)]));
      await updateUser(subjectInput.teacherId, { subjectIds: merged });

      setSubjectInput({ classId: "", name: "", code: "", type: "compulsory", teacherId: "" });
      toast("Subject linked to teacher", "success");
      await loadAll();
    } catch (err) {
      toast(parseError(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    setBusy(true);
    try {
      await deleteClass(id);
      toast("Class deleted", "success");
      await loadAll();
    } catch (err) {
      toast(parseError(err), "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className={styles.root}>Loading school setup...</div>;

  return (
    <div className={styles.root}>
      <div className={styles.toastWrap}>
        {toasts.map((entry) => (
          <div key={entry.id} className={`${styles.toast} ${entry.type === "error" ? styles.toastError : styles.toastSuccess}`}>
            {entry.message}
          </div>
        ))}
      </div>

      <h2 className={styles.title}>School Academic Setup</h2>

      <section className={styles.card}>
        <h3>Auto Generate Classes</h3>
        <div className={styles.row}>
          <select className={styles.select} value={stage} onChange={(e) => setStage(e.target.value)}>
            <option value="primary">Primary (0-5)</option>
            <option value="secondary">Secondary (0-10)</option>
            <option value="senior_secondary">Senior Secondary (0-12)</option>
          </select>
          <button className={styles.primaryBtn} type="button" disabled={busy} onClick={handleGenerateClasses}>
            Generate Classes
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <h3>Create Teacher</h3>
        <div className={styles.row}>
          <input className={styles.input} placeholder="Name" value={teacherInput.name} onChange={(e) => setTeacherInput((p) => ({ ...p, name: e.target.value }))} />
          <input className={styles.input} placeholder="Email" value={teacherInput.email} onChange={(e) => setTeacherInput((p) => ({ ...p, email: e.target.value }))} />
          <input className={styles.input} placeholder="Employee ID" value={teacherInput.employeeId} onChange={(e) => setTeacherInput((p) => ({ ...p, employeeId: e.target.value }))} />
          <button className={styles.primaryBtn} type="button" disabled={busy} onClick={handleCreateTeacher}>Add Teacher</button>
        </div>
      </section>

      <section className={styles.card}>
        <h3>Create Student</h3>
        <div className={styles.row}>
          <input className={styles.input} placeholder="Name" value={studentInput.name} onChange={(e) => setStudentInput((p) => ({ ...p, name: e.target.value }))} />
          <input className={styles.input} placeholder="Email" value={studentInput.email} onChange={(e) => setStudentInput((p) => ({ ...p, email: e.target.value }))} />
          <input className={styles.input} placeholder="Roll Number" value={studentInput.rollNumber} onChange={(e) => setStudentInput((p) => ({ ...p, rollNumber: e.target.value }))} />
          <select className={styles.select} value={studentInput.classId} onChange={(e) => setStudentInput((p) => ({ ...p, classId: e.target.value }))}>
            <option value="">Select Class</option>
            {classes.map((entry) => <option key={entry._id} value={entry._id}>{entry.name}</option>)}
          </select>
          <select className={styles.select} value={studentInput.section} onChange={(e) => setStudentInput((p) => ({ ...p, section: e.target.value }))}>
            {SECTION_OPTIONS.map((entry) => <option key={entry} value={entry}>Section {entry}</option>)}
          </select>
          <button className={styles.primaryBtn} type="button" disabled={busy} onClick={handleCreateStudent}>Add Student</button>
        </div>
      </section>

      <section className={styles.card}>
        <h3>Add Subject with Teacher</h3>
        <div className={styles.row}>
          <select className={styles.select} value={subjectInput.classId} onChange={(e) => setSubjectInput((p) => ({ ...p, classId: e.target.value }))}>
            <option value="">Select Class</option>
            {classes.map((entry) => <option key={entry._id} value={entry._id}>{entry.name}</option>)}
          </select>
          <input className={styles.input} placeholder="Subject Name" value={subjectInput.name} onChange={(e) => setSubjectInput((p) => ({ ...p, name: e.target.value }))} />
          <input className={styles.input} placeholder="Code" value={subjectInput.code} onChange={(e) => setSubjectInput((p) => ({ ...p, code: e.target.value }))} />
          <select className={styles.select} value={subjectInput.type} onChange={(e) => setSubjectInput((p) => ({ ...p, type: e.target.value }))}>
            <option value="compulsory">Compulsory</option>
            <option value="elective">Elective</option>
            <option value="optional">Optional</option>
          </select>
          <select className={styles.select} value={subjectInput.teacherId} onChange={(e) => setSubjectInput((p) => ({ ...p, teacherId: e.target.value }))}>
            <option value="">Select Teacher</option>
            {teachers.map((entry) => <option key={entry._id} value={entry._id}>{entry.name}</option>)}
          </select>
          <button className={styles.primaryBtn} type="button" disabled={busy} onClick={handleCreateSubjectMapping}>Add Subject</button>
        </div>
      </section>

      <section className={styles.card}>
        <h3>Class Table</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Class</th>
              <th>Subjects</th>
              <th>Students</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr><td colSpan={4}>No classes found</td></tr>
            ) : classes.map((entry) => {
              const classId = String(entry._id);
              const classSubjects = subjectsByClass[classId] || [];
              const classStudents = students.filter((student) => String(student.classId?._id || student.classId) === classId);
              return (
                <tr key={entry._id}>
                  <td>{entry.name}</td>
                  <td>{classSubjects.length}</td>
                  <td>{classStudents.length}</td>
                  <td>
                    <button className={styles.dangerBtn} type="button" onClick={() => handleDeleteClass(entry._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default SchoolSetup;
