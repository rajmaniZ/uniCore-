import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './../Dashboard/context/AuthContext';

import styles from './login.module.css';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const isFormValid = email && password;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = login(email, password);

        if (result.success) {
            if (result.user.role === "superadmin") {
                navigate("/superadmin");
            } else {
                navigate(`/institute/${result.user.instituteId}`);
            }
        } else {
            setError(result.message || "Invalid credentials");
        }

        setIsLoading(false);
    };

    const demoAccounts = [
        { role: 'admin', email: 'admin@abc.edu', password: 'admin123' },
        { role: 'teacher', email: 'john@abc.edu', password: 'teacher123' },
        { role: 'student', email: 'student01@abc.edu', password: 'student123' },
    ];

    const fillDemo = (account) => {
        setEmail(account.email);
        setPassword(account.password);
    };

    return (
        <div className={styles.page}>
            {/* <div className={styles.loginfFormdiv}> */}

                <div className={styles.title}>
                    <img src="/uniCore.png" alt="logo" className={styles.logo} />
                    <h1>uniCore</h1>
                </div>
                    <h2 className={styles.h2}>Welcome Back</h2>

                <form className={styles.loginForm} onSubmit={handleSubmit}>

                {/* {error && <div className={styles.error}>{error}</div>} */}


                    <div className={styles.inputSection}>
                        {/* <label>Email</label> */}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />

                        {/* <label>Password</label> */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className={styles.linkToOtherPages}>
                    <Link to='/forget-password' className={styles.forgetPass}>
                        Forget Password?
                    </Link>

                    <div className={styles.loginBtn}>
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={styles.loginButton}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>


                    <div className={styles.demoSection}>
                        <p>Demo Accounts:</p>
                        <div className={styles.demoButtons}>
                            {demoAccounts.map((account) => (
                                <button
                                    key={account.role}
                                    type="button"
                                    onClick={() => fillDemo(account)}
                                    className={styles.demoBtn}
                                >
                                    {account.role}
                                </button>
                            ))}
                        </div>
                    </div>

                    
                    <p className={styles.registerLink}>
                        Don't have an account?{" "}
                        <Link to='/register' className={styles.registerLink}>
                            Register
                        </Link>
                    </p>
                    <Link to="/" className={styles.returnHome}>
                        Back to Home
                    </Link>
                </div>
                </form>

            {/* </div> */}
        </div>
    );
}

export default Login;