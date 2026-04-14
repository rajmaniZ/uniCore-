
import { Link } from 'react-router-dom';

import {useState} from 'react';
// import styles from './forget-password.module.css';
import styles from './login.module.css'
function ForgetPassword(){
    
    const [digit, setDigit]=useState(false);
    
    const [formData, setFormData] = useState({
        username: "",
        Otp: ""
        });

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };    
        const isUsernameValid =
            formData.username.trim() !== "";
        const isOtpValid=
            formData.Otp.trim() !== "";
    return (
        <>
            <div className={styles.page}>
                <div>
                    <form className={styles.loginForm}>
                        <div className={`${styles.title} ${styles.titleForget} `}>
                            <img src="/uniCore.png" alt="logo" className={styles.logo} />
                            <h1>uniCore</h1>
                        </div>
                        <h2 className={styles.h2}>Welcome!</h2>
                        {/* <div className={styles.loginForm}> */}
                        <div className={styles.inputSection}>
                            <label for="username"></label>
                            <input type="text" id="username" name="username" placeholder="Username / Email " value={formData.username} onChange={handleChange}/>
                            <div className={`${styles.forgetBtn} ${styles.loginBtn}`}>
                                <button type="submit" 
                                
                                disabled={!isUsernameValid}

                                className={styles.loginButton} 
                                onClick={(e) => {  
                                        e.preventDefault();
                                        alert("OTP sent");
                                        setDigit(true);
                                    }
                                 }>Send OTP</button>

                                 
                            {digit && (
                                    <>
                                        <input 
                                            required 
                                            type="text" 
                                            placeholder="Enter otp" 
                                            name="Otp"
                                            value={formData.Otp} onChange={handleChange}
                                        />
                                        <button
                                        disabled={!isOtpValid}
                                        className={styles.verifyButton}
                                        onClick={()=>alert("login successfull")}>Verify</button>
                                    
                                    </>
                                )}
                                

                            </div  >
                                <div className={styles.linkToOtherPages}>
                            <Link to='/login' className={styles.forgetPass}>Back to login Page</Link>
                            <p className={styles.registerLink}>Don't have an account? <Link to='/register' className={styles.registerLink}>Register</Link></p>
                            
                            <Link to="/" className={styles.returnHome}>Back to Home</Link>
                        </div>
                        </div>
                    </form>
                   
                </div>

            </div>


        </>




    );
}

export default ForgetPassword;