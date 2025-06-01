import React, { useState } from "react";

function Prediction() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [error, setError] = useState("");
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [classificationCorrect, setClassificationCorrect] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPrediction("");
    setConfidence("");
    setError("");
    setFeedbackShown(false);
    setClassificationCorrect(null);

    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
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
      setError("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // 🔍 Predict using Flask
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error || "Prediction failed.");
        return;
      }

      const result = await response.json();
      console.log("Prediction result:", result.prediction, result.confidence);

      setPrediction(result.prediction);
      setConfidence(result.confidence);
      setFeedbackShown(true);

      // 🧠 Convert image to base64
      const base64Image = await toBase64(selectedFile);

      // 🧾 Save to MongoDB via Node.js
      const saveRes = await fetch("http://localhost:3001/api/database1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: result.prediction,
          img: base64Image,
        }),
      });

      const saveResult = await saveRes.json();
      console.log("MongoDB Save Response:", saveResult);
    } catch (err) {
      console.error("Error during prediction or save:", err);
      setError("An error occurred during prediction or saving to database.");
    }
  };

  const handleFeedback = (response) => {
    setClassificationCorrect(response);
    if (!response) {
      window.location.href = "/form";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload an Image for Prediction</h2>
      <input type="file" onChange={handleFileChange} />
      {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt="Uploaded"
          style={{ maxWidth: "300px", marginTop: "20px" }}
        />
      )}
      <br />
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Predict
      </button>

      {prediction && <h3>Prediction: {prediction}</h3>}
      {confidence && <h4>Confidence: {parseFloat(confidence).toFixed(2)}%</h4>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {feedbackShown && classificationCorrect === null && (
        <div>
          <h4>Was this classification correct?</h4>
          <button onClick={() => handleFeedback(true)}>Yes</button>
          <button onClick={() => handleFeedback(false)}>No</button>
        </div>
      )}

      {classificationCorrect === true && <p>Thank you for your feedback!</p>}
    </div>
  );
}

export default Prediction;
