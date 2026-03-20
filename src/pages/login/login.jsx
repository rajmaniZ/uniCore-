import {Link} from 'react-router-dom';
import styles from './login.module.css';
function Login(){
    return(
        <>
            <form className={styles.loginForm}>
                <h1>Login</h1>
                <label for="username"></label>
                <input type="text" id="username" name="username" placeholder="Username"/>
                <label for="password"></label>
                <input type="password" id="password" name="password" placeholder="Password"/>
                <Link to='/forget-password' className={styles.forgetPass}>Forget Password?</Link>
                <button type="submit" className={styles.loginButton}>Login</button>
                <p className={styles.registerLink}>Don't have an account? <Link to='/register' className={styles.registerLink}>Register</Link></p> 

            </form>
            
        </>
    );
}

export default Login;