import React, { useState } from "react";
import axios from "axios";

function Prediction2() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [threshold, setThreshold] = useState(0.5);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setPrediction(null);
    setError("");
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("threshold", threshold);

    try {
      // 1. Predict using Flask (PyTorch)
      const response = await axios.post("http://localhost:8000/predict2", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.prediction_score !== undefined) {
        setPrediction(response.data);

        // 2. Convert image to base64
        const base64Image = await toBase64(selectedFile);

        // 3. Save to MongoDB via Node.js
        const saveRes = await axios.post("http://localhost:3001/api/database2", {
          label: response.data.classification,
          img: base64Image,
        });

        console.log("MongoDB Save Response:", saveRes.data);
      } else {
        alert("Prediction failed. Backend did not return a valid response.");
      }
    } catch (error) {
      console.error("Error during prediction or save:", error);
      setError("An error occurred while processing the image.");
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>ISIC Model Classification</h1>
      <p>Upload an image for classification using the PyTorch model.</p>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Uploaded"
          style={{ marginTop: "20px", width: "300px" }}
        />
      )}
      <br />

      <label htmlFor="threshold">Classification Threshold: {threshold}</label>
      <input
        id="threshold"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={threshold}
        onChange={(e) => setThreshold(parseFloat(e.target.value))}
      />
      <br />

      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Predict
      </button>

      {prediction && (
        <div style={{ marginTop: "20px" }}>
          <h2>Prediction Score: {prediction.prediction_score.toFixed(6)}</h2>
          <h3
            style={{
              color: prediction.classification === "Malignant" ? "red" : "green",
            }}
          >
            Prediction: {prediction.classification}
          </h3>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Prediction2;
