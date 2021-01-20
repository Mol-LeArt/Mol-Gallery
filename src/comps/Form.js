import React, { useState } from 'react';
import './Form.css';
import ImageUpload from './ImageUpload';

const Form = ({ toggleUploadStatus, uploadImgStatus, setUploadFile }) => {
    const [img, setImg] = useState(null);

    const getFileForUpload = (file) => {
        console.log("child data - " + file);
        setImg(file);
    }

    const handleClick = (e) => {
        console.log("upload image");
        e.preventDefault();
        console.log(img);
        
        // Upload image in Portfolio.js
        if (img) {
            setUploadFile(img);
            
            // Dismiss form modal
            toggleUploadStatus(false);
        } else {
            alert("Cannot upload this file. Please select another file.");
        }
    }

    return (
        <form className="generic-form">
            <h1 className="generic-form-title">Form Title</h1>
            
            <label className="generic-form-label">Label 1</label>
            <input className="generic-form-input" type="text" placeholder="Placeholder 1"/>

            { uploadImgStatus && <ImageUpload getFileForUpload={getFileForUpload}/>}

            <button className="generic-form-button" type="submit" onClick={handleClick}>Submit</button>
        </form>
    )
}

export default Form;
