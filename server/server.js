const express = require('express');
const multer = require('multer');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');


const app = express();
const port = 3001;
const upload = multer({ dest: 'uploads/' });

let model;

// Load the model
async function loadModel() {
    try {
      const modelPath = 'file://C:/Users/bello/Documents/Anemols/server/model/model-6233202886117949440/tf-js/modelfiles/model.json';
      console.log("Loading model from:", modelPath);
      model = await tf.loadLayersModel(modelPath); // Ensure this path is correct
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }

loadModel();

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);

    const predictions = model.predict(imageTensor.expandDims(0));
    const predictedIndex = predictions.argMax(-1).dataSync()[0];

    res.json({ prediction: predictedIndex });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image');
  } finally {
    fs.unlinkSync(imagePath); // Clean up the uploaded file
  }
});


app.listen(port, () => { console.log(`Server started on port ${port}`) })