

























import API from "./axios";


// protected
export const getDepartments = async (instituteId) => {
  const res = await API.get("/department", {
    params: { instituteId },
  });
  return res.data;
};

//protected

export const getDepartmentById = async (id) => {
  const res = await API.get(`/department/${id}`);
  return res.data;
};

export const createDepartment = async (data) => {
  const res = await API.post("/department", data);
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const res = await API.put(`/department/${id}`, data);
  return res.data;
};

export const deleteDepartment = async (id) => {
  const res = await API.delete(`/department/${id}`);
  return res.data;
};