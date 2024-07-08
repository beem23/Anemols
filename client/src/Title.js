import React from 'react';

const Title = () => {
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

    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <h1
            style={isHovered ? { ...titleStyle, ...hoverStyle } : titleStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            Anemol Detector-inator!
        </h1>
    );
};

export default Title;
