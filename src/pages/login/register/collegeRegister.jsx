





















































































































































































































import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./collegeRegister.module.css";

import {
  sendCollegeOtp,
  verifyCollegeOtp,
  registerCollege,
} from "../../../api/userAPI";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterCollege() {
  const navigate = useNavigate();

  const [digit, setDigit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [formData, setFormData] = useState({
    instituteType: "college",
    collegeName: "",
    collegeCode: "",
    collegeEmail: "",
    adminName: "",
    adminEmail: "",
    password: "",
    collegeOtp: "",
    adminOtp: "",
  });

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trimStart(),
    });
  };

  const isFormValid =
    formData.collegeName &&
    formData.collegeEmail &&
    formData.adminName &&
    formData.adminEmail;

  const isOtpValid =
    formData.collegeOtp &&
    formData.adminOtp &&
    formData.password;

  
  const getPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.length >= 8
    )
      return "Strong";
    return "Medium";
  };

  const passwordStrength = getPasswordStrength(formData.password);

  
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  
  const handleSendOtp = async () => {
    try {
      setLoading(true);

      await sendCollegeOtp({
        collegeEmail: formData.collegeEmail.trim(),
        adminEmail: formData.adminEmail.trim(),
      });

      toast.success("OTP sent to both emails");
      setDigit(true);
      setTimer(60);

    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  
  const handleRegister = async () => {
    try {
      if (!formData.password || formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      setLoading(true);

      
      await verifyCollegeOtp({
        collegeEmail: formData.collegeEmail.trim(),
        adminEmail: formData.adminEmail.trim(),
        collegeOtp: formData.collegeOtp.trim(),
        adminOtp: formData.adminOtp.trim(),
      });

      
      const { data } = await registerCollege({
        name: formData.adminName.trim(),
        email: formData.adminEmail.trim(),
        password: formData.password.trim(),
        instituteName: formData.collegeName.trim(),
        type: formData.instituteType,
      });

      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Registration successful");

      setTimeout(() => {
        navigate("/admin");
      }, 1200);

    } catch (err) {
      toast.error(err.response?.data?.msg || "OTP mismatch or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />

      <form className={styles.registerForm}>
        {}
        <div className={styles.title}>
          <img src="/uniCore.png" alt="logo" className={styles.logo} />
          <h1>UniCore</h1>
        </div>

        <div className={styles.inputSection}>
          {}
          <fieldset>
            <legend>Institute Details</legend>

            <select name="instituteType" onChange={handleChange} value={formData.instituteType}>
              <option value="college">College / University</option>
              <option value="school">School</option>
            </select>

            <input
              name="collegeName"
              placeholder={formData.instituteType === "school" ? "School Name *" : "College Name *"}
              onChange={handleChange}
            />

            <input
              name="collegeCode"
              placeholder={formData.instituteType === "school" ? "School Code" : "College Code"}
              onChange={handleChange}
            />

            <input
              name="collegeEmail"
              placeholder={formData.instituteType === "school" ? "School Email *" : "College Email *"}
              onChange={handleChange}
            />
          </fieldset>

          {}
          <fieldset>
            <legend>Admin Details</legend>

            <input
              name="adminName"
              placeholder="Admin Name *"
              onChange={handleChange}
            />

            <input
              name="adminEmail"
              placeholder="Admin Email *"
              onChange={handleChange}
            />
          </fieldset>

          {}
          <button
            type="button"
            disabled={!isFormValid || loading || timer > 0}
            className={styles.registerButton}
            onClick={handleSendOtp}
          >
            {timer > 0
              ? `Resend in ${timer}s`
              : loading
                ? "Sending..."
                : "Send OTP"}
          </button>

          {}
          {digit && (
            <>
              <input
                name="collegeOtp"
                placeholder="College OTP"
                onChange={handleChange}
              />

              <input
                name="adminOtp"
                placeholder="Admin OTP"
                onChange={handleChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />

              <p
                style={{
                  color:
                    passwordStrength === "Strong"
                      ? "green"
                      : passwordStrength === "Medium"
                        ? "orange"
                        : "red",
                }}
              >
                Strength: {passwordStrength}
              </p>

              <button
                type="button"
                disabled={!isOtpValid || loading}
                className={styles.verifyButton}
                onClick={handleRegister}
              >
                {loading ? "Processing..." : "Verify & Register"}
              </button>
            </>
          )}

          {}
          <p className={styles.loginLink}>
            Already registered <Link to="/login">Login</Link>

          </p>
          <p className={styles.registerLink}>
            Don't have an account? {" "}
            <Link to='/requestAccount' className={styles.registerLink}>
             Request to Your Institute
            </Link>
          </p>

          <Link to="/" className={styles.returnHome}>
            Back to Home
          </Link>
        </div>
      </form>
    </>
  );
}

export default RegisterCollege;
