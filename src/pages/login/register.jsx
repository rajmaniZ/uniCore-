import styles from './register.module.css';


function Register(){
    return (
        <>
            <div className={styles.page}>
                <h1>register</h1>
                <div className={styles.registrationForm}>
                    <input type="text" placeholder="enter the name" />
                    {/* <button onClick={alert("registration Success")}>click me</button> */}
                </div>
            </div>
        </>
    );
}
export default Register;