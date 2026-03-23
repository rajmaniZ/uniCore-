import {Outlet} from 'react-router-dom';
import Navbar from '../component/navabar/navbar'; 
import Footer from '../component/footer/footer';

// import Background  from './background/animatedBackground';

import styles from './layout.module.css';

function Layout(){
    return (
        <div className={styles.layout}>
            {/* <Background/> */}
            <Navbar/>
            <main className={styles.main}>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
}

export default Layout;
