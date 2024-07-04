const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const axios = require('axios');
const callVertexAiEndpoint = require('./callVertexAiEndpoint');



const app = express();
const port = 3001;

app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }

    // Example: Simulate prediction logic
    // Replace this with your actual prediction logic or service call
    // const prediction = simulatePrediction(req.file);
    // const prediction = 'WTF IS THAT??!';
    const prediction = callVertexAiEndpoint(req.file);
    

  res.send({ message: 'File uploaded successfully.', prediction });
});

// Simulate a prediction function (for example purposes)
const simulatePrediction = (file) => {
  // Logic to process the file and return a prediction
  // Replace with actual logic or service call
  return 'Cat'; // Example prediction
};

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
