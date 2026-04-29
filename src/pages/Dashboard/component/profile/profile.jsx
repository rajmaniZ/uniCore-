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
        {/* <div className={styles.avatarWrapper}>
          <img
            src={
              formData.avatar ||
              "https://via.placeholder.com/150"
            }
            alt="profile"
            className={styles.avatar}
          />

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
        </div> */}
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
            <label>Email</label>
            <span>{user.email}</span>
          </div>

          {role === "student" && (
            <>
              <div>
                <label>Roll No</label>
                <span>{user.rollNumber || "-"}</span>
              </div>

              <div>
                <label>Course</label>
                <span>{user.courseId?.name || "-"}</span>
              </div>

              <div>
                <label>Semester</label>
                <span>{user.semester || "-"}</span>
              </div>

              <div>
                <label>Class</label>
                <span>{user.classId?.name || "-"}</span>
              </div>

              <div>
                <label>Section</label>
                <span>{user.section || "-"}</span>
              </div>
            </>
          )}

          {role === "teacher" && (
            <>
              <div>
                <label>Employee ID</label>
                <span>{user.employeeId || "-"}</span>
              </div>

              <div>
                <label>Subjects</label>
                <span>
                  {user.subjects?.length
                    ? user.subjects.map((s) => s.name).join(", ")
                    : "-"}
                </span>
              </div>

              <div>
                <label>Department</label>
                <span>{user.departmentId?.name || "-"}</span>
              </div>
            </>
          )}

          {(role === "admin" || role === "hod") && (
            <>
              <div>
                <label>Employee ID</label>
                <span>{user.employeeId || "-"}</span>
              </div>

              <div>
                <label>Department</label>
                <span>{user.departmentId?.name || "-"}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;