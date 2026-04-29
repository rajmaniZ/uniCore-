























import API from "./axios";


export const getAttendance = async () => {
  const res = await API.get("/attendance");
  return res.data;
};


export const markAttendance = async (data) => {
  const res = await API.post("/attendance/mark", data);
  return res.data;
};