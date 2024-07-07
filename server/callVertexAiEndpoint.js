const axios = require('axios');

const callVertexAiEndpoint = async (imagePath) => {
    try {
        console.log('Calling Python server for inference...');
        const response = await axios.post('http://localhost:5003/infer', {
            image_path: imagePath
        });
        console.log('Received response from Python server:', response.data);
        return {
            message: 'Inference completed',
            data: response.data
        };
    } catch (error) {
        console.error('Error calling Python server:', error.message);
        return {
            message: 'Error calling Python server',
            error: error.message
        };
    }
};

module.exports = callVertexAiEndpoint;
