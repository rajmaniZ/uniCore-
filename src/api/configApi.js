




















































import API from "./axios";
import { handle } from "./utils";

const configPath = (path = "") => {
  const base = (API?.defaults?.baseURL || "").toLowerCase();
  const clean = path.startsWith("/") ? path : `/${path}`;
  const baseHasConfig = /\/api\/config\/?$/.test(base);
  if (baseHasConfig) {
    return clean.replace(/^\/config/, "");
  }
  return clean.startsWith("/config") ? clean : `/config${clean}`;
};

export const getInstituteConfig = () =>
  handle(API.get(configPath("/protected")));


export const addDeptToConfig = (data) =>
  handle(API.post(configPath("/department"), data));

export const updateDeptHod = (data) =>
  handle(API.put(configPath("/department/hod"), data));

export const removeDeptFromConfig = (data) =>
  handle(API.delete(configPath("/department"), { data }));


export const addCourseToConfig = (data) =>
  handle(API.post(configPath("/course"), data));

export const removeCourseFromConfig = (data) =>
  handle(API.delete(configPath("/course"), { data }));


export const addSubjectToConfig = (data) =>
  handle(API.post(configPath("/subject"), data));

export const updateSubjectTeacher = (data) =>
  handle(API.put(configPath("/subject/teacher"), data));

export const removeSubjectFromConfig = (data) =>
  handle(API.delete(configPath("/subject"), { data }));


export const updateStructureOrder = (data) =>
  handle(API.put(configPath("/reorder"), { data }));
