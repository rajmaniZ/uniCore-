import API from "./axios";

export const getClasses = async (instituteId) => {
  const res = await API.get("/class", {
    params: { instituteId },
  });
  return res.data;
};

export const createClass = async (data) => {
  const res = await API.post("/class", data);
  return res.data;
};

export const updateClass = async (id, data) => {
  const res = await API.put(`/class/${id}`, data);
  return res.data;
};

export const deleteClass = async (id) => {
  const res = await API.delete(`/class/${id}`);
  return res.data;
};
