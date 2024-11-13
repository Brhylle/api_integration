import React, { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3007");

function App() {
  const [response, setResponse] = useState("");
  const [singleImage, setSingleImage] = useState(null);
  const [batchImages, setBatchImages] = useState([]);

  const handleCapture = () => {
    socket.emit("captureSingleImage");
  };

  const handleSingleImageChange = (event) => {
    setSingleImage(event.target.files[0]);
  };

  const handleBatchImagesChange = (event) => {
    setBatchImages(Array.from(event.target.files));
  };

  const handleSingleUpload = () => {
    if (singleImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        socket.emit("uploadSingleImage", reader.result.split(",")[1]); // Only base64 data
      };
      reader.readAsDataURL(singleImage);
    }
  };

  const handleBatchUpload = () => {
    if (batchImages.length > 0) {
      const base64Images = [];
      batchImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          base64Images.push(reader.result.split(",")[1]); // Only base64 data
          if (base64Images.length === batchImages.length) {
            socket.emit("uploadBatchImages", base64Images);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const clearFiles = () => {
    setSingleImage(null);
    setBatchImages([]);
    setResponse("");
  };

  socket.on("response", (data) => {
    setResponse(JSON.stringify(data, null, 2));
  });

  socket.on("error", (errorMessage) => {
    setResponse(`Error: ${errorMessage}`);
  });

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Fish Freshness Detector</h1>

      {/* Capture Button */}
      <button onClick={handleCapture}>Capture Image</button>

      {/* Single Image Upload */}
      <div style={{ margin: "20px 0" }}>
        <input type="file" onChange={handleSingleImageChange} accept="image/*" />
        <button onClick={handleSingleUpload} disabled={!singleImage}>
          Upload Single Image
        </button>
      </div>

      {/* Batch Image Upload */}
      <div style={{ margin: "20px 0" }}>
        <input type="file" onChange={handleBatchImagesChange} accept="image/*" multiple />
        <button onClick={handleBatchUpload} disabled={batchImages.length === 0}>
          Upload Batch Images
        </button>
      </div>

      {/* Clear Button */}
      <div style={{ margin: "20px 0" }}>
        <button onClick={clearFiles}>Clear Uploaded Files</button>
      </div>

      {/* Response Display */}
      <h2>Response:</h2>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{response}</pre>
    </div>
  );
}

export default App;
