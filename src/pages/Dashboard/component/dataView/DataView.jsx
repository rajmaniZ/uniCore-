import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/authContext";
import styles from "./DataView.module.css";

import { getUsers } from "../../../../api/userAPI";
import { getClasses } from "../../../../api/classApi";
import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";
import {
  getConfigClasses,
  getConfigDepartments,
  getDepartmentCourseOptions,
  getId,
  getStructureOptions,
} from "../../utils/configRuntime";

function DataView({ type = "students" }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [instituteType, setInstituteType] = useState("");
  const [users, setUsers] = useState([]);
  const [config, setConfig] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [classId, setClassId] = useState("");
  const [showForm, setShowForm] = useState(false);

  const itemsPerPage = 10;
  const canCreate = ["admin", "superadmin", "hod"].includes(user?.role);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const institute = await getMyInstitute();
      const instId = institute?._id;

      if (!instId) throw new Error("Institute ID missing");

      setInstituteType(institute?.type);

      const role = type === "students" ? "student" : "teacher";
      const userData = await getUsers({ role });
      setUsers(Array.isArray(userData) ? userData : []);

      if (institute?.type === "college") {
        const configData = await getInstituteConfig();
        setConfig(configData);
        setClasses([]);
      } else {
        const classData = await getClasses(instId);
        setClasses(Array.isArray(classData) ? classData : getConfigClasses(institute?.config));
        setConfig(null);
      }
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err);
      setError(err.response?.data?.msg || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user, type]);

  const departments = useMemo(() => getConfigDepartments(config), [config]);
  const courses = useMemo(() => getDepartmentCourseOptions(config, department), [config, department]);
  const semesters = useMemo(
    () => getStructureOptions(config, department, course),
    [config, department, course]
  );

  const filtered = users
    .filter((entry) => entry.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((entry) =>
      instituteType === "college" && department
        ? getId(entry.departmentId) === department
        : true
    )
    .filter((entry) =>
      instituteType === "college" && course && type === "students"
        ? getId(entry.courseId) === course
        : true
    )
    .filter((entry) =>
      instituteType === "college" && semester && type === "students"
        ? Number(entry.semester) === Number(semester)
        : true
    )
    .filter((entry) =>
      instituteType === "school" && classId
        ? getId(entry.classId) === classId
        : true
    );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{type.toUpperCase()}</h2>
          <p className={styles.subtitle}>Manage your data efficiently</p>
        </div>

        {canCreate && (
          <button
            className={styles.addBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close" : "Add"}
          </button>
        )}
      </div>

      {error ? <p>{error}</p> : null}

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {instituteType === "college" && (
          <>
            <select
              className={styles.filterSelect}
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCourse("");
                setSemester("");
                setPage(1);
              }}
            >
              <option value="">Department</option>
              {departments.map((entry) => (
                <option key={getId(entry?.department)} value={getId(entry?.department)}>
                  {entry?.department?.name}
                </option>
              ))}
            </select>

            {type === "students" && (
              <select
                className={styles.filterSelect}
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setSemester("");
                  setPage(1);
                }}
                disabled={!department}
              >
                <option value="">Course</option>
                {courses.map((entry) => (
                  <option key={getId(entry?.course)} value={getId(entry?.course)}>
                    {entry?.course?.name}
                  </option>
                ))}
              </select>
            )}

            {type === "students" && (
              <select
                className={styles.filterSelect}
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value);
                  setPage(1);
                }}
                disabled={!course}
              >
                <option value="">Semester</option>
                {semesters.map((entry) => (
                  <option key={entry.number} value={entry.number}>
                    {entry.label}
                  </option>
                ))}
              </select>
            )}
          </>
        )}

        {instituteType === "school" && (
          <select
            className={styles.filterSelect}
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Class</option>
            {classes.map((entry) => (
              <option key={entry._id || getId(entry?.class)} value={entry._id || getId(entry?.class)}>
                {entry.name || entry.class?.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length ? (
              paginated.map((item) => (
                <tr key={item._id}>
                  <td onClick={() => navigate(`/${user.role}/${type}/${item._id}`)}>
                    {item.name}
                  </td>
                  <td>{item.email}</td>
                  <td>{item.employeeId || item.rollNumber}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.emptyRow}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.paginationInfo}>
          Page {page} of {totalPages || 1}
        </span>

        <div className={styles.paginationBtns}>
          <button
            className={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <button
            className={styles.pageBtn}
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataView;
