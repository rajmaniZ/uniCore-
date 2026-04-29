



























import API from "./axios";


export const getTimetables = async () => {
  const res = await API.get("/timetable");
  return res.data;
};


export const saveTimetable = async (data) => {
  const res = await API.post("/timetable", data);
  return res.data;
};


export const deleteTimetable = async (id) => {
  const res = await API.delete(`/timetable/${id}`);
  return res.data;
};