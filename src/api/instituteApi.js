
import API from "./axios";

export const getInstitutes = async () => {
  const res = await API.get("/institute");
  return res.data;
};

export const getMyInstitute = async () => {
  const res = await API.get("/institute/my");
  return res.data;
};

export const setAboutInstitute = async (data) => {
  const res = await API.put("/institute/setup", data);
  return res.data;
};