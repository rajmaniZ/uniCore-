import { useState } from "react";
import styles from "./showList.module.css";

import {
  students,
  teachers,
  colleges,
  currentUser
} from "./../../../src/mockData/mockData";

const branches = ["CSE", "ECE", "ME", "CE", "EE", "IT"];

function ShowList() {
  const [view, setView] = useState("students");
  const [role, setRole] = useState(currentUser.role);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [search, setSearch] = useState("");

  const [dataState, setDataState] = useState({
    students,
    teachers
  });

  const [newUser, setNewUser] = useState({
    name: "",
    role: "student",
    branch: "",
    class: ""
  });

  const [filters, setFilters] = useState({
    branch: "",
    class: "",
    year: "",
    subject: "",
    status: ""
  });

  const getCollegeName = (id) =>
    colleges.find((c) => c._id === id)?.collegeName || "-";

  const getClasses = () => {
    if (!filters.branch) return [];
    return [1, 2, 3].map((c) => `${filters.branch}-${c}`);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (!newUser.name) return alert("Enter name");

    const base = {
      _id: Date.now().toString(),
      name: newUser.name,
      collegeId: currentUser.collegeId,
      status: "pending",
      requestedAt: new Date(),
      joinedAt: null
    };

    if (newUser.role === "student") {
      setDataState((prev) => ({
        ...prev,
        students: [
          ...prev.students,
          {
            ...base,
            role: "student",
            branch: newUser.branch,
            class: newUser.class,
            year: "1"
          }
        ]
      }));
    }

    if (newUser.role === "teacher") {
      setDataState((prev) => ({
        ...prev,
        teachers: [
          ...prev.teachers,
          {
            ...base,
            role: "teacher",
            department: newUser.branch,
            class: newUser.class
          }
        ]
      }));
    }

    if (newUser.role === "college" && role === "admin") {
      colleges.push({
        _id: "col" + Date.now(),
        role: "college",
        collegeName: newUser.name,
        code: "NEW",
        status: "active",
        joinedAt: new Date()
      });
    }

    setNewUser({ name: "", role: "student", branch: "", class: "" });
  };

  const updateStatus = (id, type, newStatus) => {
    const updated = dataState[type].map((item) =>
      item._id === id
        ? {
            ...item,
            status: newStatus,
            joinedAt: newStatus === "success" ? new Date() : item.joinedAt
          }
        : item
    );

    setDataState({ ...dataState, [type]: updated });
  };

  const deleteItem = (id, type) => {
    const updated = dataState[type].filter((i) => i._id !== id);
    setDataState({ ...dataState, [type]: updated });
  };

  let data =
    view === "students"
      ? dataState.students
      : view === "teachers"
      ? dataState.teachers
      : colleges;

  if (role === "admin" && selectedCollege && view !== "colleges") {
    data = data.filter((d) => d.collegeId === selectedCollege);
  }

  if (role === "teacher") {
    data = data.filter((d) => d.class === currentUser.class);
  }

  if (role === "principal") {
    data = data.filter((d) => d.collegeId === currentUser.collegeId);
  }

  const filtered = data
    .filter((item) => {
      return (
        (!filters.branch ||
          item.branch === filters.branch ||
          item.department === filters.branch) &&
        (!filters.class || item.class === filters.class) &&
        (!filters.status || item.status === filters.status) &&
        (!search ||
          item.name?.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;

      const d = new Date(b.requestedAt) - new Date(a.requestedAt);
      if (d !== 0) return d;

      return (a.name || "").localeCompare(b.name || "");
    });

  const pendingList =
    role === "teacher"
      ? []
      : filtered.filter((i) => i.status === "pending");

  const mainList = filtered.filter((i) => i.status !== "pending");

  return (
    <div className={styles.container}>

      {}
      <div className={styles.controls}>
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="principal">Principal</option>
          <option value="teacher">Teacher</option>
        </select>

        <select onChange={(e) => setView(e.target.value)}>
          <option value="students">Students</option>
          {(role !== "teacher") && <option value="teachers">Teachers</option>}
          {role === "admin" && <option value="colleges">Colleges</option>}
        </select>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {}
      {(role === "admin" || role === "principal") && (
        <div className={styles.createRow}>
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
          />

          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            {role === "admin" && (
              <option value="college">College</option>
            )}
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <select
            onChange={(e) =>
              setNewUser({ ...newUser, branch: e.target.value })
            }
          >
            <option>Branch</option>
            {branches.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select
            onChange={(e) =>
              setNewUser({ ...newUser, class: e.target.value })
            }
          >
            <option>Class</option>
            {getClasses().map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      {}
      {role !== "teacher" && (
        <>
          <h2>Join Requests</h2>
          <table className={styles.table}>
            <tbody>
              {pendingList.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{getCollegeName(item.collegeId)}</td>
                  <td>{item.class}</td>
                  <td>
                    <button onClick={() => updateStatus(item._id, view, "success")}>
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {}
      <h2>Main List</h2>
      <table className={styles.table}>
        <tbody>
          {mainList.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{getCollegeName(item.collegeId)}</td>
              <td>{item.class}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => deleteItem(item._id, view)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default ShowList;