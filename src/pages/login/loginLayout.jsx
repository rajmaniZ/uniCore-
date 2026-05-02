
import {Link } from 'react-router-dom';

import {Outlet} from 'react-router-dom';

import styles from './loginLayout.module.css';
function Login() {
    return (
    <div className={styles.frame}>
        
        <div className={styles.loginImg}>
        </div>
        <div className={styles.page}>
            <main className={styles.main}>
                <Outlet />
                
            </main>
            
        </div>

    </div>
                
    );
}

export default Login;