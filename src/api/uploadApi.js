import API from "./axios";

const normalizeUploadResponse = (data = {}) => ({
  url: data.url || "",
  type: data.type || "",
  size: data.size || 0,
  fileUrl: data.url || "",
  fileType: data.type || "",
  fileSize: data.size || 0,
});

const uploadWithProgress = async (path, file, setProgress) => {
  const fd = new FormData();
  fd.append("file", file);

  const res = await API.post(path, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (e) => {
      if (setProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      }
    },
  });

  return normalizeUploadResponse(res.data);
};

export const uploadImageFile = async (file, setProgress) =>
  uploadWithProgress("/upload/image", file, setProgress);


export const uploadAssignmentFile = async (file, setProgress) => {
  return uploadWithProgress("/upload/assignment", file, setProgress);
};


export const uploadSubmissionFile = async (file, setProgress) => {
  return uploadWithProgress("/upload/submission", file, setProgress);
};
