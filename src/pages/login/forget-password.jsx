
import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './login.module.css';
import Logo  from './../../component/logo/logo'

import {
  forgotPassword,
  resetPassword
} from '../../api/userAPI';

function ForgetPassword() {

  const [digit, setDigit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isEmailValid = formData.email.trim() !== "";
  const isOtpValid = formData.otp && formData.newPassword;

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await forgotPassword(formData.email);

      alert("OTP sent to your email");
      setDigit(true);

    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      alert("Password reset successful");

      window.location.href = "/login";

    } catch (err) {
      alert(err.response?.data?.msg || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <>
    <svg width="0" height="0">
                <defs>
                    <linearGradient id="uniGradient" x1="60%" y1="90%" x2="0%" y2="30%">
                    <stop offset="10%" stopColor="#ff6ec4" />
                    <stop offset="10%" stopColor="#ff9a44" />
                    <stop offset="30%" stopColor="#f9c449" />
                    <stop offset="60%" stopColor="#4cd964" />
                    <stop offset="10%" stopColor="#5ac8fa" />
                    <stop offset="90%" stopColor="#5856d6" />
                    </linearGradient>
                </defs>
            </svg>
        
    <div className={styles.page}>
       <form className={styles.loginForm}>
           <div className={`${styles.title} ${styles.titleForget}`}>
        <Logo className={styles.logo} />
        <h1 className={styles.logoDiv}>uniCore</h1>
      </div>

        <h2 className={styles.h2}>Reset Password</h2>

        <div className={styles.inputSection}>

          {}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          {}
          <div className={`${styles.forgetBtn} ${styles.loginBtn}`}>
            <button
              type="button"
              disabled={!isEmailValid || loading}
              onClick={handleSendOtp}
              className={styles.loginButton}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {}
          {digit && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                disabled={!isOtpValid || loading}
                onClick={handleVerify}
                className={styles.verifyButton}
              >
                {loading ? "Verifying..." : "Reset Password"}
              </button>
            </>
          )}

          <div className={styles.linkToOtherPages}>
            <Link to='/login'>Back to login</Link>

            <p>
              Don't have an account?{" "}
              <Link to='/register'>Register</Link>
            </p>

            <Link to="/">Back to Home</Link>
          </div>

        </div>
      </form>
    </div>
    </>
  );
}

export default ForgetPassword;