import { useState } from "react";
import SchoolSetup from "./schoolSetup";
import CollegeSetup from "./collegeSetup";
import ImageUploader from "./ImageUploader"; // ✅ IMPORTANT
import styles from "./AboutInstitute.module.css";

function AboutInstitute() {
  const [type, setType] = useState("");

  // 🔥 IMAGES
  const [logo, setLogo] = useState(null);
  const [building, setBuilding] = useState(null);
  const [gallery, setGallery] = useState([]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Setup Your Institute</h2>

      {/* 🔥 ABOUT TEXT */}
      <textarea
        rows="6"
        placeholder="About your institute"
        className={styles.textarea}
      />

      <div className={styles.imageUpload}>
        <ImageUploader
          image={logo}
          setImage={setLogo}
          id="logoUpload"
          label="Institute Logo"
        />

        <ImageUploader
          image={building}
          setImage={setBuilding}
          id="buildingUpload"
          label="Building Image"
        />
      </div>
      {/* 🔥 SELECT TYPE */}
      {!type && (
        <div className={styles.selector}>
          <button
            onClick={() => setType("school")}
            className={styles.btn}
          >
            School
          </button>

          <button
            onClick={() => setType("college")}
            className={styles.btn}
          >
            College / University
          </button>
        </div>
      )}

      {/* 🔥 DYNAMIC RENDER */}
      {type === "school" && <SchoolSetup />}
      {type === "college" && <CollegeSetup />}
    </div>
  );
}

export default AboutInstitute;