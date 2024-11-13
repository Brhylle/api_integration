import React, { useState } from "react";
import { Upload, Camera, Trash2, Archive } from "lucide-react";

const FishFreshnessDetector = () => {
  const [response, setResponse] = useState("");
  const [singleImage, setSingleImage] = useState(null);
  const [batchImages, setBatchImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCapture = () => {
    // Implement camera capture functionality
    console.log("Capture image");
  };

  const handleSingleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSingleImage(file);
    }
  };

  const handleBatchImagesUpload = (event) => {
    const files = Array.from(event.target.files);
    setBatchImages(files);
  };

  const uploadSingleImage = async () => {
    if (!singleImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", singleImage);

    try {
      const response = await fetch("https://detect.roboflow.com/fish-freshness-6-sb0n6/2", {
        method: "POST",
        headers: {
          Authorization: "Bearer KLuysgojSyV9rMNLr20y"
        },
        body: formData
      });

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFiles = () => {
    setSingleImage(null);
    setBatchImages([]);
    setResponse("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fish Freshness Detector</h1>
          <p className="text-gray-600">Upload images to detect fish freshness</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Capture Button */}
          <button
            onClick={handleCapture}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Camera size={20} />
            <span>Capture Image</span>
          </button>

          {/* Single Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Upload size={16} />
              <span>Single Image Upload</span>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                onChange={handleSingleImageUpload}
                accept="image/*"
                className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 text-sm text-gray-600"
              />
              <button
                onClick={uploadSingleImage}
                disabled={!singleImage || loading}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processing..." : "Upload"}
              </button>
            </div>
            {singleImage && (
              <p className="text-sm text-gray-600">
                Selected: {singleImage.name}
              </p>
            )}
          </div>

          {/* Batch Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Archive size={16} />
              <span>Batch Upload</span>
            </div>
            <input
              type="file"
              onChange={handleBatchImagesUpload}
              accept="image/*"
              multiple
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 text-sm text-gray-600"
            />
            {batchImages.length > 0 && (
              <p className="text-sm text-gray-600">
                Selected: {batchImages.length} files
              </p>
            )}
          </div>

          {/* Clear Button */}
          <button
            onClick={clearFiles}
            className="flex items-center gap-2 py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            <span>Clear Files</span>
          </button>

          {/* Response Display */}
          {response && (
            <div className="mt-6 space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Response</h2>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm text-gray-800">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FishFreshnessDetector;