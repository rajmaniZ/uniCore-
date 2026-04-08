import styles from "./Sidebar.module.css";
import { Link } from 'react-router-dom';
// const departments = ["IT", "CS", "ECE", "EE", "ME", "CE"];

function Sidebar() {
  return (
    <>
      <div className={styles.SidebarDiv}>
        <div className={styles.sidebarLogoDiv}>
          <img src="/uniCore.png" alt="logo" className={`${styles.logo}`} />
          <h1 className="logo-text">uniCore</h1>

          <div className={styles.SidebarDiv}>
          </div>
          <ul className={styles.list}>
            <li><Link><img src="/uniCore.png" alt="dash" /><span>Dashboard</span></Link></li>
            <li><Link><img src="/uniCore.png" alt="student" /><span>Students</span></Link></li>
            <li><Link><img src="/uniCore.png" alt="Teacher" /><span>Teacher</span></Link></li>
            <li><Link><img src="/uniCore.png" alt="request" /><span>Join Request</span></Link></li>
            <li><Link><img src="/uniCore.png" alt="setting" /><span>Settings</span></Link></li>


          </ul>
          <div className={styles.Bottom} >
            <p><img src="/uniCore.png" alt="profile"></img>userName</p>
            <button><img src="/uniCore.png" alt="logout" />Logout</button>
          </div>
        </div>
        </div>
      </>
      );
}

      export default Sidebar;