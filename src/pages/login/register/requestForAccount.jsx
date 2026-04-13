import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './requestForAccount.module.css';

function Register() {
    const [role, setRole] = useState("");
    const [digit, setDigit] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        collegeName: "",
        department: "",
        year: "",
        rollNumber: "",
        employeeID: "",
        otp: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // validation based on role
    const isStudentValid =
        formData.name &&
        formData.email &&
        role &&
        formData.collegeName &&
        // formData.department &&
        // formData.year &&
        formData.rollNumber;

    const isTeacherValid =
        formData.name &&
        formData.email &&
        role &&
        formData.collegeName &&
        formData.department &&
        formData.employeeID;

    const isFormValid =
        role === "student" ? isStudentValid :
            role === "teacher" ? isTeacherValid :
                false;

    const isOtpValid = formData.otp;

    return (
        <div className={styles.page}>
            <div className={styles.title}>
                <img src="/uniCore.png" alt="logo" className={styles.logo} />
                <h1>uniCore</h1>
            </div>
            <h2 className={styles.h2}>Request for Account</h2>

            <form className={styles.loginForm}>
                <div className={styles.inputSection}>
                    <fieldset>
                        <legend>Personal Details</legend>

                        <input
                            type="text"
                            name="name"
                            placeholder="Name *"
                            onChange={handleChange}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email ID *"
                            onChange={handleChange}
                        />

                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option className={styles.option} value="">Select Role *</option>
                            <option className={styles.option} value="student">Student</option>
                            <option className={styles.option} value="teacher">Teacher</option>
                        </select>
                    </fieldset>

                    {role === "student" && (
                        <fieldset>
                            <legend>College details</legend>

                            <input
                                type="text"
                                name="collegeName"
                                placeholder="College name *"
                                onChange={handleChange}
                            />

                            <select name="department" onChange={handleChange}>
                                <option className={styles.option} value="">Select Department *</option>
                                <option className={styles.option} value="IT">IT</option>
                                <option className={styles.option} value="CS">CS</option>
                                <option className={styles.option} value="ME">ME</option>
                                <option className={styles.option} value="CE">CE</option>
                                <option className={styles.option} value="ECE">ECE</option>
                                <option className={styles.option} value="EE">EE</option>
                            </select>

                            <select name="year" onChange={handleChange}>
                                <option className={styles.option} value="">Year *</option>
                                <option className={styles.option} value="1">First Year</option>
                                <option className={styles.option} value="2">Second Year</option>
                                <option className={styles.option} value="3">Third Year</option>
                                <option className={styles.option} value="4">Fourth Year</option>
                            </select>

                            <input
                                type="text"
                                name="rollNumber"
                                placeholder="Roll Number *"
                                onChange={handleChange}
                            />
                        </fieldset>
                    )}

                    {role === "teacher" && (
                        <fieldset>
                            <legend>College details</legend>

                            <input
                                type="text"
                                name="collegeName"
                                placeholder="College name *"
                                onChange={handleChange}
                            />

                            <select name="department" onChange={handleChange}>
                                <option className={styles.option} value="">Select Department *</option>
                                <option className={styles.option} value="IT">IT</option>
                                <option className={styles.option} value="CS">CS</option>
                                <option className={styles.option} value="ME">ME</option>
                                <option className={styles.option} value="CE">CE</option>
                                <option className={styles.option} value="ECE">ECE</option>
                                <option className={styles.option} value="EE">EE</option>
                            </select>

                            <input
                                type="text"
                                name="employeeID"
                                placeholder="Employee ID *"
                                onChange={handleChange}
                            />
                        </fieldset>
                    )}

                    <div className={styles.LoginBtn}>
                        <button
                            type="button"
                            className={styles.registerButton}
                            disabled={!isFormValid}
                            onClick={() => {
                                alert("OTP sent");
                                setDigit(true);
                            }}
                        >
                            Send OTP
                        </button>

                        {digit && (
                            <>
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter OTP *"
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    className={styles.verifyButton}
                                    disabled={!isOtpValid}
                                    onClick={() => alert("login successful")}
                                >
                                    Verify
                                </button>
                            </>
                        )}
                    </div>

                    <div className={styles.linkToOtherPages}>
                        <p className={styles.loginLink}>
                            Have an account?{" "}
                            <Link to="/login" className={styles.registerLink}>
                                back to login page
                            </Link>
                        </p>

                        <div className={styles.bottomLink}>
                            <Link to="/" className={styles.returnHome}>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    );
}

export default Register;