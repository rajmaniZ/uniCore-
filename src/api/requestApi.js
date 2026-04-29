














































import API from "./axios";


export const createAccountRequest = async (data) => {
  const res = await API.post("/request", data);
  return res.data;
};


export const getRequests = async (search = "") => {
  const res = await API.get(`/request?search=${search}`);
  return res.data;
};


export const preloadRequests = async () => {
  const res = await API.get("/request/all");
  return res.data;
};


export const approveRequest = async (id) => {
  const res = await API.put(`/request/${id}/approve`);
  return res.data;
};


export const rejectRequest = async (id) => {
  const res = await API.put(`/request/${id}/reject`);
  return res.data;
};