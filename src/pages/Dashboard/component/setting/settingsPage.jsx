import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./settingsPage.module.css";

function SettingsPage() {
  const { currentUser, updateProfile } = useAuth();

  const role = currentUser?.role?.toLowerCase();

  const [settings, setSettings] = useState({
    theme: currentUser?.theme || "light",
    notifications: currentUser?.notifications ?? true,
    language: currentUser?.language || "en",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  if (!currentUser) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(settings);
    alert("Settings updated");
  };

  const handlePasswordSave = () => {
    console.log(passwords);
    alert("Password updated (mock)");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Settings</h2>

      {/* ---------- GENERAL SETTINGS ---------- */}
      <div className={styles.section}>
        <h3>General</h3>

        <div className={styles.row}>
          <label>Theme</label>
          <select name="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className={styles.row}>
          <label>Notifications</label>
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <label>Language</label>
          <select name="language" value={settings.language} onChange={handleChange}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>

      {/* ---------- ROLE BASED SETTINGS ---------- */}

      {role === "student" && (
        <div className={styles.section}>
          <h3>Student Settings</h3>
          <div className={styles.row}>
            <label>Show Attendance</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className={styles.row}>
            <label>Auto Download Notes</label>
            <input type="checkbox" />
          </div>
        </div>
      )}

      {role === "teacher" && (
        <div className={styles.section}>
          <h3>Teacher Settings</h3>
          <div className={styles.row}>
            <label>Auto Publish Grades</label>
            <input type="checkbox" />
          </div>
          <div className={styles.row}>
            <label>Allow Student Messages</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      )}

      {(role === "admin" || role === "hod") && (
        <div className={styles.section}>
          <h3>Admin Controls</h3>
          <div className={styles.row}>
            <label>Approve Requests Automatically</label>
            <input type="checkbox" />
          </div>
          <div className={styles.row}>
            <label>Allow New Registrations</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      )}

      {/* ---------- PASSWORD ---------- */}
      <div className={styles.section}>
        <h3>Change Password</h3>

        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={handlePasswordChange}
          className={styles.input}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          className={styles.input}
        />

        <button className={styles.saveBtn} onClick={handlePasswordSave}>
          Update Password
        </button>
      </div>

      {/* ---------- SAVE ---------- */}
      <button className={styles.saveBtn} onClick={handleSave}>
        Save All Settings
      </button>
    </div>
  );
}

export default SettingsPage;