import React from "react";
import style from "./about.module.css";

function About(){
  return (
    <div className={style.aboutcontainer}>

      {/* HERO SECTION */}
      <div className={style.abouthero}>
        <div className={style.abouttext}>
          <h1>About Unicore</h1>
          <p className={style.tagline}>
            Your Campus. Your Resources. One Core.
          </p>

          <p>
            Unicore is a smart student platform designed to make academic life 
            simple and organized. It allows students to upload and download 
            notes, assignments, previous year papers, and track attendance 
            — all in one place.
          </p>

          <p>
            No more searching in groups or losing important files. Everything 
            you need is just one click away.
          </p>


        </div>

        <div className={style.aboutimage}>
          <img 
            src="/aboutpage.jpeg"
            alt="about" 
          />
        </div>
      </div>

      {/* FEATURES */}
      <h2 className={style.sectiontitle}>Everything You Need</h2>

      <div className={style.features}>
        <div className={style.card1}>
          <h3>📅 Attendance</h3>
          <p>Track your daily attendance easily.</p>
        </div>

        <div className={style.card2}>
          <h3>📘 Teacher Notes</h3>
          <p>Access and download notes anytime.</p>
        </div>

        <div className={style.card3}>
          <h3>📝 Assignments</h3>
          <p>Upload and manage assignments efficiently.</p>
        </div>

        <div className={style.card4}>
          <h3>📄 PYQ Papers</h3>
          <p>Prepare better with previous year questions.</p>
        </div>
      </div>

      {/* WHY SECTION */}
      <div className={style.why}>
        <div className={style.whytext}>
          <h2>Why Unicore?</h2>
          <ul>
            <li>✔ Simple & Easy to Use</li>
            <li>✔ Upload & Download Anytime</li>
            <li>✔ Stay Organized</li>
            <li>✔ Focus on Learning</li>
          </ul>
        </div>

        <div className={style.mission}>
          <h3>🎯 Our Mission</h3>
          <p>
            To create a connected learning platform that empowers students 
            and makes academic life easier, smarter, and better.
          </p>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className={style.cta}>
        <h2>Unicore  Learn. Access. Succeed.</h2>
        <button>Get Started</button>
      </div>

    </div>
  );
};

export default About;