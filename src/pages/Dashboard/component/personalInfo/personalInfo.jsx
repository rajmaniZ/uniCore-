import styles from './personalInfo.module.css';

function PersonalInfo({ user }) {
  return (
    <div className={styles.card}>
      <h3>Personal Info</h3>

      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
    </div>
  );
}

export default PersonalInfo;