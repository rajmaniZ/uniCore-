import { Link } from 'react-router-dom';
import styles from './login.module.css';
function Login() {
    return (
        <div className={styles.frame}>
            
            <div className={styles.loginImg}>
                    {/* <img scr="../../src/assets/loginImg.jpg" alt="loginimg" /> */}
            </div>
            <div className={styles.page}>
                <div>
                    <form className={styles.loginForm}>
                        <div className={styles.title}>
                            <img src="/uniCore.png" alt="logo" className={styles.logo} />
                            <h1>Login</h1>
                        </div>
                        <div className={styles.inputSection}>
                            <div>
                                <label for="username"></label>
                                <input type="text" id="username" name="username" placeholder="Username" />
                            </div>
                            <div>
                                <label for="password"></label>
                                <input type="password" id="password" name="password" placeholder="Password" />
                            </div>
                            <div>
                                <Link to='/forget-password' className={styles.forgetPass}>Forget Password?</Link>
                            </div>
                            <div>
                                <button type="submit" className={styles.loginButton} onClick={()=>alert("login success")}>Login</button>
                            </div>
                            <div>
                                <p className={styles.registerLink}>Don't have an account? <Link to='/register' className={styles.registerLink}>Register</Link></p>
                            </div>
                        </div>
                    </form>
                    <Link to="/" className={styles.returnHome}>Back to Home</Link>
                </div>

            </div>


           
        </div>
                


    );
}

export default Login;