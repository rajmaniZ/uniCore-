import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import styles from "./assignment.module.css";

import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  getSubmissions,
  gradeSubmission,
} from "../../../../api/assignmentApi";

import { getInstituteConfig } from "../../../../api/configApi";
import { uploadAssignmentFile } from "../../../../api/uploadApi";

import {
  getTeacherSubjectScopes,
  getUniqueSubjects,
} from "../../utils/configRuntime";

export default function Assignment() {
  const { user, token } = useAuth();

  const isTeacher =
    user?.role?.toLowerCase() === "teacher";

  const [assignments, setAssignments] = useState([]);
  const [subjectScopes, setSubjectScopes] = useState([]);

  const [file, setFile] = useState(null);

  const [progress, setProgress] = useState(0);

  const [error, setError] = useState("");

  const [selectedSubjectFilter, setSelectedSubjectFilter] =
    useState("");

  const [submissions, setSubmissions] = useState({});

  const [grading, setGrading] = useState({});

  const [loadingSubmissions, setLoadingSubmissions] =
    useState({});

  const [form, setForm] = useState({
    subject: "",
    title: "",
    description: "",
    label: "normal",
    deadline: "",
    instructions: "",
  });

  const load = async () => {
    setError("");

    try {
      const [assignmentData, config] =
        await Promise.all([
          getAssignments(),
          getInstituteConfig(),
        ]);

      setAssignments(
        Array.isArray(assignmentData)
          ? assignmentData
          : []
      );

      setSubjectScopes(
        getTeacherSubjectScopes(
          config,
          user?._id
        )
      );
    } catch (err) {
      console.error(
        "Assignment load error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.msg ||
          err.message ||
          "Failed to load assignments"
      );
    }
  };

  useEffect(() => {
    if (!token || !user?._id) return;

    load();
  }, [token, user?._id]);

  const teacherSubjects = useMemo(
    () => getUniqueSubjects(subjectScopes),
    [subjectScopes]
  );

  const visibleAssignments = useMemo(() => {
    if (!selectedSubjectFilter)
      return assignments;

    return assignments.filter(
      (assignment) =>
        assignment?.subject?._id ===
        selectedSubjectFilter
    );
  }, [assignments, selectedSubjectFilter]);

  const handleDrop = (e) => {
    e.preventDefault();

    setFile(e.dataTransfer.files[0]);
  };

  const handleCreate = async () => {
    try {
      if (!form.title || !form.subject) {
        setError("Fill required fields");
        return;
      }

      setError("");

      let fileData = {};

      if (file) {
        fileData =
          await uploadAssignmentFile(
            file,
            setProgress
          );
      }

      await createAssignment({
        ...form,
        ...fileData,
      });

      setFile(null);

      setProgress(0);

      setForm({
        subject: "",
        title: "",
        description: "",
        label: "normal",
        deadline: "",
        instructions: "",
      });

      await load();
    } catch (err) {
      console.error(
        "Assignment create error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.msg ||
          err.message ||
          "Error creating assignment"
      );
    }
  };

  const handleDelete = async (
    assignmentId
  ) => {
    try {
      setError("");

      await deleteAssignment(
        assignmentId
      );

      await load();
    } catch (err) {
      console.error(
        "Assignment delete error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.msg ||
          err.message ||
          "Error deleting assignment"
      );
    }
  };

  const loadSubmissions = async (
    assignmentId
  ) => {
    try {
      setLoadingSubmissions((prev) => ({
        ...prev,
        [assignmentId]: true,
      }));

      const data =
        await getSubmissions(
          assignmentId
        );

      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: data,
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSubmissions((prev) => ({
        ...prev,
        [assignmentId]: false,
      }));
    }
  };

  const handleGrade = async (
    submissionId,
    assignmentId
  ) => {
    try {
      const payload =
        grading[submissionId];

      await gradeSubmission(
        submissionId,
        payload
      );

      await loadSubmissions(
        assignmentId
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      {isTeacher && (
        <>
          <h2>Create Assignment</h2>

          {error ? <p>{error}</p> : null}

          <div className={styles.form}>
            <select
              value={form.subject}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject: e.target.value,
                })
              }
            >
              <option value="">
                Select Subject
              </option>

              {teacherSubjects.map(
                (subject) => (
                  <option
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name}
                  </option>
                )
              )}
            </select>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Question"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />

            <div
              className={styles.drop}
              onDrop={handleDrop}
              onDragOver={(e) =>
                e.preventDefault()
              }
            >
              {file
                ? file.name
                : "Drag & Drop or Click"}

              <input
                type="file"
                onChange={(e) =>
                  setFile(
                    e.target.files[0]
                  )
                }
              />
            </div>

            {progress > 0 && (
              <div
                className={styles.progress}
              >
                <div
                  style={{
                    width: `${progress}%`,
                  }}
                  className={styles.bar}
                />
              </div>
            )}

            <select
              value={form.label}
              onChange={(e) =>
                setForm({
                  ...form,
                  label: e.target.value,
                })
              }
            >
              <option value="normal">
                Normal
              </option>

              <option value="important">
                Important
              </option>

              <option value="compulsory">
                Compulsory
              </option>
            </select>

            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm({
                  ...form,
                  deadline:
                    e.target.value,
                })
              }
            />

            <textarea
              placeholder="Instructions"
              value={form.instructions}
              onChange={(e) =>
                setForm({
                  ...form,
                  instructions:
                    e.target.value,
                })
              }
            />

            <button onClick={handleCreate}>
              Create Assignment
            </button>
          </div>
        </>
      )}

      <h2>Assignments</h2>

      <select
        value={selectedSubjectFilter}
        onChange={(e) =>
          setSelectedSubjectFilter(
            e.target.value
          )
        }
      >
        <option value="">
          All Subjects
        </option>

        {teacherSubjects.map((subject) => (
          <option
            key={subject._id}
            value={subject._id}
          >
            {subject.name}
          </option>
        ))}
      </select>

      <div className={styles.list}>
        {visibleAssignments.map(
          (assignment) => (
            <div
              key={assignment._id}
              className={styles.card}
            >
              <div
                className={styles.rowTop}
              >
                <h3>
                  {assignment.title}
                </h3>

                <span
                  className={`${styles.badge} ${styles[assignment.label]}`}
                >
                  {assignment.label}
                </span>
              </div>

              <p>
                {assignment.description}
              </p>

              <div
                className={styles.meta}
              >
                <span>
                  {
                    assignment.subject
                      ?.name
                  }
                </span>

                <span>
                  Deadline:
                  {" "}
                  {new Date(
                    assignment.deadline
                  ).toLocaleDateString()}
                </span>
              </div>

              {assignment.instructions && (
                <div
                  className={
                    styles.instructions
                  }
                >
                  <strong>
                    Instructions:
                  </strong>

                  <p>
                    {
                      assignment.instructions
                    }
                  </p>
                </div>
              )}

              {assignment.fileUrl && (
                <div
                  className={
                    styles.previewBox
                  }
                >
                  <a
                    href={
                      assignment.fileUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      styles.attachmentLink
                    }
                  >
                    Open Assignment
                    Attachment
                  </a>

                  <iframe
                    src={
                      assignment.fileUrl
                    }
                    className={
                      styles.preview
                    }
                    title="assignment-preview"
                  />
                </div>
              )}

              {isTeacher && (
                <>
                  <div
                    className={
                      styles.teacherActions
                    }
                  >
                    <button
                      onClick={() =>
                        loadSubmissions(
                          assignment._id
                        )
                      }
                    >
                      {loadingSubmissions[
                        assignment._id
                      ]
                        ? "Loading..."
                        : "View Submissions"}
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          assignment._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>

                  <div
                    className={
                      styles.subList
                    }
                  >
                    {(
                      submissions[
                        assignment._id
                      ] || []
                    ).map((sub) => (
                      <div
                        key={sub._id}
                        className={
                          styles.subCard
                        }
                      >
                        <div
                          className={
                            styles.subTop
                          }
                        >
                          <div
                            className={
                              styles.studentInfo
                            }
                          >
                            <strong>
                              {
                                sub.student
                                  ?.name
                              }
                            </strong>

                            <span>
                              {
                                sub.student
                                  ?.email
                              }
                            </span>

                            <span>
                              Roll:
                              {" "}
                              {
                                sub.student
                                  ?.rollNumber
                              }
                            </span>
                          </div>

                          <div>
                            {sub.isLate
                              ? "Late Submission"
                              : "On Time"}
                          </div>
                        </div>

                        {sub.text && (
                          <p
                            className={
                              styles.submissionText
                            }
                          >
                            {sub.text}
                          </p>
                        )}

                        {sub.fileUrl && (
                          <div
                            className={
                              styles.previewBox
                            }
                          >
                            <a
                              href={
                                sub.fileUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={
                                styles.attachmentLink
                              }
                            >
                              View Submission
                              Attachment
                            </a>

                            <iframe
                              src={
                                sub.fileUrl
                              }
                              className={
                                styles.preview
                              }
                              title="submission-preview"
                            />
                          </div>
                        )}

                        <div
                          className={
                            styles.gradePanel
                          }
                        >
                          <div
                            className={
                              styles.gradeRow
                            }
                          >
                            <input
                              type="number"
                              placeholder="Marks"
                              value={
                                grading[
                                  sub._id
                                ]?.marks ??
                                sub.marks ??
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                setGrading({
                                  ...grading,
                                  [sub._id]:
                                    {
                                      ...grading[
                                        sub
                                          ._id
                                      ],
                                      marks:
                                        e
                                          .target
                                          .value,
                                    },
                                })
                              }
                            />

                            <input
                              placeholder="Remark"
                              value={
                                grading[
                                  sub._id
                                ]?.remark ??
                                sub.remark ??
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                setGrading({
                                  ...grading,
                                  [sub._id]:
                                    {
                                      ...grading[
                                        sub
                                          ._id
                                      ],
                                      remark:
                                        e
                                          .target
                                          .value,
                                    },
                                })
                              }
                            />
                          </div>

                          <label
                            className={
                              styles.checkboxRow
                            }
                          >
                            <input
                              type="checkbox"
                              checked={
                                grading[
                                  sub._id
                                ]
                                  ?.visibleToStudent ??
                                sub.visibleToStudent ??
                                false
                              }
                              onChange={(
                                e
                              ) =>
                                setGrading({
                                  ...grading,
                                  [sub._id]:
                                    {
                                      ...grading[
                                        sub
                                          ._id
                                      ],
                                      visibleToStudent:
                                        e
                                          .target
                                          .checked,
                                    },
                                })
                              }
                            />

                            Show to Student
                          </label>

                          <button
                            onClick={() =>
                              handleGrade(
                                sub._id,
                                assignment._id
                              )
                            }
                          >
                            Save Grade
                          </button>

                          {sub.checked && (
                            <div
                              className={
                                styles.status
                              }
                            >
                              Reviewed
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}