import React from "react";
import style from "./about.module.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className={style.aboutcontainer}>

      {}
      <div className={style.abouthero}>
        <div className={style.abouttext}>
          <h1>About Unicore</h1>

          <p className={style.tagline}>
            Your Campus. Your Resources. One Core.
          </p>

          <p className={style.para}>
            Unicore is a smart student platform designed to make academic life 
            simple and organized. It allows students to upload and download 
            notes, assignments, previous year papers, and track attendance — 
            all in one place.
          </p>

          <p className={style.para}>
            No more searching in groups or losing important files. Everything 
            you need is just one click away.
          </p>
        </div>
      </div>

      {}
      <h2 className={style.sectiontitle}>Everything You Need</h2>

      <div className={style.features}>
        <div className={style.card}>
          <h3>Attendance</h3>
          <p>Track your daily attendance easily.</p>
        </div>

        <div className={style.card}>
          <h3>Teacher Notes</h3>
          <p>Access and download notes anytime.</p>
        </div>

        <div className={style.card}>
          <h3>Assignments</h3>
          <p>Upload and manage assignments efficiently.</p>
        </div>

        <div className={style.card}>
          <h3>PYQ Papers</h3>
          <p>Prepare better with previous year questions.</p>
        </div>
      </div>

      {}
      <div className={style.why}>
        <div className={style.whytext}>
          <h2>Why Unicore?</h2>
          <ul>
            <li>Simple & Easy to Use</li>
            <li>Upload & Download Anytime</li>
            <li>Stay Organized</li>
            <li>Focus on Learning</li>
          </ul>
        </div>

        <div className={style.mission}>
          <h3>Our Mission</h3>
          <p>
            To create a connected learning platform that empowers students 
            and makes academic life easier, smarter, and better.
          </p>
        </div>
      </div>

      {}
      <div className={style.cta}>
        <h2>Unicore — Simplify. Connect. Learn.</h2>
        <Link to="/login" className={style.ctabutton} >Get Started</Link>
      </div>

    </div>
  );
}

export default About;