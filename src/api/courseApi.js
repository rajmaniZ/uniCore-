
import API from "./axios";

export const getCourses = async (params = {}) => {
  const { instituteId, departmentId } = params;

  if (!instituteId) {
    throw new Error("instituteId is required for getCourses");
  }

  const res = await API.get("/course", {
    params: {
      instituteId,          
      ...(departmentId && { departmentId }),
    },
  });

  return res.data;
};

export const createCourse = async (data) => {
  if (!data?.name || !data?.departmentId || !data?.instituteId) {
    throw new Error("name, departmentId, instituteId are required");
  }

  const res = await API.post("/course", data);
  return res.data;
};

export const updateCourse = async (id, data) => {
  if (!id) throw new Error("Course ID required");

  const res = await API.put(`/course/${id}`, data);
  return res.data;
};

export const deleteCourse = async (id) => {
  if (!id) throw new Error("Course ID required");

  const res = await API.delete(`/course/${id}`);
  return res.data;
};