// import {outlet} from 'react'

import {Outlet} from 'react-router-dom';
import styles from './layout.module.css';
import ShowList from './../../../component/showList/showList'

import Sidebar from '../../../component/DashboardSidebar/Sidebar';
import DashboardHeader from '../../../component/dashboardHeader/header';

function DashboardLayout(){
  return(
    <>
    <DashboardHeader/>
    <div className={styles.frame}>
      <Sidebar/>
        {/* <div className={styles.page}> */}
            {/* <main className={styles.main}> */}
                <Outlet/>
                <ShowList className={styles.showList}/>
            {/* </main> */}
            
        {/* </div> */}

        
        
    </div>
    </>
  )
}

export default DashboardLayout;