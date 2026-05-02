import { useState } from "react";
import { useAuth } from "./../../../../context/authContext";
import styles from "./profile.module.css";

function Profile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  if (!user) return <div>Loading...</div>;

  const role = user.role?.toLowerCase() || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log("Updated Data:", formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {}
        <div className={styles.avatarWrapper}>
  {formData.avatar ? (
    <img
      src={formData.avatar}
      alt="profile"
      className={styles.avatar}
    />
  ) : (
    <div className={styles.avatarFallback}>
      {formData.name
        ? formData.name.charAt(0).toUpperCase()
        : "U"}
    </div>
  )}

  {isEditing && (
    <input
      type="text"
      name="avatar"
      placeholder="Avatar URL"
      value={formData.avatar}
      onChange={handleChange}
      className={styles.input}
    />
  )}
</div>

        <div className={styles.info}>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
            />
          ) : (
            <h2>{formData.name}</h2>
          )}

          <span className={styles.role}>
            {role ? role.toUpperCase() : "USER"}
          </span>
        </div>

        <button
          className={styles.editBtn}
          onClick={() =>
            isEditing ? handleSave() : setIsEditing(true)
          }
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className={styles.section}>
        <h3>About</h3>

        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={styles.textarea}
          />
        ) : (
          <p>{formData.bio || "No bio added"}</p>
        )}
      </div>

      <div className={styles.section}>
        <h3>Details</h3>

        <div className={styles.grid}>
          <div>
            <span>E-mail</span>
            <label>{user.email}</label>
          </div>

          {role === "student" && (
            <>
              <div>
                <span>Roll No</span>
                <label>{user.rollNumber || "-"}</label>
              </div>

              <div>
                <span>Course</span>
                <label>{user.courseId?.name || "-"}</label>
              </div>

              <div>
                <span>Semester</span>
                <label>{user.semester || "-"}</label>
              </div>

              <div>
                <label>Class</label>
                <span>{user.classId?.name || "-"}</span>
              </div>

              <div>
                <span>Section</span>
                <label>{user.section || "-"}</label>
              </div>
            </>
          )}

          {role === "teacher" && (
            <>
              <div>
                <span>Employee ID</span>
                <label>{user.employeeId || "-"}</label>
              </div>

              <div>
                  <span>Subjects    </span>
                <label>
                  {user.subjects?.length
                    ? user.subjects.map((s) => s.name).join(", ")
                    : "-"}</label>
              </div>

              <div>
                <span>Department</span>
                <label>{user.departmentId?.name || "-"}</label>
              </div>
            </>
          )}

          {(role === "admin" || role === "hod") && (
            <>
              <div>
                <span>Employee ID</span>
                <label>{user.employeeId || "-"}</label>
              </div>

              <div>
                <span>Department</span>
                <label>{user.departmentId?.name || "-"}</label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;