import React, { useState, useRef } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileClick = () => {
        setLoading(true); // Start loading immediately when the file input is clicked
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setMessage('');
        } else {
            setFile(null);
            setMessage('Please select an image file');
        }
        setLoading(false); // End loading after validation
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select an image file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setLoading(true); // Start loading

        try {
            const response = await axios.post('http://10.0.10.225:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setPrediction(response.data.prediction);
            setMessage('File uploaded successfully');
        } catch (error) {
            setMessage('Error uploading file');
            console.error('Upload error:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const titleStyle = {
        fontFamily: '"Comic Neue", cursive, sans-serif',
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#ffeb3b',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        margin: '20px 0',
        padding: '10px 20px',
        backgroundColor: 'rgba(0, 188, 212, 0.7)',
        borderRadius: '10px',
        transition: 'transform 0.3s, color 0.3s',
        cursor: 'pointer',
    };

    const hoverStyle = {
        transform: 'scale(1.05)',
        color: '#ff4081',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background:'linear-gradient(135deg, #89fffd, #ef32d9)', // Change background color based on loading state
        fontFamily: '"Comic Neue", cursive, sans-serif',
        color: '#fff',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box'
    };

    const inputStyle = {
        display: 'none'
    };

    const customButtonStyle = {
        padding: '10px 20px',
        margin: '10px 0',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#00bcd4',
        color: '#fff',
        fontSize: '1.2rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    };

    const buttonHoverStyle = {
        backgroundColor: '#008ba3'
    };

    const messageStyle = {
        margin: '20px 0',
        fontSize: '1.2rem',
        color: '#ffeb3b',
    };

    const predictionContainerStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '20px',
        borderRadius: '10px',
        width: '80%',
        maxWidth: '600px',
        margin: '20px 0',
    };

    const listContainerStyle = {
        maxHeight: '300px',
        overflowY: 'auto',
        textAlign: 'left',
        marginTop: '10px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
    };

    const listItemStyle = {
        margin: '5px 0',
    };

    const fileNameStyle = {
        marginTop: '10px',
        fontSize: '1rem',
        color: '#ffeb3b',
    };

    const boldTextStyle = {
        fontWeight: 'bold'
    };

    const capitalizeTextStyle = {
        textTransform: 'uppercase'
    };

    const [chooseButtonStyle, setChooseButtonStyle] = useState(customButtonStyle);
    const [uploadButtonStyle, setUploadButtonStyle] = useState(customButtonStyle);
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div style={{...containerStyle, minHeight: 'fit-content'}}>
            <h1
                style={isHovered ? { ...titleStyle, ...hoverStyle } : titleStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                Anemol Detector-inator!
            </h1>
            <input 
                type="file" 
                accept="image/*" 
                onClick={handleFileClick} // Handle file input click event
                onChange={handleFileChange} 
                style={inputStyle} 
                ref={fileInputRef}
            />
            <button 
                onClick={() => fileInputRef.current.click()}
                style={chooseButtonStyle}
                onMouseEnter={() => setChooseButtonStyle({ ...customButtonStyle, ...buttonHoverStyle })}
                onMouseLeave={() => setChooseButtonStyle(customButtonStyle)}
            >
                Choose File
            </button>
            {loading && <p style={messageStyle}>Processing file...</p>} {/* Loading message */}
            {file && !loading && <img src={URL.createObjectURL(file)} alt="Selected" style={{ maxWidth: '100px', borderRadius: '10px' }} />}
            {file && !loading && <p style={fileNameStyle}>{file.name}</p>}
            <button 
                onClick={handleUpload}
                style={uploadButtonStyle}
                onMouseEnter={() => setUploadButtonStyle({ ...customButtonStyle, ...buttonHoverStyle })}
                onMouseLeave={() => setUploadButtonStyle(customButtonStyle)}
            >
                Upload
            </button>
            <p style={messageStyle}>{message}</p>
            {prediction && (
                <div style={predictionContainerStyle}>
                    <h3>Prediction Details</h3>
                    <p>Predicted Species: <span style={{ ...boldTextStyle, ...capitalizeTextStyle }}>{prediction.predicted_species}</span></p>
                    <p>Confidence Score: <span style={boldTextStyle}>{prediction.confidence_score}</span></p>
                    <h4>Detailed Output:</h4>
                    <div style={listContainerStyle}>
                        <ul style={{ paddingLeft: '20px' }}>
                            {prediction.detailed_output.map((item, index) => (
                                <li key={index} style={listItemStyle}>
                                    <span style={{ ...boldTextStyle, ...capitalizeTextStyle }}>{item.species}</span>, Confidence Score: <span style={boldTextStyle}>{item.confidence_score}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
