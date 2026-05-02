import { useState } from "react";
import { useAuth } from "../../../../context/authContext";
import styles from "./settingsPage.module.css";

import {
  updateUser,
  setupPassword
} from "../../../../api/userAPI";

function SettingsPage() {

  const { user } = useAuth(); 

  const role = user?.role?.toLowerCase();

  const [settings, setSettings] = useState({
    theme: user?.theme || "light",
    notifications: user?.notifications ?? true,
    language: user?.language || "en",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  if (!user) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateUser(user._id, settings);

      alert("Settings updated");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    try {
      if (!passwords.newPassword) {
        alert("Enter new password");
        return;
      }

      setLoading(true);

      await setupPassword({
        password: passwords.newPassword,
      });

      setPasswords({ oldPassword: "", newPassword: "" });

      alert("Password updated");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Settings</h2>

      {}
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
            className="check"
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

      {}

      {role === "student" && (
        <div className={styles.section}>
          <h3>Student Settings</h3>
          <div className={styles.row}>
            <label>Show Attendance</label>
            <input type="checkbox" />
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

      {}
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

        <button
          className={styles.saveBtn}
          onClick={handlePasswordSave}
          disabled={loading}
        >
          Update Password
        </button>
      </div>

      {}
      <button
        className={styles.saveBtn}
        onClick={handleSave}
        disabled={loading}
      >
        Save All Settings
      </button>
    </div>
  );
}

export default SettingsPage;