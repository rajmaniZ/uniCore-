import {NavLink} from 'react-router-dom';


import styles from './navbar.module.css'

function Navbar(){
    return (
        <>
            <div className={styles.nav}>
                {/* <img src="../../public/uniCore.png" alt="logo" className={styles.logo}/> */}
                <NavLink to='/' ><img src="/uniCore.png" alt="logo" className={styles.logo}/></NavLink>
                <div className={styles.listOfNavMenu}>
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
                    
                    {/* <NavLink   
                        to='/' 
                        className={({isActive}) => isActive 
                        ? `${styles.features} ${styles.active}`
                        : styles.features}>
                        features
                    </NavLink> */}
                    
                    {/* <NavLink   
                        to='/' 
                        className={({isActive}) => isActive 
                        ? `${styles.features} ${styles.active}`
                        : styles.features}>
                        features
                    </NavLink> */}

                    {/* <NavLink 
                        to='/Features' className={styles.features}>Features</NavLink>
                    <NavLink to='/About' className={styles.about}>About</NavLink>
                    <NavLink to='/Contact' className={styles.contact}>Contact</NavLink> */}
                    <div className={styles.loginAndRegister}>
                        {/* <NavLink   
                            to='/login' 
                            className={({isActive}) => isActive 
                            ? `${styles.login} ${styles.active}`
                            : styles.login}>
                            Login
                        </NavLink>
                        <NavLink   
                            to='/Regis' 
                            className={({isActive}) => isActive 
                            ? `${styles.features} ${styles.active}`
                            : styles.features}>
                            features
                        </NavLink> */}
                        <NavLink to='/login' className={styles.login}>Login</NavLink>
                        <NavLink to='/register' className={styles.register}>Sign Up</NavLink> 
                    </div>
                </div>
            </div>
            <hr/>

        </>
    );
}

export default Navbar;