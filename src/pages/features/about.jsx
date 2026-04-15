import {useLocation} from 'react-router-dom';
import styles from './about.module.css';

function AboutFeature(){
    const location=useLocation();
    const feature=location.state?.feature;
    
    if(!feature){
        return <h2> no data found</h2>;

    }
    return (
        <>
        <div className={styles.frame}>
            <h1 className={styles.title}>
                {feature.title}
            </h1>
            <div className={styles.info}>
            <img 
            src={feature.img}
            alt={feature.title}
            />
            <div>
            <h2>{feature.desc}</h2>

            <h3>About</h3>
            <p>{feature.about}</p>
            </div>
            </div>
 <div className={styles.guide}>
                <h3 >Guide</h3>
            <p>
                follow this several steps:
            </p>
            <ol start={1} type={Number}>
                {Object.values(feature.guide).map((step,i)=>(
                    step&& <li key={i}>{step}</li>
                ))}
            </ol>
</div>
        </div>
        </>
    );


}

export default AboutFeature;