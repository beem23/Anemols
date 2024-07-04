import React, {useState} from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setMessage('');
        } else {
            setFile(null);
            setMessage('Please select an image file');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select an image file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://10.0.10.225:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(`Prediction: ${response.data.prediction}, ${response.data.message}`);
        } catch (error) {
            setMessage('Error uploading file');
            console.error('Upload error:', error);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
}

export default FileUpload;