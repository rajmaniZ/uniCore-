import { useState } from "react";
import { useAuth } from "../../../../context/authContext"; 
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

function Navbar({ onMenuToggle }) {
  const { user } = useAuth(); 

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New Assignment",
      message: "DSA assignment due tomorrow",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Attendance Marked",
      message: "Your attendance has been marked for OS",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      title: "Grade Updated",
      message: "DBMS mid-sem marks uploaded",
      time: "2h ago",
      unread: false,
    },
  ];

  
  const role = user?.role?.toLowerCase();

  
  const profilePath = role ? `/${role}/profile` : "/login";

  return (
    <header className={styles.navbar}>
      {}
      <div className={styles.left}>
        <div className={styles.searchBox}>
          <svg viewBox="0 0 24 24" className={styles.searchIcon}>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {}
      <div className={styles.right}>
        {}
        <div className={styles.notificationWrapper}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>

            <span className={styles.badge}>
              {notifications.filter((n) => n.unread).length}
            </span>
          </button>

          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.dropdownHeader}>
                <h4>Notifications</h4>
                <button className={styles.markAllRead}>
                  Mark all read
                </button>
              </div>

              <div className={styles.notificationList}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`${styles.notificationItem} ${
                      notif.unread ? styles.unread : ""
                    }`}
                  >
                    <div className={styles.notificationContent}>
                      <span className={styles.notificationTitle}>
                        {notif.title}
                      </span>
                      <span className={styles.notificationMessage}>
                        {notif.message}
                      </span>
                    </div>

                    <span className={styles.notificationTime}>
                      {notif.time}
                    </span>
                  </div>
                ))}
              </div>

              <button className={styles.viewAll}>
                View All Notifications
              </button>
            </div>
          )}
        </div>

        {}
        <button className={styles.iconBtn}>
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        </button>

        {}
        <Link to={profilePath}>
          <div className={styles.userAvatar}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="profile"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;