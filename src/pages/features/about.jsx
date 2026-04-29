





    























































































import { useParams } from 'react-router-dom';
import styles from './about.module.css';
import { featuresData } from './Features'; 

function AboutFeature() {
    const { id } = useParams();

    
    const feature = featuresData.find(item => item.id === id);

    if (!feature) {
        return <h2>Feature not found</h2>;
    }

    return (
        <div className={styles.frame}>
            <h1 className={styles.title}>{feature.title}</h1>

            <div className={styles.info}>
                <img src={feature.img} alt={feature.title} />

                <div>
                    <h2>{feature.desc}</h2>

                    <h3>About</h3>
                    <p>{feature.about}</p>
                </div>
            </div>

            <div className={styles.guide}>
                <h3>Guide</h3>
                <p>Follow these steps:</p>

                <ol>
                    {feature.guide.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default AboutFeature;