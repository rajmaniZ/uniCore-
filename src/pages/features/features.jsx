import styles from './features.module.css';
import { Link } from "react-router-dom";

import chatAI from "./../../assets/chatWithAI.png";
import attendanceIcon from "./../../assets/attendanceIcon.jpg";
import dashboardImg from "./../../assets/dashboard-svg-icon-free-dashboard-icon-11553444664o1utwdkesz.png";
import liveChatImg from "./../../assets/Screenshot 2026-03-23 064621.png";

export const featuresData = [
    {
        id: "ai-chatbot",
        title: "AI Chatbot",
        desc: "Smart assistant for students & faculty",
        img: chatAI,
        about: "AI-powered chatbot to help students and faculty with queries, notes, and guidance.",
        guide: ["Open chatbot", "Ask query", "Get instant response"]
    },
    {
        id: "smart-attendance",
        title: "Smart Attendance",
        desc: "Mark attendance and generate reports",
        img: attendanceIcon,
        about: "Automated attendance system with analytics and reporting features.",
        guide: ["Login", "Mark attendance", "Generate report"]
    },
    {
        id: "dashboard",
        title: "Dashboard",
        desc: "Personalized dashboard with stats and graphs",
        img: dashboardImg,
        about: "Interactive dashboard showing performance, analytics, and activities.",
        guide: ["Login", "View stats", "Analyze data"]
    },
    {
        id: "live-chat",
        title: "Live Chat",
        desc: "Connect students and teachers in real-time",
        img: liveChatImg,
        about: "Real-time chat rooms for communication between students and faculty.",
        guide: ["Join room", "Send message", "Collaborate"]
    }
];

function Features() {
    return (
        <section className={styles.featuresSection}>
            <h2 className={styles.heading}>Core Features</h2>

            <div className={styles.grid}>
                {featuresData.map((feature) => (
                    <Link
                        to={`/features/${feature.id}`}   
                        key={feature.id}
                        className={styles.card}
                    >
                        <img src={feature.img} alt={feature.title} />
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default Features;