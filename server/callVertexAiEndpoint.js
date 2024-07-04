const axios = require('axios');
const fs = require('fs'); // If you need to read the input data from a file
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

const projectId = process.env.PROJECT_ID;
const endpointId = process.env.ENDPOINT_ID;
// const accessToken = process.env.ACCESS_TOKEN;

// Function to get Google Cloud access token
const getAccessToken = async () => {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken;
  };

const callVertexAiEndpoint = async (inputData) => {
  try {
const accessToken = await getAccessToken();

    const response = await axios.post(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/endpoints/${endpointId}:predict`,
      inputData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Prediction response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling Vertex AI endpoint:', error);
    throw error;
  }
};

module.exports = callVertexAiEndpoint;