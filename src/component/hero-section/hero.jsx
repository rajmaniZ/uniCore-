import { Link } from 'react-router-dom';
import styles from './hero.module.css';

function Hero() {
    return (
        <div className={styles.HeroSection}>
            <div className={styles.overlay}></div>

            <div className={styles.heroContent}>
                <h1><strong>uniCore</strong></h1>
                <h2>All-in-one Smart Campus Solution</h2>
                <hr className={styles.hrFaded} />
                <p>Simplify. Connect. Learn.</p>

                <div className={styles.btnGroup}>
                    <Link to='/login' className={styles.login}>Login</Link>
                    <Link to='/register' className={styles.register}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default Hero;