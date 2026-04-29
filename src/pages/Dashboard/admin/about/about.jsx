import { useEffect, useState } from "react";
import styles from "./about.module.css";

import { getInstituteConfig } from "../../../../api/configApi";
import { getMyInstitute } from "../../../../api/instituteApi";

function About({ data: providedData = null }) {
  const [institute, setInstitute] = useState(providedData || null);
  const [config, setConfig] = useState(providedData?.config || null);
  const [loading, setLoading] = useState(!providedData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (providedData) {
      setInstitute(providedData);
      setConfig(providedData.config || null);
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [inst, configData] = await Promise.all([
          getMyInstitute(),
          getInstituteConfig(),
        ]);

        setInstitute(inst);
        setConfig(configData);
      } catch (err) {
        console.error("ABOUT FETCH ERROR:", err.response?.data || err);
        setError(err?.response?.data?.msg || "Failed to load institute data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [providedData]);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading institute info...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrap}>
        <span className={styles.errorIcon}>!</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!institute) return null;

  const { name, address, logo, buildingImage, type } = institute;

  return (
    <div className={styles.container}>
      <div
        className={styles.hero}
        style={{ backgroundImage: buildingImage ? `url(${buildingImage})` : "none" }}
      >
        <div className={styles.overlay}>
          {logo && <img src={logo} alt="logo" className={styles.logo} />}
          <h1>{name}</h1>
          {address && <p>{address}</p>}
          <span className={styles.typeBadge}>
            {type === "college" ? "College" : "School"}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.heading}>Academic Structure</h2>

        {type === "college" &&
          (config?.departments || []).map((departmentEntry) => (
            <div key={departmentEntry.department?._id} className={styles.card}>
              <h3>{departmentEntry.department?.name}</h3>

              {(departmentEntry.courses || []).map((courseEntry) => (
                <div key={courseEntry.course?._id} className={styles.course}>
                  <h4>{courseEntry.course?.name}</h4>

                  <div className={styles.semGrid}>
                    {(courseEntry.structure || []).map((structureEntry) => (
                      <div key={structureEntry.number} className={styles.semCard}>
                        <h5>
                          {(courseEntry.systemType || "semester") === "annual"
                            ? `Year ${structureEntry.number}`
                            : `Semester ${structureEntry.number}`}
                        </h5>
                        <p>
                          {(structureEntry.subjects || [])
                            .map((subjectEntry) => subjectEntry.subject?.name)
                            .filter(Boolean)
                            .join(", ") || "No subjects"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

        {type === "school" && (
          <div className={styles.card}>
            <h3>School Structure</h3>

            {(config?.classes || []).length === 0 ? (
              <p>No classes found</p>
            ) : (
              (config?.classes || []).map((classEntry) => (
                <div key={classEntry.class?._id} className={styles.course}>
                  <h4>{classEntry.class?.name}</h4>

                  {(classEntry.subjects || []).length > 0 && (
                    <div className={styles.semGrid}>
                      {classEntry.subjects.map((subjectEntry) => (
                        <div key={subjectEntry.subject?._id} className={styles.semCard}>
                          <h5>{subjectEntry.subject?.name}</h5>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default About;
