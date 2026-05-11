import API from "./axios";

export const uploadSubjectMaterial = async (
  formData
) => {
  const res = await API.post(
    "/subject-material/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getSubjectMaterials = async (
  subjectId
) => {
  const res = await API.get(
    `/subject-material/${subjectId}`
  );

  return res.data;
};

export const deleteSubjectMaterial = async (
  materialId
) => {
  const res = await API.delete(
    `/subject-material/${materialId}`
  );

  return res.data;
};