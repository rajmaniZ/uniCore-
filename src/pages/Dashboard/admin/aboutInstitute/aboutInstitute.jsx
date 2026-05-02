import { useState, useEffect } from "react";
import SchoolSetup from "./schoolSetup";
import CollegeSetup from "./collegeSetup";
import ImageUploader from "./ImageUploader";
import About from "./../about/about";
import Loader from "../../../../component/loader/loader";

import {
  getMyInstitute,
  setAboutInstitute,
} from "../../../../api/instituteApi";

import styles from "./AboutInstitute.module.css";

function AboutInstitute() {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  const [logo, setLogo] = useState(null);
  const [building, setBuilding] = useState(null);
  const [gallery, setGallery] = useState([]);

  const [config, setConfig] = useState({});

  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const d = await getMyInstitute();

        if (d) {
          setData(d);

          setName(d.name || "");
          setAbout(d.address || "");
          setType(d.type || "");
          setLogo(d.logo || null);
          setBuilding(d.buildingImage || null);
          setGallery(d.gallery || []);
          setConfig(d.config || {});
        }
      } catch (err) {
        console.log("No institute found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validate = () => {
    if (!name.trim()) return "Institute name required";
    if (!type) return "Select institute type";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    try {
      const res = await setAboutInstitute({
        name,
        about, 
        type,
        logo,
        buildingImage: building,
        gallery,
      });

      alert("Saved ✅");

      const updated = res;

      setData(updated);
      setEditMode(false);

      setName(updated.name || "");
      setAbout(updated.address || "");
      setType(updated.type || "");
      setLogo(updated.logo || null);
      setBuilding(updated.buildingImage || null);
      setGallery(updated.gallery || []);
      setConfig(updated.config || {});
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error saving institute");
    }
  };

  if (loading) {
    return <Loader/>;
  }

  if (data && !editMode) {
    return (
      <div>
        <About data={data} />

        <div className={styles.editBtnWrapper}>
          <button
            className={styles.primaryBtn}
            onClick={() => setEditMode(true)}
          >
            Edit Institute
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {data ? "Edit Institute" : "Setup Your Institute"}
      </h2>

      <input
        placeholder="Institute Name"
        className={styles.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        rows="6"
        placeholder="About your institute"
        className={styles.textarea}
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />

      {}
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

      {}
      {!type && (
        <div className={styles.selector}>
          <button onClick={() => setType("school")} className={styles.btn}>
            School
          </button>

          <button onClick={() => setType("college")} className={styles.btn}>
            College / University
          </button>
        </div>
      )}

      {}
      {type === "school" && (
        <SchoolSetup config={config} setConfig={setConfig} />
      )}

      {type === "college" && (
        <CollegeSetup config={config} setConfig={setConfig} />
      )}

      {}
      <button className={styles.primaryBtn} onClick={handleSubmit}>
        {data ? "Update Institute" : "Save Institute"}
      </button>
    </div>
  );
}

export default AboutInstitute;