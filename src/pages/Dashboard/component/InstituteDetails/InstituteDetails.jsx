import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/dataContext";
import styles from "./InstituteDetails.module.css";

function InstituteDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { institutes, users } = useData();

  // 🔥 RBAC FILTER
  const filteredInstitutes =
    currentUser.role === "superadmin"
      ? institutes
      : institutes.filter((inst) => inst._id === currentUser.instituteId);

  const institute = filteredInstitutes.find((i) => i._id === id);

  if (!institute) return <div className={styles.empty}>Not Found</div>;

  return (
    <div className={styles.container}>
      
      {/* 🔥 HEADER */}
      <div className={styles.header}>
        <img src={institute.media.logo} className={styles.logo} />

        <div>
          <h1>{institute.name}</h1>
          <p className={styles.code}>{institute.code}</p>
        </div>
      </div>

      {/* 🔥 BUILDING IMAGE */}
      <div className={styles.banner}>
        <img src={institute.media.building} alt="building" />
      </div>

      {/* 🔥 ABOUT */}
      <div className={styles.card}>
        <h2>About</h2>
        <p>{institute.about}</p>
      </div>

      {/* 🔥 GALLERY */}
      {institute.media.gallery?.length > 0 && (
        <div className={styles.card}>
          <h2>Gallery</h2>
          <div className={styles.gallery}>
            {institute.media.gallery.map((img, i) => (
              <img key={i} src={img} />
            ))}
          </div>
        </div>
      )}

      {/* 🔥 STRUCTURE */}
      <div className={styles.card}>
        <h2>Structure</h2>

        {/* COLLEGE */}
        {institute.type === "college" &&
          Object.entries(institute.structure).map(([dept, data]) => (
            <div key={dept} className={styles.block}>
              <h3>{dept}</h3>

              <p className={styles.sub}>
                HOD:{" "}
                {
                  users.find((u) => u._id === data.hodId)?.name ||
                  "Not Assigned"
                }
              </p>

              {Object.entries(data.years || {}).map(([year, yData]) => (
                <div key={year} className={styles.innerBlock}>
                  <h4>Year {year}</h4>

                  {Object.entries(yData.semesters || {}).map(
                    ([sem, semData]) => (
                      <div key={sem} className={styles.sem}>
                        <span>Sem {sem}:</span>
                        <div className={styles.tags}>
                          {semData.subjects.map((sub) => (
                            <span key={sub}>{sub}</span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}

        {/* SCHOOL */}
        {institute.type === "school" &&
          Object.entries(institute.structure).map(([cls, data]) => (
            <div key={cls} className={styles.block}>
              <h3>Class {cls}</h3>

              <p className={styles.sub}>
                Sections: {data.sections.join(", ")}
              </p>

              {data.streams?.map((stream) => (
                <div key={stream} className={styles.innerBlock}>
                  <h4>{stream}</h4>

                  <div className={styles.tags}>
                    {data.subjects[stream].map((sub) => (
                      <span key={sub}>{sub}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default InstituteDetail;