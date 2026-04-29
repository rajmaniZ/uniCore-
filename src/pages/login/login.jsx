import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import styles from "./login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      const role = result.user?.role?.toLowerCase();

      if (role === "superadmin") navigate("/superadmin");
      else if (["admin", "hod", "teacher", "student"].includes(role)) navigate(`/${role}`);
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.title}>
        <img src="/uniCore.png" alt="logo" className={styles.logo} />
        <h1>uniCore</h1>
      </div>

      <h2 className={styles.h2}>Welcome Back</h2>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputSection}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className={styles.linkToOtherPages}>
          <Link to="/forgotPassword" className={styles.forgetPass}>Forget Password?</Link>

          <div className={styles.loginBtn}>
            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || isSubmitting}
              className={styles.loginButton}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className={styles.registerLink}>
            Don't have an account? <Link to="/register" className={styles.registerLink}>Register</Link>
          </p>

          <Link to="/" className={styles.returnHome}>Back to Home</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
