import API from "./axios";

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

export const submitAssignment = async (data) => {
  const res = await API.post("/assignment/submit", data);
  return res.data;
};

export const getSubmissions = async (assignmentId) => {
  const res = await API.get(`/assignment/submissions/${assignmentId}`);
  return res.data;
};

export const gradeSubmission = async (submissionId, data) => {
  const res = await API.put(`/assignment/grade/${submissionId}`, data);
  return res.data;
};