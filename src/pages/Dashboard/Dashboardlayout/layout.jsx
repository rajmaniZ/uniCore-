// import {outlet} from 'react'

import {Outlet} from 'react-router-dom';
import styles from './layout.module.css';
import ShowList from './../../../component/showList/showList'

import Sidebar from '../../../component/DashboardSidebar/Sidebar';
import DashboardHeader from '../../../component/dashboardHeader/header';

function DashboardLayout(){
  return(
    <>
    <div className={styles.frame}>
    <Sidebar className={styles.Sidebar}/>
    <div className={styles.navAndMain}>
        <DashboardHeader/>
        <Outlet/>
    </div>
        
        
    </div>
    </>
  )
}

export default DashboardLayout;