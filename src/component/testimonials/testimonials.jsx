import style from './testimonials.module.css';

import { FaUserCircle } from "react-icons/fa";

export default function Testimonials() {

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Student",
      message: "UniCore made managing assignments and attendance super easy. Everything is in one place!"
    },
    {
      name: "Priya Verma",
      role: "Teacher",
      message: "The real-time chat and assignment system saves a lot of time. Very efficient platform."
    },
    {
      name: "Amit Singh",
      role: "HOD",
      message: "Managing students and monitoring performance has never been this smooth."
    },
    {
      name: "Sneha Gupta",
      role: "Student",
      message: "Notifications and schedule updates help me stay on track every day."
    }
  ];

  return (
    <section className={style.featuresSection}>
      <h2 className={style.heading}>What People Say</h2>

      <div className={style.grid}>
        {testimonials.map((item, index) => (
          <div key={index} className={style.card}>
            <div className={style.profile}>
            <FaUserCircle className="text-4xl text-blue-600 mx-auto mb-3" />
            
            <h3>{item.name}</h3>
            <p >{item.role}</p>
            </div>
            <p>
              “{item.message}”
            </p>

          </div>
        ))}
      </div>
    </section>
  );
}