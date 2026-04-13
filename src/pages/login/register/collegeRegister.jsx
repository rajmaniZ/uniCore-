
import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './collegeRegister.module.css';

function Login() {
    const [digit, setDigit] = useState(false);

    const [formData, setFormData] = useState({
        collegeName: "",
        collegeCode: "",
        collegeEmail: "",
        adminName: "",
        adminEmail: "",
        collegeOtp: "",
        adminOtp: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const isFormValid =
        formData.collegeName &&
        formData.collegeCode &&
        formData.collegeEmail &&
        formData.adminName &&
        formData.adminEmail;

    const isOtpValid =
        formData.collegeOtp &&
        formData.adminOtp;

    return (
        <form className={styles.registerForm}>
            <div className={styles.title}>
                <img src="/uniCore.png" alt="logo" className={styles.logo} />
                <h1>UniCore</h1>
            </div>
                {/* <h2 className={styles.h2}>Sign Up</h2> */}

            <div className={styles.inputSection}>
                <fieldset>
                    <legend>College details</legend>

                    <input
                        required
                        type="text"
                        name="collegeName"
                        placeholder="College name *"
                        onChange={handleChange}
                    />

                    <input
                        required
                        type="text"
                        name="collegeCode"
                        placeholder="College code *"
                        onChange={handleChange}
                    />

                    <input
                        required
                        type="email"
                        name="collegeEmail"
                        placeholder="College Email ID *"
                        onChange={handleChange}
                    />
                </fieldset>

                <fieldset>
                    <legend>Admin Details</legend>

                    <input
                        required
                        type="text"
                        name="adminName"
                        placeholder="Admin name *"
                        onChange={handleChange}
                    />

                    <input
                        required
                        type="email"
                        name="adminEmail"
                        placeholder="Admin Email ID *"
                        onChange={handleChange}
                    />
                </fieldset>

                <div>
                    <button
                        className={styles.registerButton}
                        type="button"
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
                                required
                                type="text"
                                name="collegeOtp"
                                placeholder="Enter College Email OTP *"
                                onChange={handleChange}
                            />

                            <input
                                required
                                type="text"
                                name="adminOtp"
                                placeholder="Enter Admin Email OTP *"
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

                <div>
                    <p className={styles.loginLink}>
                        Already registered{" "}
                        <Link to='/login' className={styles.registerLink}>
                            back to login page
                        </Link>
                    </p>

                    <div className={styles.bottomLink}>
                        <Link to="/RequestForAccount" className={styles.loginLink}>
                            Request as Student/Teacher to create account
                        </Link>
                        <Link to="/" className={styles.returnHome}>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Login;