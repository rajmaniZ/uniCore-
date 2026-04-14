import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/dataContext";
import styles from "./DataView.module.css";

function DataView({ type = "students" }) {
  const { currentUser } = useAuth();
  const { students, teachers, colleges, users, joinRequests } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 🔥 FILTER STATES
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  // 🔥 SORT STATE
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const ITEMS_PER_PAGE = 20;

  // ✅ SELECT DATA
  let data = [];
  if (type === "students") data = students;
  if (type === "teachers") data = teachers;
  if (type === "colleges") data = colleges;
  if (type === "admins") data = users.filter(u => u.role === "admin");
  if (type === "requests") data = joinRequests;

  // ✅ RBAC FILTER
  const roleFiltered = data.filter((item) => {
    const role = currentUser.role;

    if (role === "superadmin") return true;

    if (role === "admin") {
      return item.collegeId === currentUser.collegeId;
    }

    if (role === "hod") {
      return item.department === currentUser.department;
    }

    if (role === "teacher") {
      return item.class === currentUser.class;
    }

    if (role === "student") return false;

    return false;
  });

  // ✅ APPLY FILTERS
  const filtered = roleFiltered.filter((item) => {
    if (branch && item.branch !== branch) return false;
    if (year && item.year !== year) return false;
    if (department && item.department !== department) return false;
    if (status && item.status !== status) return false;
    return true;
  });

  // ✅ SEARCH
  const searched = filtered.filter((item) =>
    (item.name || item.collegeName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ✅ SORT
  const sorted = useMemo(() => {
    return [...searched].sort((a, b) => {
      const valA = a[sortKey] || "";
      const valB = b[sortKey] || "";

      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }, [searched, sortKey, sortOrder]);

  // ✅ PAGINATION
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = sorted.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);

  // ✅ COLUMNS
  const columnsMap = {
    students: ["name", "rollNo", "branch", "year", "gpa"],
    teachers: ["name", "department", "empId"],
    colleges: ["collegeName", "code", "status"],
    admins: ["name", "email", "status"],
    requests: ["name", "role", "status"],
  };

  const columns = columnsMap[type] || [];

  return (
    <div className={styles.container} style={{ maxHeight: "100vh", overflow: "auto" }}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>{type.toUpperCase()}</h1>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* 🔥 FILTERS */}
      <div className={styles.filters}>
        <select className={styles.filtersSelect}onChange={(e) => setBranch(e.target.value)}>
          <option value="">Branch</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </select>

        <select onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>

        {/* <select onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Department</option>
          <option value="CSE">CSE</option>
        </select> */}

        <select onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>

        {/* SORT */}
        <select onChange={(e) => setSortKey(e.target.value)}>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.map((item) => (
              <tr key={item._id}>
                {columns.map((col) => (
                  <td key={col}>
                    {col === "name" || col === "collegeName" ? (
                      <span
                        className={styles.studentName}
                        onClick={() =>
                          navigate(`/${currentUser.role}/${type}/${item._id}`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {item[col]}
                      </span>
                    ) : (
                      item[col]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>Page {page} / {totalPages || 1}</span>

        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default DataView;