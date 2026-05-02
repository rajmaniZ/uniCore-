
import { useEffect, useState, useRef, useCallback } from "react";
import API from "../../../../api/axios";
import {
  addDeptToConfig,
  addCourseToConfig,
  addSubjectToConfig,
  removeDeptFromConfig,
  removeCourseFromConfig,
  removeSubjectFromConfig,
} from "../../../../api/configApi";
import { createDepartment, updateDepartment, deleteDepartment } from "../../../../api/departmentApi";
import { createCourse, updateCourse, deleteCourse } from "../../../../api/courseApi";
import { createSubject, updateSubject, deleteSubject } from "../../../../api/subjectApi";
import { createHod, createTeacher, getUsers } from "../../../../api/userAPI";
import { getMyInstitute } from "../../../../api/instituteApi";
import styles from "./collegeSetup.module.css";

const COURSE_TYPES = ["semester", "annual"];
const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6];
const SUBJECT_TYPES = ["compulsory", "elective", "optional"];

const generateStructure = (duration, type) => {
  const total = type === "semester" ? duration * 2 : duration;
  return Array.from({ length: total }, (_, i) => ({
    number: i + 1,
    label: type === "semester" ? `Semester ${i + 1}` : `Year ${i + 1}`,
    subjects: [],
  }));
};

const emptyHod = () => ({ name: "", email: "", employeeId: "" });
const emptyTeacher = () => ({ name: "", email: "", employeeId: "" });
const emptyCourse = () => ({
  _id: null,
  name: "",
  code: "",
  duration: 4,
  type: "semester",
  description: "",
  structure: generateStructure(4, "semester"),
  _isNew: true,
});
const emptyDept = () => ({
  _id: null,
  name: "",
  code: "",
  about: "",
  hod: emptyHod(),
  teachers: [],
  courses: [],
  _isNew: true,
});

const parseError = (err) => {
  if (!err) return "Unknown error";
  return (
    err?.response?.data?.msg ||
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Something went wrong"
  );
};

function Pill({ label, color = "blue" }) {
  return <span className={`${styles.pill} ${styles[`pill_${color}`]}`}>{label}</span>;
}

function IconBtn({ onClick, title, children, variant = "ghost", disabled }) {
  return (
    <button
      className={`${styles.iconBtn} ${styles[`iconBtn_${variant}`]}`}
      onClick={onClick}
      title={title}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Field({ label, error, children, required }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.fieldRequired}>*</span>}
      </label>
      {children}
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

function StepBadge({ step, label, active, done }) {
  return (
    <div className={`${styles.stepBadge} ${active ? styles.stepBadge_active : ""} ${done ? styles.stepBadge_done : ""}`}>
      <div className={styles.stepCircle}>
        {done ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : step}
      </div>
      <span className={styles.stepLabel}>{label}</span>
    </div>
  );
}

function Modal({ open, onClose, title, children, size = "md" }) {
  const ref = useRef();
  useEffect(() => {
    if (open) ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${styles[`modal_${size}`]}`} ref={ref} tabIndex={-1}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <IconBtn onClick={onClose} title="Close" variant="ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </IconBtn>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

function Confirm({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles.modal_sm}`}>
        <div className={styles.confirmBody}>
          <div className={styles.confirmIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className={styles.confirmMessage}>{message}</p>
          <div className={styles.confirmActions}>
            <button className={styles.btnOutline} onClick={onCancel} type="button">Cancel</button>
            <button className={styles.btnDanger} onClick={onConfirm} type="button">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className={styles.toastContainer}>
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[`toast_${t.type}`]}`}>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function SubjectRow({ subject, sIdx, dIdx, cIdx, semIdx, updateField, deleteSubjectRow, allTeachers }) {
  return (
    <tr className={styles.subjectRow}>
      <td className={styles.td}>
        <input
          className={styles.tableInput}
          placeholder="Subject name"
          value={subject.name}
          onChange={(e) =>
            updateField(["departments", dIdx, "courses", cIdx, "structure", semIdx, "subjects", sIdx, "name"], e.target.value)
          }
        />
      </td>
      <td className={styles.td}>
        <input
          className={`${styles.tableInput} ${styles.tableInput_sm}`}
          placeholder="Code"
          value={subject.code || ""}
          onChange={(e) =>
            updateField(["departments", dIdx, "courses", cIdx, "structure", semIdx, "subjects", sIdx, "code"], e.target.value.toUpperCase())
          }
        />
      </td>
      <td className={styles.td}>
        <select
          className={styles.tableSelect}
          value={subject.subjectType || "compulsory"}
          onChange={(e) =>
            updateField(["departments", dIdx, "courses", cIdx, "structure", semIdx, "subjects", sIdx, "subjectType"], e.target.value)
          }
        >
          {SUBJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </td>
      <td className={styles.td}>
        <select
          className={styles.tableSelect}
          value={subject.teacherId || ""}
          onChange={(e) =>
            updateField(["departments", dIdx, "courses", cIdx, "structure", semIdx, "subjects", sIdx, "teacherId"], e.target.value)
          }
        >
          <option value="">— Assign Teacher —</option>
          {allTeachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} {t.departmentId?.name ? `(${t.departmentId.name})` : ""}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.td}>
        <IconBtn onClick={() => deleteSubjectRow(dIdx, cIdx, semIdx, sIdx)} title="Remove subject" variant="danger">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </IconBtn>
      </td>
    </tr>
  );
}

function StructureBlock({ sem, semIdx, dIdx, cIdx, updateField, deleteSubjectRow, addSubjectRow, allTeachers }) {
  const [open, setOpen] = useState(semIdx === 0);
  return (
    <div className={styles.structureBlock}>
      <button type="button" className={styles.structureToggle} onClick={() => setOpen((p) => !p)}>
        <span className={styles.structureLabel}>
          <span className={styles.structureBullet} />
          {sem.label}
        </span>
        <span className={styles.structureMeta}>
          {sem.subjects.length} subject{sem.subjects.length !== 1 ? "s" : ""}
        </span>
        <svg className={`${styles.chevron} ${open ? styles.chevron_open : ""}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className={styles.structureContent}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Subject Name</th>
                  <th className={`${styles.th} ${styles.th_sm}`}>Code</th>
                  <th className={styles.th}>Type</th>
                  <th className={styles.th}>Teacher</th>
                  <th className={`${styles.th} ${styles.th_action}`} />
                </tr>
              </thead>
              <tbody>
                {sem.subjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyRow}>No subjects yet — add one below</td>
                  </tr>
                ) : (
                  sem.subjects.map((sub, sIdx) => (
                    <SubjectRow
                      key={sIdx}
                      subject={sub}
                      sIdx={sIdx}
                      dIdx={dIdx}
                      cIdx={cIdx}
                      semIdx={semIdx}
                      updateField={updateField}
                      deleteSubjectRow={deleteSubjectRow}
                      allTeachers={allTeachers}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <button type="button" className={styles.addRowBtn} onClick={() => addSubjectRow(dIdx, cIdx, semIdx)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Subject
          </button>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, cIdx, dIdx, updateField, deleteCourseRow, addSubjectRow, deleteSubjectRow, allTeachers }) {
  const [open, setOpen] = useState(true);

  const handleTypeOrDurationChange = (field, value) => {
    const newVal = field === "duration" ? parseInt(value) : value;
    const dur = field === "duration" ? newVal : parseInt(course.duration);
    const type = field === "type" ? newVal : course.type;
    updateField(["departments", dIdx, "courses", cIdx, field], newVal);
    updateField(["departments", dIdx, "courses", cIdx, "structure"], generateStructure(dur, type));
  };

  return (
    <div className={styles.courseCard}>
      <div className={styles.courseHeader}>
        <button type="button" className={styles.courseToggleBtn} onClick={() => setOpen((p) => !p)}>
          <svg className={`${styles.chevron} ${open ? styles.chevron_open : ""}`}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className={styles.courseName}>
            {course.name || <em style={{ opacity: 0.45 }}>Untitled Course</em>}
          </span>
          <div className={styles.courseMeta}>
            <Pill label={course.type} color="blue" />
            <Pill label={`${course.duration}y`} color="slate" />
            <Pill label={`${course.structure.reduce((a, s) => a + s.subjects.length, 0)} subjects`} color="green" />
            {course._id && <Pill label="Saved" color="green" />}
            {course._isNew && <Pill label="New" color="amber" />}
          </div>
        </button>
        <IconBtn onClick={() => deleteCourseRow(dIdx, cIdx)} title="Delete course" variant="danger">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </IconBtn>
      </div>
      {open && (
        <div className={styles.courseBody}>
          <div className={styles.courseFields}>
            <Field label="Course Name" required>
              <input className={styles.input} placeholder="e.g. B.Tech Computer Science"
                value={course.name}
                onChange={(e) => updateField(["departments", dIdx, "courses", cIdx, "name"], e.target.value)}
              />
            </Field>
            <Field label="Course Code">
              <input className={styles.input} placeholder="e.g. BTECH-CS"
                value={course.code}
                onChange={(e) => updateField(["departments", dIdx, "courses", cIdx, "code"], e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="System Type" required>
              <select className={styles.select} value={course.type}
                onChange={(e) => handleTypeOrDurationChange("type", e.target.value)}>
                {COURSE_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </Field>
            <Field label="Duration (Years)" required>
              <select className={styles.select} value={course.duration}
                onChange={(e) => handleTypeOrDurationChange("duration", e.target.value)}>
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d} Year{d > 1 ? "s" : ""}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Course Description">
            <textarea className={styles.textarea} rows={2} placeholder="Brief description..."
              value={course.description}
              onChange={(e) => updateField(["departments", dIdx, "courses", cIdx, "description"], e.target.value)}
            />
          </Field>
          <div className={styles.sectionTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Academic Structure
            <span className={styles.sectionSub}>
              ({course.type === "semester" ? course.duration * 2 + " semesters" : course.duration + " years"})
            </span>
          </div>
          <div className={styles.structureList}>
            {course.structure.map((sem, semIdx) => (
              <StructureBlock
                key={semIdx}
                sem={sem}
                semIdx={semIdx}
                dIdx={dIdx}
                cIdx={cIdx}
                updateField={updateField}
                deleteSubjectRow={deleteSubjectRow}
                addSubjectRow={addSubjectRow}
                allTeachers={allTeachers}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TeacherRow({ teacher, tIdx, dIdx, updateField, onDelete }) {
  return (
    <div className={styles.personRow}>
      <div className={styles.personAvatar}>
        {teacher.name ? teacher.name[0].toUpperCase() : "T"}
      </div>
      <div className={styles.personFields}>
        <input className={styles.input} placeholder="Teacher Name" value={teacher.name}
          onChange={(e) => updateField(["departments", dIdx, "teachers", tIdx, "name"], e.target.value)}
        />
        <input className={styles.input} placeholder="Email" type="email" value={teacher.email}
          onChange={(e) => updateField(["departments", dIdx, "teachers", tIdx, "email"], e.target.value)}
        />
        <input className={styles.input} placeholder="Employee ID" value={teacher.employeeId}
          onChange={(e) => updateField(["departments", dIdx, "teachers", tIdx, "employeeId"], e.target.value)}
        />
      </div>
      <IconBtn onClick={onDelete} title="Remove teacher" variant="danger">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </IconBtn>
    </div>
  );
}

function DeptCard({
  dept, dIdx, updateField, deleteDeptRow,
  addCourseRow, deleteCourseRow, addSubjectRow, deleteSubjectRow,
  addTeacherRow, deleteTeacherRow, allTeachers,
}) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "courses", "teachers"];

  return (
    <div className={styles.deptCard}>
      <div className={styles.deptHeader}>
        <div className={styles.deptIcon}>
          {dept.name ? dept.name[0].toUpperCase() : "D"}
        </div>
        <div className={styles.deptHeaderInfo}>
          <h3 className={styles.deptName}>
            {dept.name || <em style={{ opacity: 0.4 }}>New Department</em>}
          </h3>
          <div className={styles.deptPills}>
            <Pill label={`${dept.courses.length} courses`} color="blue" />
            <Pill label={`${dept.teachers.length} teachers`} color="amber" />
            <Pill label={`${dept.courses.reduce((a, c) => a + c.structure.reduce((b, s) => b + s.subjects.length, 0), 0)} subjects`} color="green" />
            {dept._id && <Pill label="Saved" color="green" />}
            {dept._isNew && <Pill label="New" color="amber" />}
          </div>
        </div>
        <IconBtn onClick={() => deleteDeptRow(dIdx)} title="Delete department" variant="danger">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </IconBtn>
      </div>

      <div className={styles.tabBar}>
        {tabs.map((t) => (
          <button key={t} type="button"
            className={`${styles.tab} ${tab === t ? styles.tab_active : ""}`}
            onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className={styles.tabContent}>
          <div className={styles.formGrid}>
            <Field label="Department Name" required>
              <input className={styles.input} placeholder="e.g. Computer Science & Engineering"
                value={dept.name}
                onChange={(e) => updateField(["departments", dIdx, "name"], e.target.value)}
              />
            </Field>
            <Field label="Dept. Code">
              <input className={styles.input} placeholder="e.g. CSE"
                value={dept.code}
                onChange={(e) => updateField(["departments", dIdx, "code"], e.target.value.toUpperCase())}
              />
            </Field>
          </div>
          <Field label="About Department">
            <textarea className={styles.textarea} rows={3} placeholder="Short description about this department..."
              value={dept.about}
              onChange={(e) => updateField(["departments", dIdx, "about"], e.target.value)}
            />
          </Field>

          <div className={styles.sectionTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Head of Department (HOD)
          </div>
          <div className={styles.hodBlock}>
            <div className={styles.personAvatar} style={{ width: 44, height: 44, fontSize: 18 }}>
              {dept.hod.name ? dept.hod.name[0].toUpperCase() : "H"}
            </div>
            <div className={styles.formGrid} style={{ flex: 1 }}>
              <Field label="Full Name">
                <input className={styles.input} placeholder="Dr. John Doe" value={dept.hod.name}
                  onChange={(e) => updateField(["departments", dIdx, "hod", "name"], e.target.value)}
                />
              </Field>
              <Field label="Email">
                <input className={styles.input} type="email" placeholder="hod@college.edu" value={dept.hod.email}
                  onChange={(e) => updateField(["departments", dIdx, "hod", "email"], e.target.value)}
                />
              </Field>
              <Field label="Employee ID">
                <input className={styles.input} placeholder="EMP001" value={dept.hod.employeeId}
                  onChange={(e) => updateField(["departments", dIdx, "hod", "employeeId"], e.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div className={styles.tabContent}>
          {dept.courses.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <p>No courses added yet</p>
            </div>
          ) : (
            <div className={styles.courseList}>
              {dept.courses.map((course, cIdx) => (
                <CourseCard
                  key={cIdx}
                  course={course}
                  cIdx={cIdx}
                  dIdx={dIdx}
                  updateField={updateField}
                  deleteCourseRow={deleteCourseRow}
                  addSubjectRow={addSubjectRow}
                  deleteSubjectRow={deleteSubjectRow}
                  allTeachers={allTeachers}
                />
              ))}
            </div>
          )}
          <button type="button" className={styles.addBtn} onClick={() => addCourseRow(dIdx)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Course
          </button>
        </div>
      )}

      {tab === "teachers" && (
        <div className={styles.tabContent}>
          {dept.teachers.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p>No teachers added yet</p>
            </div>
          ) : (
            <div className={styles.teacherList}>
              {dept.teachers.map((t, tIdx) => (
                <TeacherRow
                  key={tIdx}
                  teacher={t}
                  tIdx={tIdx}
                  dIdx={dIdx}
                  updateField={updateField}
                  onDelete={() => deleteTeacherRow(dIdx, tIdx)}
                />
              ))}
            </div>
          )}
          <button type="button" className={styles.addBtn} onClick={() => addTeacherRow(dIdx)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Teacher
          </button>
        </div>
      )}
    </div>
  );
}

function SaveProgress({ current, total, label }) {
  const pct = total ? Math.round((current / total) * 100) : 0;
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressHeader}>
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CollegeSetup() {
  const [data, setData] = useState({ departments: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0, label: "" });
  const [instituteId, setInstituteId] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, message: "", onConfirm: null });
  const [newDeptModal, setNewDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");

  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  const askConfirm = (message) =>
    new Promise((resolve) => {
      setConfirm({
        open: true,
        message,
        onConfirm: () => { setConfirm({ open: false }); resolve(true); },
      });
    });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const inst = await getMyInstitute();
      if (!inst?._id) { setLoading(false); return; }
      setInstituteId(inst._id);

      const res = await API.get("/config/protected");
      const cfg = res.data;

      try {
        const teachers = await getUsers({ role: "teacher" });
        setAllTeachers(Array.isArray(teachers) ? teachers : []);
      } catch (_) {
        setAllTeachers([]);
      }

      setData({
        departments: (cfg?.departments || []).map((d) => ({
          _id: d.department?._id || null,
          name: d.department?.name || "",
          code: d.department?.code || "",
          about: d.department?.about || "",
          _isNew: false,
          hod: { name: "", email: "", employeeId: "" },
          teachers: [],
          courses: (d.courses || []).map((c) => ({
            _id: c.course?._id || null,
            name: c.course?.name || "",
            code: c.course?.code || "",
            duration: c.course?.duration || 4,
            type: c.systemType || "semester",
            description: c.course?.details?.description || "",
            _isNew: false,
            structure: (c.structure || []).map((s) => ({
              number: s.number,
              label: (c.systemType || "semester") === "semester"
                ? `Semester ${s.number}` : `Year ${s.number}`,
              subjects: (s.subjects || []).map((sub) => ({
                _id: sub.subject?._id || null,
                name: sub.subject?.name || "",
                code: sub.subject?.code || "",
                subjectType: "compulsory",
                teacherId: sub.teacher?._id || "",
                _isNew: false,
              })),
            })),
          })),
        })),
      });
    } catch (err) {
      toast(parseError(err), "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const updateField = useCallback((path, value) => {
    setData((prev) => {
      const copy = structuredClone(prev);
      let ref = copy;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return copy;
    });
  }, []);

  const addDepartment = () => {
    if (!newDeptName.trim()) return;
    setData((p) => ({
      ...p,
      departments: [
        ...p.departments,
        { ...emptyDept(), name: newDeptName.trim(), code: newDeptCode.trim().toUpperCase() },
      ],
    }));
    setNewDeptName(""); setNewDeptCode(""); setNewDeptModal(false);
    toast("Department added — don't forget to save!");
  };

  const deleteDeptRow = async (dIdx) => {
    await askConfirm("Delete this department and all its courses, subjects, and teachers?");
    const dept = data.departments[dIdx];

    if (dept._id) {
      try {
        
        await removeDeptFromConfig({ departmentId: dept._id }).catch(() => {});
        await deleteDepartment(dept._id);
        toast("Department deleted from server", "info");
      } catch (err) {
        toast(parseError(err), "error");
        return;
      }
    }

    setData((p) => {
      const copy = structuredClone(p);
      copy.departments.splice(dIdx, 1);
      return copy;
    });
  };

  const addCourseRow = (dIdx) => {
    setData((p) => {
      const copy = structuredClone(p);
      copy.departments[dIdx].courses.push(emptyCourse());
      return copy;
    });
  };

  const deleteCourseRow = async (dIdx, cIdx) => {
    await askConfirm("Delete this course and all its subjects?");
    const dept = data.departments[dIdx];
    const course = dept.courses[cIdx];

    if (dept._id && course._id) {
      try {
        await removeCourseFromConfig({ departmentId: dept._id, courseId: course._id }).catch(() => {});
        await deleteCourse(course._id);
        toast("Course deleted from server", "info");
      } catch (err) {
        toast(parseError(err), "error");
        return;
      }
    }

    setData((p) => {
      const copy = structuredClone(p);
      copy.departments[dIdx].courses.splice(cIdx, 1);
      return copy;
    });
  };

  const addSubjectRow = (dIdx, cIdx, semIdx) => {
    setData((p) => {
      const copy = structuredClone(p);
      copy.departments[dIdx].courses[cIdx].structure[semIdx].subjects.push({
        _id: null, name: "", code: "", subjectType: "compulsory", teacherId: "", _isNew: true,
      });
      return copy;
    });
  };

  const deleteSubjectRow = async (dIdx, cIdx, semIdx, sIdx) => {
    const dept = data.departments[dIdx];
    const course = dept.courses[cIdx];
    const sem = course.structure[semIdx];
    const sub = sem.subjects[sIdx];

    if (dept._id && course._id && sub._id) {
      try {
        await removeSubjectFromConfig({
          departmentId: dept._id,
          courseId: course._id,
          structureNumber: sem.number,
          subjectId: sub._id,
        }).catch(() => {});
        await deleteSubject(sub._id);
      } catch (err) {
        toast(parseError(err), "error");
        return;
      }
    }

    setData((p) => {
      const copy = structuredClone(p);
      copy.departments[dIdx].courses[cIdx].structure[semIdx].subjects.splice(sIdx, 1);
      return copy;
    });
  };

  const addTeacherRow = (dIdx) => {
    setData((p) => {
      const copy = structuredClone(p);
      copy.departments[dIdx].teachers.push(emptyTeacher());
      return copy;
    });
  };

  const deleteTeacherRow = (dIdx, tIdx) => {
    setData((p) => {
      const copy = structuredClone(p);
      copy.departments[dIdx].teachers.splice(tIdx, 1);
      return copy;
    });
  };

  const validate = () => {
    for (const dept of data.departments) {
      if (!dept.name.trim()) { toast("Every department must have a name", "error"); return false; }
      for (const course of dept.courses) {
        if (!course.name.trim()) { toast(`Course name required in "${dept.name}"`, "error"); return false; }
        for (const sem of course.structure) {
          for (const sub of sem.subjects) {
            if (!sub.name.trim()) {
              toast(`Subject name required in ${sem.label} of "${course.name}"`, "error");
              return false;
            }
          }
        }
      }
      for (const t of dept.teachers) {
        if (t.name && !t.email) { toast(`Teacher "${t.name}" needs an email`, "error"); return false; }
        if (t.name && !t.employeeId) { toast(`Teacher "${t.name}" needs an Employee ID`, "error"); return false; }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const totalDepts = data.departments.length;
    let done = 0;

    try {
      const updatedDepts = [];

      for (const dept of data.departments) {
        setSaveProgress({ current: done, total: totalDepts, label: `Saving ${dept.name}…` });

        let departmentId = dept._id;
        let isNewDept = !departmentId;

        if (!departmentId) {
          const res = await createDepartment({
            name: dept.name,
            code: dept.code,
            about: dept.about,
            instituteId,
          });
          departmentId = res._id;
        } else {
          await updateDepartment(departmentId, {
            name: dept.name,
            code: dept.code,
            about: dept.about,
          }).catch(() => {});
        }

        if (isNewDept) {
          await addDeptToConfig({ departmentId }).catch(() => {});
        }

        if (dept.hod?.email && dept.hod?.name && dept.hod?.employeeId) {
          try {
            const existing = await getUsers({ email: dept.hod.email, role: "hod" });
            const alreadyExists = Array.isArray(existing) && existing.length > 0;
            if (!alreadyExists) {
              await createHod({
                name: dept.hod.name,
                email: dept.hod.email,
                employeeId: dept.hod.employeeId,
                instituteId,
                departmentId,
              });
            }
          } catch (err) {
            toast(`HOD warning (${dept.name}): ${parseError(err)}`, "info");
          }
        }

        for (const teacher of dept.teachers) {
          if (!teacher.name || !teacher.email || !teacher.employeeId) continue;
          try {
            const existing = await getUsers({ email: teacher.email, role: "teacher" });
            const alreadyExists = Array.isArray(existing) && existing.length > 0;
            if (!alreadyExists) {
              await createTeacher({
                name: teacher.name,
                email: teacher.email,
                employeeId: teacher.employeeId,
                instituteId,
                departmentId,
              });
            }
          } catch (err) {
            toast(`Teacher warning (${teacher.name}): ${parseError(err)}`, "info");
          }
        }

        const updatedCourses = [];

        for (const course of dept.courses) {
          if (!course.name.trim()) continue;

          let courseId = course._id;
          let isNewCourse = !courseId;

          if (!courseId) {
            const res = await createCourse({
              name: course.name,
              code: course.code,
              departmentId,
              instituteId,
              duration: course.duration,
              type: course.type,
              description: course.description,
            });
            courseId = res._id;
          } else {
            await updateCourse(courseId, {
              name: course.name,
              code: course.code,
              duration: course.duration,
              type: course.type,
              description: course.description,
            }).catch(() => {});
          }

          if (isNewCourse) {
            await addCourseToConfig({
              departmentId,
              courseId,
              systemType: course.type,
              duration: course.duration,
            }).catch(() => {});
          }

          const updatedStructure = [];

          for (const sem of course.structure) {
            const updatedSubjects = [];

            for (const sub of sem.subjects) {
              if (!sub.name.trim()) continue;

              let subjectId = sub._id;
              let isNewSubject = !subjectId;

              if (!subjectId) {
                
                const res = await createSubject({
                  name: sub.name,
                  code: sub.code,
                  instituteId,
                  department: departmentId,   
                  course: courseId,           
                  semester: sem.number,
                  type: sub.subjectType || "compulsory",
                });
                subjectId = res._id;
              } else {
                await updateSubject(subjectId, {
                  name: sub.name,
                  code: sub.code,
                  type: sub.subjectType || "compulsory",
                }).catch(() => {});
              }

              if (isNewSubject) {
                await addSubjectToConfig({
                  departmentId,
                  courseId,
                  subjectId,
                  structureNumber: sem.number,
                  teacherId: sub.teacherId || null,
                }).catch(() => {});
              } else if (sub.teacherId) {
                
                await API.put("/config/subject/teacher", {
                  departmentId,
                  courseId,
                  structureNumber: sem.number,
                  subjectId,
                  teacherId: sub.teacherId,
                }).catch(() => {});
              }

              updatedSubjects.push({ ...sub, _id: subjectId, _isNew: false });
            }

            updatedStructure.push({ ...sem, subjects: updatedSubjects });
          }

          updatedCourses.push({ ...course, _id: courseId, _isNew: false, structure: updatedStructure });
        }

        updatedDepts.push({ ...dept, _id: departmentId, _isNew: false, courses: updatedCourses, teachers: [] });
        done++;
        setSaveProgress({ current: done, total: totalDepts, label: `${dept.name} saved ✓` });
      }

      setData((prev) => ({ ...prev, departments: updatedDepts }));

      try {
        const teachers = await getUsers({ role: "teacher" });
        setAllTeachers(Array.isArray(teachers) ? teachers : []);
      } catch (_) {}

      toast("All changes saved successfully!", "success");
    } catch (err) {
      toast(parseError(err), "error");
      console.error("SAVE ERROR:", err);
    } finally {
      setSaving(false);
      setSaveProgress({ current: 0, total: 0, label: "" });
    }
  };

  const totalCourses = data.departments.reduce((a, d) => a + d.courses.length, 0);
  const totalSubjects = data.departments.reduce(
    (a, d) => a + d.courses.reduce((b, c) => b + c.structure.reduce((x, s) => x + s.subjects.length, 0), 0), 0
  );
  const totalTeachers = data.departments.reduce((a, d) => a + d.teachers.length, 0);

  if (loading) {
    return (
      <loader/>
    );
  }

  return (
    <div className={styles.root}>
      <Toast toasts={toasts} />
      <Confirm
        open={confirm.open}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm({ open: false })}
      />

      {}
      <Modal open={newDeptModal} onClose={() => setNewDeptModal(false)} title="Add Department" size="sm">
        <Field label="Department Name" required>
          <input className={styles.input} placeholder="e.g. Computer Science & Engineering"
            value={newDeptName} autoFocus
            onChange={(e) => setNewDeptName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addDepartment()}
          />
        </Field>
        <Field label="Department Code">
          <input className={styles.input} placeholder="e.g. CSE"
            value={newDeptCode}
            onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
          />
        </Field>
        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnOutline} onClick={() => setNewDeptModal(false)}>Cancel</button>
          <button type="button" className={styles.btnPrimary} onClick={addDepartment} disabled={!newDeptName.trim()}>
            Create Department
          </button>
        </div>
      </Modal>

      {}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageHeaderIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h1 className={styles.pageTitle}>Academic Setup — College</h1>
            <p className={styles.pageSubtitle}>Define departments, courses, subjects and faculty</p>
          </div>
        </div>
        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryNum}>{data.departments.length}</span>
            <span className={styles.summaryLbl}>Depts</span>
          </div>
          <div className={styles.summaryDiv} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryNum}>{totalCourses}</span>
            <span className={styles.summaryLbl}>Courses</span>
          </div>
          <div className={styles.summaryDiv} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryNum}>{totalSubjects}</span>
            <span className={styles.summaryLbl}>Subjects</span>
          </div>
          <div className={styles.summaryDiv} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryNum}>{totalTeachers}</span>
            <span className={styles.summaryLbl}>Teachers</span>
          </div>
        </div>
      </div>

      {}
      <div className={styles.stepsRow}>
        <StepBadge step={1} label="Departments" active={data.departments.length === 0} done={data.departments.length > 0} />
        <div className={styles.stepLine} />
        <StepBadge step={2} label="Courses" active={data.departments.length > 0 && totalCourses === 0} done={totalCourses > 0} />
        <div className={styles.stepLine} />
        <StepBadge step={3} label="Subjects" active={totalCourses > 0 && totalSubjects === 0} done={totalSubjects > 0} />
        <div className={styles.stepLine} />
        <StepBadge step={4} label="HOD & Faculty" active={totalSubjects > 0 && totalTeachers === 0} done={totalTeachers > 0} />
      </div>

      {}
      <div className={styles.body}>
        {}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span>Departments</span>
            <button type="button" className={styles.addDeptBtn} onClick={() => setNewDeptModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <nav className={styles.sidebarNav}>
            {data.departments.length === 0 ? (
              <p className={styles.sidebarEmpty}>No departments yet</p>
            ) : (
              data.departments.map((d, i) => (
                <a key={i} href={`#dept-${i}`} className={styles.sidebarItem}>
                  <span className={styles.sidebarDot}>{d.name ? d.name[0].toUpperCase() : "?"}</span>
                  <span className={styles.sidebarItemName}>{d.name || "New Department"}</span>
                  <span className={styles.sidebarItemMeta}>{d.courses.length}c</span>
                </a>
              ))
            )}
          </nav>
          <div className={styles.tipBox}>
            <p className={styles.tipTitle}>Setup Flow</p>
            <ol className={styles.tipList}>
              <li>Create departments</li>
              <li>Add HOD per dept.</li>
              <li>Add courses + type</li>
              <li>Add subjects per sem.</li>
              <li>Set subject type</li>
              <li>Assign teachers</li>
              <li>Save all</li>
            </ol>
          </div>
        </aside>

        {}
        <main className={styles.main}>
          {data.departments.length === 0 ? (
            <div className={styles.bigEmptyState}>
              <div className={styles.bigEmptyIcon}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className={styles.bigEmptyTitle}>Start building your academic structure</h2>
              <p className={styles.bigEmptyText}>
                Create your first department to define courses, semesters, subjects, and faculty.
              </p>
              <button type="button" className={styles.btnPrimary} onClick={() => setNewDeptModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add First Department
              </button>
            </div>
          ) : (
            <div className={styles.deptList}>
              {data.departments.map((dept, dIdx) => (
                <div key={dIdx} id={`dept-${dIdx}`}>
                  <DeptCard
                    dept={dept}
                    dIdx={dIdx}
                    updateField={updateField}
                    deleteDeptRow={deleteDeptRow}
                    addCourseRow={addCourseRow}
                    deleteCourseRow={deleteCourseRow}
                    addSubjectRow={addSubjectRow}
                    deleteSubjectRow={deleteSubjectRow}
                    addTeacherRow={addTeacherRow}
                    deleteTeacherRow={deleteTeacherRow}
                    allTeachers={allTeachers}
                  />
                </div>
              ))}
              <button type="button" className={styles.addDeptCardBtn} onClick={() => setNewDeptModal(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Another Department
              </button>
            </div>
          )}
        </main>
      </div>

      {}
      <div className={styles.footerBar}>
        {saving && <SaveProgress current={saveProgress.current} total={saveProgress.total} label={saveProgress.label} />}
        <div className={styles.footerActions}>
          <button type="button" className={styles.btnOutline} onClick={load} disabled={saving}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4" />
            </svg>
            Reload
          </button>
          <button type="button" className={styles.btnPrimary} onClick={handleSave}
            disabled={saving || data.departments.length === 0}>
            {saving ? (
              <><span className={styles.savingSpinner} />Saving…</>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save All
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}