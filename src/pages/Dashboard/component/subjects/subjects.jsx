import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/authContext";

import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";

import {
  getSubjectMaterials,
  uploadSubjectMaterial,
  deleteSubjectMaterial,
} from "../../../../api/subjectMaterialApi";

import { getRoleSubjects } from "../../utils/configRuntime";

import Loader from "../../../../component/loader/loader";

import styles from "./subjects.module.css";

function Subjects() {
  const { user, token } = useAuth();

  const [institute, setInstitute] =
    useState(null);

  const [subjects, setSubjects] =
    useState([]);

  const [
    activeSubjectId,
    setActiveSubjectId,
  ] = useState("");

  const [materials, setMaterials] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [unit, setUnit] =
    useState(1);

  const [files, setFiles] =
    useState([]);

  const canUpload = [
    "admin",
    "hod",
    "teacher",
  ].includes(user?.role);

  useEffect(() => {
    if (!token || !user?._id)
      return;

    const load = async () => {
      setLoading(true);

      try {
        const [
          instituteData,
          config,
        ] = await Promise.all([
          getMyInstitute(),
          getInstituteConfig(),
        ]);

        const roleSubjects =
          getRoleSubjects(
            config,
            user
          );

        setInstitute(
          instituteData
        );

        setSubjects(
          roleSubjects
        );

        if (
          roleSubjects.length > 0
        ) {
          setActiveSubjectId(
            roleSubjects[0]._id
          );
        }
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data
            ?.msg ||
            "Failed to load subjects"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user]);

  useEffect(() => {
    if (!activeSubjectId)
      return;

    loadMaterials();
  }, [activeSubjectId]);

  const loadMaterials =
    async () => {
      try {
        const data =
          await getSubjectMaterials(
            activeSubjectId
          );

        setMaterials(
          data || {}
        );
      } catch (err) {
        console.error(
          "LOAD MATERIAL ERROR:",
          err
        );
      }
    };

  const handleUpload =
    async () => {
      try {
        if (!files.length) {
          return alert(
            "Please select files"
          );
        }

        if (!title.trim()) {
          return alert(
            "Please enter title"
          );
        }

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "subjectId",
          activeSubjectId
        );

        formData.append(
          "title",
          title
        );

        formData.append(
          "description",
          description
        );

        formData.append(
          "unit",
          unit
        );

        formData.append(
          "visibleToStudents",
          true
        );

        files.forEach(
          (file) => {
            formData.append(
              "files",
              file
            );
          }
        );

        await uploadSubjectMaterial(
          formData
        );

        alert(
          "Materials uploaded successfully"
        );

        setTitle("");
        setDescription("");
        setUnit(1);
        setFiles([]);

        const input =
          document.getElementById(
            "material-file-input"
          );

        if (input) {
          input.value = "";
        }

        await loadMaterials();
      } catch (err) {
        console.error(
          "UPLOAD ERROR:",
          err
        );

        alert(
          err.response?.data
            ?.msg ||
            "Upload failed"
        );
      } finally {
        setUploading(false);
      }
    };

  const handleDelete =
    async (materialId) => {
      try {
        const confirmDelete =
          window.confirm(
            "Delete this material?"
          );

        if (!confirmDelete)
          return;

        await deleteSubjectMaterial(
          materialId
        );

        await loadMaterials();
      } catch (err) {
        console.error(
          "DELETE ERROR:",
          err
        );

        alert(
          err.response?.data
            ?.msg ||
            "Delete failed"
        );
      }
    };

  const activeSubject =
    useMemo(
      () =>
        subjects.find(
          (subject) =>
            subject._id ===
            activeSubjectId
        ) || subjects[0],
      [
        activeSubjectId,
        subjects,
      ]
    );

  const getFileUrl = (
    resource
  ) => {
    if (!resource?.url)
      return "";

    // cloudinary url
    if (
      resource.url.startsWith(
        "http"
      )
    ) {
      return resource.url;
    }

    // fallback local url
    return `${import.meta.env.VITE_API_URL}${resource.url}`;
  };

  const getFileType = (
    resource
  ) => {
    const url =
      resource?.url || "";

    const type =
      resource?.type || "";

    if (
      type === "image" ||
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
        url
      )
    ) {
      return "image";
    }

    if (
      type === "pdf" ||
      /\.pdf$/i.test(url)
    ) {
      return "pdf";
    }

    if (
      type === "video" ||
      /\.(mp4|webm|ogg|mov)$/i.test(
        url
      )
    ) {
      return "video";
    }

    return "file";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Subjects
        </h2>
      </div>

      {error ? (
        <p className={styles.error}>
          {error}
        </p>
      ) : null}

      <div className={styles.tabs}>
        {subjects.map(
          (subject) => (
            <button
              key={subject._id}
              type="button"
              className={
                activeSubject?._id ===
                subject._id
                  ? styles.activeTab
                  : styles.tab
              }
              onClick={() =>
                setActiveSubjectId(
                  subject._id
                )
              }
            >
              {subject.name}
            </button>
          )
        )}
      </div>

      {!activeSubject ? (
        <div className={styles.card}>
          No subjects found
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.card}>
              <h3
                className={
                  styles.subjectName
                }
              >
                {activeSubject.name}
              </h3>

              <p
                className={
                  styles.subjectText
                }
              >
                {activeSubject.syllabus ||
                  "No syllabus added"}
              </p>

              <div
                className={
                  styles.stats
                }
              >
                <span
                  className={
                    styles.badge
                  }
                >
                  {activeSubject.code ||
                    "No code"}
                </span>

                <span
                  className={
                    styles.badge
                  }
                >
                  {activeSubject.classId
                    ? institute?.type ===
                      "school"
                      ? "Class Subject"
                      : activeSubject.type
                    : activeSubject.semester
                    ? `Semester ${activeSubject.semester}`
                    : activeSubject.type}
                </span>
              </div>
            </div>

            {canUpload && (
              <div
                className={
                  styles.card
                }
              >
                <h3>
                  Upload Materials
                </h3>

                <input
                  type="text"
                  placeholder="Material Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  className={
                    styles.input
                  }
                />

                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  className={
                    styles.textarea
                  }
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Unit Number"
                  value={unit}
                  onChange={(e) =>
                    setUnit(
                      e.target.value
                    )
                  }
                  className={
                    styles.input
                  }
                />

                <input
                  id="material-file-input"
                  type="file"
                  multiple
                  onChange={(e) =>
                    setFiles(
                      Array.from(
                        e.target.files
                      )
                    )
                  }
                  className={
                    styles.fileInput
                  }
                />

                {files.length >
                  0 && (
                  <div
                    className={
                      styles.selectedFiles
                    }
                  >
                    {files.map(
                      (
                        file,
                        index
                      ) => (
                        <div
                          key={index}
                          className={
                            styles.fileChip
                          }
                        >
                          {file.name}
                        </div>
                      )
                    )}
                  </div>
                )}

                <button
                  onClick={
                    handleUpload
                  }
                  disabled={
                    uploading
                  }
                  className={
                    styles.uploadBtn
                  }
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload Materials"}
                </button>
              </div>
            )}
          </div>

          <div className={styles.right}>
            <div className={styles.card}>
              <h3>
                Study Materials
              </h3>

              {!Object.keys(
                materials
              ).length ? (
                <p
                  className={
                    styles.emptyState
                  }
                >
                  No materials added
                </p>
              ) : (
                Object.entries(
                  materials
                ).map(
                  ([
                    unitNumber,
                    unitFiles,
                  ]) => (
                    <div
                      key={
                        unitNumber
                      }
                      className={
                        styles.unitSection
                      }
                    >
                      <h4
                        className={
                          styles.unitHeading
                        }
                      >
                        Unit{" "}
                        {
                          unitNumber
                        }
                      </h4>

                      <div
                        className={
                          styles.resourceGrid
                        }
                      >
                        {unitFiles.map(
                          (
                            resource
                          ) => {
                            const fileUrl =
                              getFileUrl(
                                resource
                              );

                            const fileType =
                              getFileType(
                                resource
                              );

                            return (
                              <div
                                key={
                                  resource._id
                                }
                                className={
                                  styles.resourceItem
                                }
                              >
                                <div
                                  className={
                                    styles.resourceInfo
                                  }
                                >
                                  <a
                                    href={
                                      fileUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className={
                                      styles.resourceLink
                                    }
                                  >
                                    {
                                      resource.title
                                    }
                                  </a>

                                  <p
                                    className={
                                      styles.resourceDescription
                                    }
                                  >
                                    {resource.description ||
                                      "No description"}
                                  </p>

                                  <div
                                    className={
                                      styles.resourceMeta
                                    }
                                  >
                                    Uploaded
                                    by{" "}
                                    {resource
                                      ?.uploadedBy
                                      ?.name ||
                                      "Unknown"}
                                  </div>

                                  {fileType ===
                                    "image" && (
                                    <img
                                      src={
                                        fileUrl
                                      }
                                      alt={
                                        resource.title
                                      }
                                      className={
                                        styles.previewImage
                                      }
                                      onError={(
                                        e
                                      ) => {
                                        console.log(
                                          "IMAGE FAILED:",
                                          fileUrl
                                        );

                                        e.target.style.display =
                                          "none";
                                      }}
                                    />
                                  )}

                                  {fileType ===
                                    "pdf" && (
                                    <iframe
                                      src={
                                        fileUrl
                                      }
                                      title={
                                        resource.title
                                      }
                                      className={
                                        styles.previewPdf
                                      }
                                    />
                                  )}

                                  {fileType ===
                                    "video" && (
                                    <video
                                      controls
                                      className={
                                        styles.previewVideo
                                      }
                                    >
                                      <source
                                        src={
                                          fileUrl
                                        }
                                      />
                                    </video>
                                  )}
                                </div>

                                <div
                                  className={
                                    styles.resourceActions
                                  }
                                >
                                  <a
                                    href={
                                      fileUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className={
                                      styles.openBtn
                                    }
                                  >
                                    Open
                                  </a>

                                  <a
                                    href={
                                      fileUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className={
                                      styles.downloadBtn
                                    }
                                  >
                                    Download
                                  </a>

                                  {(user?.role ===
                                    "admin" ||
                                    String(
                                      resource
                                        ?.uploadedBy
                                        ?._id
                                    ) ===
                                      String(
                                        user?._id
                                      )) && (
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          resource._id
                                        )
                                      }
                                      className={
                                        styles.deleteBtn
                                      }
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;