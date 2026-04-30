
import {Link} from 'react-router-dom'
import { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from './../dSidebar/dSidebar';
import Navbar from './../navbar/navbar';
import styles from './Dashboardlayout.module.css';
// import chatAI from "/chatWithAi.png"


function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const chatAI = "/chatWithAi.png";
  
  return (
    <div className={styles.layout}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <a  className={styles.Ai} href="/aiChat">
      <img src={chatAI} alt="Ask?" />
        </a>
        <main className={styles.content}>

          <Outlet /> {}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;