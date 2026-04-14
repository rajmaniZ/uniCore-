import styles from "./AboutInstitute.module.css";

function ImageUploader({ image, setImage, id, label }) {
  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className={styles.uploadBlock}>
      <p className={styles.uploadLabel}>{label}</p>

      <input
        type="file"
        accept="image/*"
        id={id}
        className={styles.hiddenInput}
        onChange={handleChange}
      />

      {!image ? (
        <label htmlFor={id} className={styles.uploadBox}>
          <span className={styles.uploadIcon}>⬆</span>
          <p>Upload</p>
        </label>
      ) : (
        <div className={styles.previewBox}>
          <img src={image} alt="preview" className={styles.previewImage} />

          <button
            type="button"
            className={styles.removeBtn}
            onClick={removeImage}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;