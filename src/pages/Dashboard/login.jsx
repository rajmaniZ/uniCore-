import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
    }

    setIsLoading(false);
  };

  // Demo accounts
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
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>C</div>
          <h1>CampusOS</h1>
        </div>

        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

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
      </div>
    </div>
  );
}

export default Login;
