
import { useState } from "react";
import styles from "./AboutInstitute.module.css";
import { uploadImageFile } from "../../../../api/uploadApi";

function ImageUploader({ image, setImage, id, label }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    try {
      setLoading(true);

      const preview = URL.createObjectURL(file);
      setImage(preview);

      const uploaded = await uploadImageFile(file);
      setImage(uploaded.url);

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err.message);

      alert(err.response?.data?.msg || "Image upload failed");
      setImage(null);
    } finally {
      setLoading(false);
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
          <p>{loading ? "Uploading..." : "Upload"}</p>
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
