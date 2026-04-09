import styles from './recentActivity.module.css';

function RecentActivity({ activities = [] }) {
  return (
    <div className={styles.container}>
      <h3>Recent Activity</h3>

      {activities.length === 0 ? (
        <p className={styles.empty}>No Activity</p>
      ) : (
        activities.map((act, index) => (
          <div key={index} className={styles.item}>
            <p>{act.action}</p>
            <span>{act.time}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default RecentActivity;