import API from "./axios";

/* =========================
   ASSIGNMENTS
========================= */

export const getAssignments = async () => {
  const res = await API.get("/assignment");
  return res.data;
};

export const createAssignment = async (data) => {
  const res = await API.post("/assignment", data);
  return res.data;
};

export const updateAssignment = async (id, data) => {
  const res = await API.put(`/assignment/${id}`, data);
  return res.data;
};

export const deleteAssignment = async (id) => {
  const res = await API.delete(`/assignment/${id}`);
  return res.data;
};

/* =========================
   STUDENT SUBMISSION
========================= */

export const submitAssignment = async (data) => {
  const res = await API.post(
    "/assignment/submit",
    data
  );

  return res.data;
};

/* =========================
   TEACHER SUBMISSIONS
========================= */

export const getSubmissions = async (
  assignmentId
) => {
  const res = await API.get(
    `/assignment/submissions/${assignmentId}`
  );

  return res.data;
};

/* =========================
   GRADING
========================= */

export const gradeSubmission = async (
  submissionId,
  data
) => {
  const res = await API.put(
    `/assignment/grade/${submissionId}`,
    data
  );

  return res.data;
};

/* =========================
   STUDENT RESULTS
========================= */

export const getMySubmissions =
  async () => {
    const res = await API.get(
      "/assignment/my-submissions"
    );

    return res.data;
  };