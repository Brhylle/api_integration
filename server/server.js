const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const NodeWebcam = require("node-webcam");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log("Client connected");

  socket.on("captureSingleImage", () => {
    captureAndSendSingleImage(socket);
  });

  socket.on("uploadSingleImage", base64Image => {
    sendSingleImage(base64Image, socket);
  });

  socket.on("uploadBatchImages", imagesArray => {
    sendBatchImages(imagesArray, socket);
  });
});

// Capture function triggered only by the frontend request
function captureAndSendSingleImage(socket) {
  const webcam = NodeWebcam.create();
  webcam.capture("captured_image", (err, data) => {
    if (err) {
      socket.emit("error", `Error capturing image: ${err}`);
      return;
    }
    const image = fs.readFileSync("captured_image.jpg", { encoding: "base64" });
    runInference(image, socket);
  });
}

// Helper function to run inference on a single image
function runInference(image, socket) {
  axios({
    method: "POST",
    url: "https://detect.roboflow.com/fish-freshness-6-sb0n6/2",
    params: { api_key: "KLuysgojSyV9rMNLr20y" },
    data: image,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
  .then(response => socket.emit("response", response.data))
  .catch(error => socket.emit("error", error.message));
}

// Send single base64 image for inference
function sendSingleImage(base64Image, socket) {
  runInference(base64Image, socket);
}

// Send batch of base64 images for inference
function sendBatchImages(imagesArray, socket) {
  imagesArray.forEach((image, index) => {
    runInference(image, socket);
  });
}

const PORT = 3007;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});