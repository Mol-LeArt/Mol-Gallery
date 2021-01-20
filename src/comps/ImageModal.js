import React from 'react'
import './Modal.css'

const ImageModal = ({ selectedImg, setSelectedImg }) => {
    const handleClick =(e) => {
        // classList is used to identify className
        if (e.target.classList.contains("backdrop")) {
            setSelectedImg(null);
        }
    }

    return (
        <div className="backdrop" onClick={handleClick}>
            <img className="enlarged-img" src={selectedImg} alt="enlarged pic"/>
        </div>
    )
}

export default ImageModal;
