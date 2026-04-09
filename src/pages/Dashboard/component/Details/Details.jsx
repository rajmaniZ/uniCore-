import { useParams } from "react-router-dom";
import { useData } from "../../context/dataContext";
import styles from "./Details.module.css";

function DetailsPage() {
  const { id } = useParams();
  const { students, teachers, colleges } = useData();

  const allData = [...students, ...teachers, ...colleges];
  const item = allData.find((d) => d._id === id);

  if (!item) return <div className={styles.notFound}>Not Found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            {(item.name || item.collegeName)?.charAt(0)}
          </div>

          <div>
            <h1 className={styles.title}>
              {item.name || item.collegeName}
            </h1>
            <p className={styles.subtitle}>
              {item.email || item.code || "Details"}
            </p>
          </div>
        </div>

        {/* DATA GRID */}
        <div className={styles.grid}>
          {Object.entries(item).map(([key, value]) => (
            <div key={key} className={styles.field}>
              <span className={styles.label}>{key}</span>
              <span className={styles.value}>
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : value?.toString()}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default DetailsPage;