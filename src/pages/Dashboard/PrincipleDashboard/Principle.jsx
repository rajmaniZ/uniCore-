import DashboardHeader from "../../../component/dashboardHeader/header";
import DashboardSidebar from './../../../component/DashboardSidebar/Sidebar'
import ShowData from './../../../component/dataShow/dataShow'
import styles from './Principle.module.css'
function Principle(){
    return(
        <>
        <DashboardHeader/>
        <div className={styles.ShowData}>
        <DashboardSidebar/>
        
        <ShowData/>
        </div>
        
        </>
    )

}

export default Principle;