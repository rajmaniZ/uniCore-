import {NavLink,useLocation} from 'react-router-dom';


import styles from './navbar.module.css'

function Navbar(){
    const location=useLocation();
    const isHome=location.pathname==="/";
    return (
        <>
            <nav className={`${styles.nav} ${isHome ? styles.homeNav: ""} `}>
                <NavLink to='/' ><img src="/uniCore.png" alt="logo" className={`${styles.logo} `}/></NavLink>
                <div className={`${styles.listOfNavMenu} ${isHome ? styles.homeListOfNavMenu: ""} `} >
                    <NavLink   
                        to='/' 
                        end
                        className={({isActive}) => isActive 
                        ? `${styles.navMenu} ${styles.active}`
                        : styles.NavMenu}>
                        Home
                    </NavLink>

                    <NavLink   
                        to='/features' 
                        className={({isActive}) => isActive 
                        ? `${styles.features} ${styles.active}`
                        : styles.features}>
                        Features
                    </NavLink>

                    
                    <NavLink   
                        to='/about' 
                        className={({isActive}) => isActive 
                        ? `${styles.about} ${styles.active}`
                        : styles.about}>
                        About
                    </NavLink>
                    
                    
                    <NavLink   
                        to='/contact' 
                        className={({isActive}) => isActive 
                        ? `${styles.Contect} ${styles.active}`
                        : styles.Contect}>
                        Contect
                    </NavLink>
                    
                    <div className={styles.loginAndRegister}>
                        <NavLink to='/login' className={styles.login}>Login</NavLink>
                        <NavLink to='/register' className={styles.register}>Sign Up</NavLink> 
                    </div>
                </div>
            </nav>
            <hr className={styles.hrFaded}/>

        </>
    );
}

export default Navbar;