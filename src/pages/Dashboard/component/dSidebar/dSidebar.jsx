import { NavLink } from "react-router-dom";
import { useAuth } from "../../../../context/authContext";
import { roleConfig } from "../../config/roleConfig";
import styles from "./dSidebar.module.css";

const Icons = {
  dashboard: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" /></svg>,
  users: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z" /></svg>,
  building: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12ZM6 19H4v-2h2v2Zm0-4H4v-2h2v2Zm0-4H4V9h2v2Zm0-4H4V5h2v2Zm4 12H8v-2h2v2Zm0-4H8v-2h2v2Zm0-4H8V9h2v2Zm0-4H8V5h2v2Zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10Z" /></svg>,
  book: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2ZM6 4h5v8l-2.5-1.5L6 12V4Z" /></svg>,
  clipboard: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Zm2 14H7v-2h7v2Zm3-4H7v-2h10v2Zm0-4H7V7h10v2Z" /></svg>,
  checkSquare: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z" /></svg>,
  calendar: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H5V8h14v11Z" /></svg>,
  settings: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.28 7.28 0 0 0-1.69-.98L14.5 2.42A.49.49 0 0 0 14 2h-4c-.25 0-.46.18-.5.42L9.13 5.07c-.61.25-1.18.59-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.08.65-.08.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.13.22.39.31.61.22l2.49-1c.51.4 1.08.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.61-.25 1.18-.58 1.69-.98l2.49 1c.23.08.48 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" /></svg>,
  userPlus: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4ZM6 10V7H4v3H1v2h3v3h2v-3h3v-2H6Zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" /></svg>,
  chalkboard: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3ZM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" /></svg>,
  user: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" /></svg>,
  logout: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 7 15.59 8.41 18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5-5-5ZM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5Z" /></svg>,
};

function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase() || "student";
  const menuItems = roleConfig[role]?.sidebar || [];
  const profilePath = `/${role}/profile`;

  const renderIcon = (name) => {
    const Icon = Icons[name];
    return Icon ? <Icon /> : null;
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.logoSection}>
        <div className={styles.logoDiv}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          {!collapsed && <h1>uniCore</h1>}
        </div>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.menu}>
          <li>
            <button className={`${styles.menuItem} ${styles.toggleBtn}`} onClick={onToggle}>
              <span className={styles.icon}>
                <svg viewBox="0 0 24 24">
                  <path d={collapsed ? "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" : "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z"} />
                </svg>
              </span>
            </button>
          </li>

          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}
                title={collapsed ? item.name : ""}
              >
                <span className={styles.icon}>{renderIcon(item.icon)}</span>
                {!collapsed && <span className={styles.label}>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.userSection}>
        <NavLink to={profilePath} className={styles.userInfo}>
          <div className={styles.avatar}>{user?.name?.charAt(0) || "U"}</div>
          {!collapsed && (
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.name || "User"}</span>
              <span className={styles.userRole}>{roleConfig[role]?.label || role}</span>
            </div>
          )}
        </NavLink>

        <button className={styles.logoutBtn} onClick={logout} title="Logout">
          <span className={styles.icon}>{renderIcon("logout")}</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
