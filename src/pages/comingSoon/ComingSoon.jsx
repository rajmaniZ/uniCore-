

import styles from './ComingSoon.module.css'

const ComingSoon=({pageName})=>{
    
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>{pageName}</h1>
            <p>we are working on it. Stay tuned!</p>
        </div>
    );
}

export default ComingSoon;