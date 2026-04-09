import styles from './stats.module.css';

function StatsCard({ title, value, change, changeType, icon, color }) {
  const colorClasses = {
    blue: styles.blue,
    purple: styles.purple,
    green: styles.green,
    orange: styles.orange,
  };

  return (
    <div className={`${styles.statsCard} ${colorClasses[color] || styles.blue}`}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <div className={styles.valueRow}>
          <span className={styles.value}>{value}</span>
          {change && (
            <span className={`${styles.change} ${changeType === 'positive' ? styles.positive : styles.negative}`}>
              {changeType === 'positive' ? '↑' : '↓'} {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
