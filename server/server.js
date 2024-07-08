const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');  // Add this line to import the fs module
const FormData = require('form-data');  // Add this line to import the FormData module

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
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }

  try {
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const response = await axios.post('http://10.0.10.230:5003/infer', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.send({ message: 'File uploaded successfully.', prediction: response.data });
  } catch (error) {
    console.error('Error calling Python server:', error);
    res.status(500).json({
      message: 'Error calling Python server',
      error: error.message,
    });
  }
  // } finally {
  //   // Clean up the uploaded file from the Node.js server
  //   fs.unlink(req.file.path, (err) => {
  //     if (err) {
  //       console.error('Failed to delete uploaded file:', err);
  //     }
  //   });
  // }
});

app.listen(port, () => {
  console.log(`Server running on http://10.0.10.230:${port}`);
});
