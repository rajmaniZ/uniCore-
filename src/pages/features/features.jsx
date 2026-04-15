import styles from './features.module.css';
import {Link} from "react-router-dom";
const featuresData = [
    {
        title: "AI Chatbot",
        desc: "Smart assistant for students & faculty",
        img: "/src/assets/chatWithAI.png",
        about: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias corrupti dolorem deleniti natus quos. Sapiente soluta, temporibus reiciendis ab facere ea repellendus nesciunt praesentium ipsum repudiandae adipisci unde atque aliquid.",
        guide: {
            step1:"step1 ",
            step2:"step2",
            step3:"step3 ",
            step4:"step3",
            step5:"step4 ",
            step6:"step5",
            step7:"",
            step8:"",
        },
        path:"/AboutFeature"
    },
    {
        title: "Smart Attendance",
        desc: "Mark the Attandance and generate Report",
        img: "/src/assets/attendanceIcon.png",
        about: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias corrupti dolorem deleniti natus quos. Sapiente soluta, temporibus reiciendis ab facere ea repellendus nesciunt praesentium ipsum repudiandae adipisci unde atque aliquid.",
        guide: {
            step1:"step1 ",
            step2:"step2",
            step3:"step3 ",
            step4:"step3",
            step5:"step4 ",
            step6:"step5",
            step7:"",
            step8:"",
        },
        path:"/AboutFeature"
    },
    {
        title: "Dashboad",
        desc: "Persnolizedd dashboard with States and Graphs",
        img: "/src/assets/dashboard-svg-icon-free-dashboard-icon-11553444664o1utwdkesz.png",
        about: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias corrupti dolorem deleniti natus quos. Sapiente soluta, temporibus reiciendis ab facere ea repellendus nesciunt praesentium ipsum repudiandae adipisci unde atque aliquid.",
        guide: {
            step1:"step1 ",
            step2:"step2",
            step3:"step3 ",
            step4:"step3",
            step5:"step4 ",
            step6:"step5",
            step7:"",
            step8:"",
        },
        path:"/AboutFeature"
    },
    {
        title: "Live chat",
        desc: "Live chat Rooms to connecting students and teachers",
        img: "/src/assets/Screenshot 2026-03-23 064621.png",
        about: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias corrupti dolorem deleniti natus quos. Sapiente soluta, temporibus reiciendis ab facere ea repellendus nesciunt praesentium ipsum repudiandae adipisci unde atque aliquid.",
        guide: {
            step1:"step1 ",
            step2:"step2",
            step3:"step3 ",
            step4:"step3",
            step5:"step4 ",
            step6:"step5",
            step7:"",
            step8:"",
        },
        path:"/AboutFeature"
    }
];

function Features() {
    return (
        <section className={styles.featuresSection}>
            <h2 className={styles.heading}>Core Features</h2>

            <div className={styles.grid}>
                {featuresData.map((feature, index) => (
                    <Link to={feature.path}
                    state={{feature:feature}} 
                    key={index}
                    >
                    <div key={index} className={styles.card}>
                        
                        <img src={feature.img} alt={feature.title} />
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default Features;