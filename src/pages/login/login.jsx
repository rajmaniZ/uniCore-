import { Link } from 'react-router-dom';
import { useState } from 'react';

import styles from './login.module.css';
function Login() {
    
    const [formData, setFormData] = useState({
        username: "",
        password: ""
        });

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };    
        const isFormValid =
            formData.username.trim() !== "" &&
            formData.password.trim() !== "";

    return (

        
        <>
            <div className={styles.page}>
                <div>
                    <form className={styles.loginForm}>
                        <div className={styles.title}>
                            <img src="/uniCore.png" alt="logo" className={styles.logo} />
                            <h1>Login</h1>
                        </div>
                        <div className={styles.inputSection}>
                            {/* <label for="username"></label> */}
                            <input type="text" id="username" name="username" placeholder="Username / Email" value={formData.username} onChange={handleChange} />

                            {/* <label for="password"></label> */}
                            <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}/>
                            {/* <div> */}
                            <Link to='/forget-password' className={styles.forgetPass}>Forget Password?</Link>
                            {/* </div> */}
                           <div>
                                <button 
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={styles.loginButton} 
                                    onClick={(e) => {  
                                        e.preventDefault();
                                        alert("login success");
                                        setDigit(true);
                                    }}
                                >
                                    Login
                                </button>
                            </div>

                            <p className={styles.registerLink}>Don't have an account? <Link to='/register' className={styles.registerLink}>Register</Link></p>
                            
                            <Link to="/" className={styles.returnHome}>Back to Home</Link>
                        </div>
                    </form>
                   
                </div>

            </div>


        </>




    );
}

export default Login;