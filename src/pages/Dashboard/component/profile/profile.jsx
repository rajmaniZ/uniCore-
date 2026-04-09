import { useState } from "react";
import { useAuth } from "./../../context/AuthContext";
import styles from "./profile.module.css";

function Profile() {
  const { currentUser, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    bio: currentUser?.bio || "",
    avatar: currentUser?.avatar || "",
  });

  if (!currentUser) return <div>Loading...</div>;

  const role = currentUser.role?.toLowerCase();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateProfile(formData); // 🔥 update in context
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img
            src={
              formData.avatar ||
              `https://ui-avatars.com/api/?name=${formData.name}`
            }
            alt="profile"
            className={styles.avatar}
          />

          {isEditing && (
            <input
              type="text"
              name="avatar"
              placeholder="Paste image URL"
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
            <h2>{currentUser.name}</h2>
          )}

          <span className={styles.role}>{role.toUpperCase()}</span>
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

      {/* ABOUT */}
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
          <p>{currentUser.bio || "No bio added"}</p>
        )}
      </div>

      {/* NON EDITABLE INFO */}
      <div className={styles.section}>
        <h3>Details</h3>

        <div className={styles.grid}>
          <div>
            <label>Email</label>
            <span>{currentUser.email}</span>
          </div>

          {role === "student" && (
            <>
              <div>
                <label>Roll No</label>
                <span>{currentUser.rollNo}</span>
              </div>
              <div>
                <label>Branch</label>
                <span>{currentUser.branch}</span>
              </div>
            </>
          )}

          {role === "teacher" && (
            <div>
              <label>Subjects</label>
              <span>{currentUser.subjects?.join(", ")}</span>
            </div>
          )}

          {(role === "admin" || role === "hod") && (
            <div>
              <label>Department</label>
              <span>{currentUser.department}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;