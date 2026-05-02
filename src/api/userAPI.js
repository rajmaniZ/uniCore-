
import API from "./axios";

export const loginUser = (data) => API.post("/login", data);

export const sendOtp = (data) => API.post("/sendOtp", data);
export const verifyOtp = (data) => API.post("/verifyOtp", data);

export const sendRequestOtp = (email) =>
  API.post("/sendOtp", { email, type: "request" });

export const requestAccount = (data) =>
  API.post("/request", data);

export const sendCollegeOtp = (data) =>
  API.post("/sendCollegeOtp", data);

export const verifyCollegeOtp = (data) =>
  API.post("/verifyCollegeOtp", data);

export const registerCollege = (data) =>
  API.post("/register", data);

export const forgotPassword = (email) =>
  API.post("/forgotPassword", { email });

export const resetPassword = (data) =>
  API.post("/resetPassword", data);

export const getProfile = async () => {
  const res = await API.get("/user/profile");
  return res.data;
};

export const setupPassword = async (data) => {
  const res = await API.post("/user/setup-password", data);
  return res.data;
};

export const createHod = async (data) => {
  const res = await API.post("/user/hod", data);
  return res.data;
};

export const createTeacher = async (data) => {
  const res = await API.post("/user/teacher", data);
  return res.data;
};

export const createStudent = async (data) => {
  const res = await API.post("/user/student", data);
  return res.data;
};

export const getUsers = async (params = {}) => {
  const res = await API.get("/user", { params });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/user/${id}`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await API.put(`/user/${id}`, data);
  return res.data;
};
