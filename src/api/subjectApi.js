
















































import API from "./axios";

export const getSubjects = async (paramsOrDepartmentId = {}) => {
  const params =
    typeof paramsOrDepartmentId === "string"
      ? { departmentId: paramsOrDepartmentId }
      : paramsOrDepartmentId;

  const res = await API.get("/subject", {
    params,
  });
  return res.data;
};

export const createSubject = async (data) => {
  const fallbackId = data?.course || data?.department || data?.classId || "create";
  const res = await API.post(`/subject/${fallbackId}`, data);
  return res.data;
};

export const updateSubject = async (id, data) => {
  const res = await API.put(`/subject/${id}`, data);
  return res.data;
};

export const deleteSubject = async (id) => {
  const res = await API.delete(`/subject/${id}`);
  return res.data;
};
