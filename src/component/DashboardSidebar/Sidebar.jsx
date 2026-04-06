import styles from "./Sidebar.module.css";
function Sidebar() {
  return (
    <>
      <div className={styles.SidebarDiv}>
        <ul>
          <li>Dashboard</li>
          <li>
            Departments
            <select>
              <option className={styles.option}>
                {" "}
                IT
                <select>
                  <option>Tacher</option>
                </select>
              </option>
              <option option className={styles.option}>
                CS
              </option>
              <option className={styles.option}> ECE</option>
              <option option className={styles.option}>
                EE
              </option>
              <option className={styles.option}> ME</option>
              <option option className={styles.option}>
                CE
              </option>
              <select>
                <li>Teacher</li>
                <option option className={styles.option} value="">
                  Year
                </option>
                <select>
                  <option option className={styles.option} value="1">
                    First Year
                  </option>
                  <option option className={styles.option} value="2">
                    Second Year
                  </option>
                  <option option className={styles.option} value="3">
                    Third Year
                  </option>
                  <option option className={styles.li} value="4">
                    Fourth Year
                  </option>
                </select>
              </select>
            </select>
          </li>
          <li>Teacher</li>
          <li>Students</li>
          <li>Dashboard</li>
          <li>Dashboard</li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
