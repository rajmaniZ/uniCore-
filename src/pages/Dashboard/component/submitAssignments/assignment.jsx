import { useEffect, useState } from "react";

import {
  getAssignments,
  submitAssignment,
} from "../../../../api/assignmentApi";

import { uploadSubmissionFile } from "../../../../api/uploadApi";

import { useAuth } from "../../../../context/authContext";

import styles from "./assignment.module.css";

export default function AssignmentStudent() {

  const { user, token } = useAuth();

  const [assignments, setAssignments] =
    useState([]);

  const [fileMap, setFileMap] =
    useState({});

  const [textMap, setTextMap] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [progressMap, setProgressMap] =
    useState({});

  useEffect(() => {
    if (!token || !user?._id) return;

    const load = async () => {
      try {
        const data =
          await getAssignments();

        setAssignments(data || []);
      } catch (err) {
        console.error(
          "Assignment load error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user?._id]);

  /* SUBMIT */

  const handleSubmit = async (
    assignmentId
  ) => {
    try {
      const file =
        fileMap[assignmentId];

      const text =
        textMap[assignmentId] || "";

      if (!file && !text.trim()) {
        return alert(
          "Add text or upload a file"
        );
      }

      let fileData = {};

      if (file) {
        fileData =
          await uploadSubmissionFile(
            file,
            (p) => {
              setProgressMap(
                (prev) => ({
                  ...prev,
                  [assignmentId]: p,
                })
              );
            }
          );
      }

      const res =
        await submitAssignment({
          assignmentId,
          text,
          ...fileData,
        });

      /* UPDATE UI */

      setAssignments((prev) =>
        prev.map((a) =>
          a._id === assignmentId
            ? {
                ...a,
                status: "submitted",
                submission: res,
                isLate: res.isLate,
              }
            : a
        )
      );

      alert("Assignment submitted");

      setFileMap((prev) => ({
        ...prev,
        [assignmentId]: null,
      }));

      setTextMap((prev) => ({
        ...prev,
        [assignmentId]: "",
      }));

      setProgressMap((prev) => ({
        ...prev,
        [assignmentId]: 0,
      }));

    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Submission failed"
      );
    }
  };

  /* LOADING */

  if (loading) {
    return (
      <div className={styles.empty}>
        Loading...
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <h2 className={styles.heading}>
        My Assignments
      </h2>

      {assignments.length === 0 && (
        <div className={styles.empty}>
          No assignments
        </div>
      )}

      {assignments.map((assignment) => {

        const overdue =
          new Date() >
          new Date(assignment.deadline);

        const isSubmitted =
          assignment.status ===
          "submitted";

        const sub =
          assignment.submission;

        return (

          <div
            key={assignment._id}
            className={styles.card}
          >

            {/* HEADER */}

            <div className={styles.header}>

              <h3>
                {assignment.title}
              </h3>

              <span
                className={`${styles.badge} ${styles[assignment.label]}`}
              >
                {assignment.label}
              </span>

            </div>

            {/* DESCRIPTION */}

            <p>
              {assignment.description}
            </p>

            {/* META */}

            <div className={styles.meta}>

              <span>
                {assignment.subject?.name ||
                  "Subject"}
              </span>

              <span>
                Deadline:
                {" "}
                {new Date(
                  assignment.deadline
                ).toLocaleDateString()}
              </span>

              {overdue &&
                !isSubmitted && (
                  <span
                    className={
                      styles.deadline
                    }
                  >
                    Overdue
                  </span>
                )}

            </div>

            {/* ASSIGNMENT FILE */}

            {assignment.fileUrl && (
              <div
                className={
                  styles.attachmentBox
                }
              >

                <a
                  href={
                    assignment.fileUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={
                    styles.fileLink
                  }
                >
                  View Attachment
                </a>

              </div>
            )}

            {/* STATUS */}

            <div
              className={
                styles.statusBox
              }
            >

              {!isSubmitted && (
                <span
                  className={
                    styles.pending
                  }
                >
                  Pending
                </span>
              )}

              {isSubmitted &&
                !sub?.checked && (
                  <span
                    className={
                      styles.reviewing
                    }
                  >
                    Submitted • Under
                    Review 
                    {assignment.isLate &&
                      " (Late)"}
                  </span>
                )}

              {isSubmitted &&
                sub?.checked && (
                  <span
                    className={
                      styles.reviewed
                    }
                  >
                    Reviewed 
                    {assignment.isLate &&
                      " (Late)"}
                  </span>
                )}

            </div>

            {/* FEEDBACK */}

            {isSubmitted &&
              sub &&
              sub.checked &&
              sub.visibleToStudent && (

                <div
                  className={
                    styles.feedbackBox
                  }
                >

                  <div
                    className={
                      styles.feedbackHeader
                    }
                  >
                    Teacher Feedback
                  </div>

                  <div
                    className={
                      styles.feedbackGrid
                    }
                  >

                    <div
                      className={
                        styles.feedbackItem
                      }
                    >

                      <span
                        className={
                          styles.feedbackLabel
                        }
                      >
                        Status
                      </span>

                      <span
                        className={
                          styles.feedbackValue
                        }
                      >
                        Reviewed
                      </span>

                    </div>

                    <div
                      className={
                        styles.feedbackItem
                      }
                    >

                      <span
                        className={
                          styles.feedbackLabel
                        }
                      >
                        Marks
                      </span>

                      <span
                        className={
                          styles.feedbackValue
                        }
                      >
                        {sub.marks ??
                          "Not Graded"}
                      </span>

                    </div>

                    <div
                      className={
                        styles.feedbackItem
                      }
                    >

                      <span
                        className={
                          styles.feedbackLabel
                        }
                      >
                        Remarks
                      </span>

                      <span
                        className={
                          styles.feedbackValue
                        }
                      >
                        {sub.remark ||
                          "No Remarks"}
                      </span>

                    </div>

                  </div>

                </div>
              )}

            {/* STUDENT SUBMISSION */}

            {isSubmitted && sub && (

              <div
                className={
                  styles.submissionBox
                }
              >

                <h4>
                  Your Submission
                </h4>

                {sub.text && (
                  <p>
                    <strong>
                      Note:
                    </strong>
                    {" "}
                    {sub.text}
                  </p>
                )}

                {sub.fileUrl && (

                  <a
                    href={sub.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      styles.fileLink
                    }
                  >
                    View Your Submission
                  </a>

                )}

              </div>
            )}

            {/* SUBMIT FORM */}

            {!overdue &&
              !isSubmitted && (

                <div
                  className={
                    styles.submitBox
                  }
                >

                  <textarea
                    placeholder="Submission note"
                    value={
                      textMap[
                        assignment._id
                      ] || ""
                    }
                    onChange={(e) =>
                      setTextMap(
                        (prev) => ({
                          ...prev,
                          [assignment._id]:
                            e.target.value,
                        })
                      )
                    }
                  />

                  <input
                    type="file"
                    onChange={(e) =>
                      setFileMap(
                        (prev) => ({
                          ...prev,
                          [assignment._id]:
                            e.target
                              .files[0],
                        })
                      )
                    }
                  />

                  {progressMap[
                    assignment._id
                  ] > 0 && (
                    <span>
                      Uploading:
                      {" "}
                      {
                        progressMap[
                          assignment._id
                        ]
                      }
                      %
                    </span>
                  )}

                  <button
                    onClick={() =>
                      handleSubmit(
                        assignment._id
                      )
                    }
                  >
                    Submit Assignment
                  </button>

                </div>
              )}

          </div>
        );
      })}

    </div>
  );
}