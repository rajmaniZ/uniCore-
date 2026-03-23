import styles from './features.module.css';

const featuresData = [
    {
        title: "AI Chatbot",
        desc: "Smart assistant for students & faculty",
        img: "/src/assets/chatWithAI.png"
    },
    {
        title: "Smart Attendance",
        desc: "Mark the Attandance and generate Report",
        img: "/src/assets/attendanceIcon.png"
    },
    {
        title: "Dashboad",
        desc: "Persnolizedd dashboard with States and Graphs",
        img: "/src/assets/dashboard-svg-icon-free-dashboard-icon-11553444664o1utwdkesz.png"
    },
    {
        title: "Live chat",
        desc: "Live chat Rooms to connecting students and teachers",
        img: "/src/assets/Screenshot 2026-03-23 064621.png"
    }
];

function Features() {
    return (
        <section className={styles.featuresSection}>
            <h2 className={styles.heading}>Core Features</h2>

            <div className={styles.grid}>
                {featuresData.map((feature, index) => (
                    <div key={index} className={styles.card}>
                        <img src={feature.img} alt={feature.title} />
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Features;